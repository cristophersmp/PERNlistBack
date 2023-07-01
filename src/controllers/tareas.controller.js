// Importa el objeto pool desde db.js
require("dotenv").config();
const { query } = require("express");
const pool = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const llaveSecreta = process.env.SECRET;

//:::::::::::::::CALLBACKS PARA TAREAS:::::::::::::::::::::
//Muestra todas las tareas
const getTareas = async (req, res, next) => {
  try {
    const allTasks = await pool.query("SELECT * FROM tareas");
    res.json(allTasks.rows);
  } catch (error) {
    next(error);
  }
};

//Muestra solo una tarea
const getTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM tareas WHERE id = $1", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//Crea una tarea
const crearTarea = async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;

    const newTask = await pool.query(
      "INSERT INTO tareas (titulo, descripcion) VALUES($1, $2) RETURNING *",
      [titulo, descripcion]
    );

    res.json(newTask.rows[0]);
  } catch (error) {
    next(error);
  }
};

//Elimina un tarea
const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM tareas WHERE id = $1", [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Task not found" });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

//Edita una tarea
const editarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    const result = await pool.query(
      "UPDATE tareas SET titulo = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [titulo, descripcion, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//:::::::::::::::CALLBACKS PARA USUARIOS:::::::::::::::::::::
// Registra una usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    // Verificar si el correo ya está registrado
    const result = await pool.query(
      "SELECT * FROM tablausuarios WHERE correo = $1",
      [correo]
    );
    if (result.rows.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    // Guardar el nuevo usuario en la base de datos
    await pool.query(
      "INSERT INTO tablausuarios (nombre, correo, contrasena) VALUES ($1, $2, $3)",
      [nombre, correo, contrasenaEncriptada]
    );

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar el usuario" });
  }
};

const loguearUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Verificar si el correo está registrado
    const result = await pool.query(
      "SELECT * FROM tablausuarios WHERE correo = $1",
      [correo]
    );
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const usuario = result.rows[0];

    // Verificar si la contraseña es correcta
    const esContrasenaCorrecta = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );
    if (!esContrasenaCorrecta) {
      return res
        .status(400)
        .json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: usuario.id }, llaveSecreta, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};
//::::::::::::::::::::::::::::::::::::::::::::
const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};

//::::::::::::::::::::::::::::::::::::::::::::

//Exporta los controladores de ruta
module.exports = {
  getTareas,
  getTarea,
  crearTarea,
  eliminarTarea,
  editarTarea,
  loguearUsuario,
  crearUsuario,
  verificarToken,
};

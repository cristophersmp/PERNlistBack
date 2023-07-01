// Importación del objeto Router de express
const { Router } = require("express");
// Importación de las funciones CRUD
const {
  getTareas,
  getTarea,
  crearTarea,
  eliminarTarea,
  editarTarea,
  loguearUsuario,
  crearUsuario,
  verificarToken,
} = require("../controllers/tareas.controller.js");

// Crea una instancia del enrrutador
const router = Router();

//:::::::::::::::RUTAS PARA TAREAS:::::::::::::::::::::
//Ruta GET para traer todas las tareas
router.get("/tareas", getTareas, verificarToken);

//Ruta POST para la creación de una tarea
router.post("/tareas", crearTarea, verificarToken);

//Ruta GET para traer solo una tareas según su id
router.get("/tareas/:id", getTarea);

//Ruta DELETE para eliminar una tarea según su id
router.delete("/tareas/:id", eliminarTarea);

//Ruta PUT para editar una tarea según su id
router.put("/tareas/:id", editarTarea);

//:::::::::::::::RUTAS PARA USUARIOS:::::::::::::::::::::
//Ruta POST para la creación de un usuario
router.post("/post/registro", crearUsuario);
//Ruta POST para el login del usuario
router.post("/post/login", loguearUsuario);

//Exportación de las rutas con sus métodos
module.exports = router;

// Importación de módulos
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Importa el archivo de router de tareas
const router = require("./routes/tareas.rutas.js");

// Crea una instancia de la aplicación express
const app = express();

// Declaración de uso de módulos Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Declaración de uso del router
app.use(router);

// Middlewares de manejo de errores
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});
// Declaración y uso del puerto
const puerto = 3000; // Definir el número de puerto
app.listen(puerto); // Escuchar en el puerto especificado
console.log(`Servidor corriendo en el puerto ${puerto}`); // Mostrar un mensaje en la consola indicando el puerto en el que se está ejecutando el servidor

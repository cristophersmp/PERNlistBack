// Importa el módulo Pool del paquete "pg"
const { Pool } = require("pg");

// Importa la configuración de la base de datos
const { db } = require("./config");

// Crear una instancia de Pool con la configuración de la base de datos
const pool = new Pool({
  user: db.user, // Usuario de la base de datos
  password: db.password, // Contraseña de la base de datos
  host: db.host, // Host de la base de datos
  port: db.port, // Puerto de la base de datos
  database: db.database,
});

// Exporta el objeto pool
module.exports = pool;

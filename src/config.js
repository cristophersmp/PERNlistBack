// Importa el método config del módulo dotenv
const { config } = require("dotenv");
// Carga las variables de entorno desde el archivo .env
config();
//Exportación de db
module.exports = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    api_secret: process.env.SECRET,
    api_token_expired_time: 86400,
  },
};

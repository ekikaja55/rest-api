require("dotenv").config();

module.exports = {
  koneksi_buku: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
};

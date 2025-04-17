const sequelize = require("sequelize");
const config = require("../config/config");

// 1. buat sequelize-nya
const host = config.koneksi_buku.host;
const username = config.koneksi_buku.username;
const password = config.koneksi_buku.password;
const database = config.koneksi_buku.database;
const dialect = config.koneksi_buku.dialect;
const port = config.koneksi_buku.port;

const connectionBuku = new sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
});

const setSqlMode = async () => {
  try {
    await connectionBuku.query("SET SESSION sql_mode = ''");
    console.log("Mati semua modenya di session");
  } catch (error) {
    console.error(error);
  }
};
setSqlMode();

module.exports = connectionBuku;

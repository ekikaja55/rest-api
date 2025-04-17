// inisialisasi
const db = {};
const { DataTypes } = require("sequelize");
const connectionBuku = require("../database/connectionBuku");

const Buku = require("./Buku");
const KategoriBuku = require("./KategoriBuku");
const Pengguna = require("./Pengguna");
const Toko = require("./Toko");
const TokoBuku = require("./TokoBuku");
const ApiLog = require("./ApiLog");
const ApiTierlist = require("./ApiTierlist");

// daftarkan semua model kita ke db ini
db.Buku = Buku(connectionBuku, DataTypes);
db.Toko = Toko(connectionBuku, DataTypes);
db.KategoriBuku = KategoriBuku(connectionBuku, DataTypes);
db.Pengguna = Pengguna(connectionBuku, DataTypes);
db.TokoBuku = TokoBuku(connectionBuku, DataTypes);
db.ApiLog = ApiLog(connectionBuku, DataTypes);
db.ApiTierlist = ApiTierlist(connectionBuku, DataTypes);

// kita associatekan
// db.Buku.associate(db);
// db.Toko.associate(db);
// ...
// db.ApiTierlist.associate(db);

for (const key of Object.keys(db)) {
  db[key].associate(db);
}

module.exports = db;

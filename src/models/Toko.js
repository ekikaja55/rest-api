"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Toko extends Model {
    static associate(models) {
      Toko.belongsTo(models.Pengguna, {
        foreignKey: "pengguna_id", // pengguna_id di Toko (FK)
        targetKey: "pengguna_id", // pengguna_id di Pengguna (PK)
      });

      // many to many pasti pakai belongsToMany
      // khusus many to many, foreignKey adalah nama kolom model ini di pivot
      // otherKey adalah kolom untuk target kita di pivot
      Toko.belongsToMany(models.Buku, {
        foreignKey: "toko_id", // kolom toko_id di tabel pivot TokoBuku (selalu punya saya)
        otherKey: "buku_id", // kolom buku_id (target kita) di tabel pivot TokoBuku
        through: models.TokoBuku, // Toko ketemu Buku lewat tabel pivot models.TokoBuku
      });
    }
  }
  Toko.init(
    {
      toko_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      toko_nama: {
        type: DataTypes.STRING,
      },
      pengguna_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
    },
    {
      sequelize,
      modelName: "toko",
      tableName: "toko",
      paranoid: true,
      name: {
        singular: "Toko",
        plural: "Toko",
      },
    }
  );
  return Toko;
};

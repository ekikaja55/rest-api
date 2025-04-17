"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pengguna extends Model {
    static associate(models) {
      Pengguna.hasOne(models.Toko, {
        foreignKey: "pengguna_id", // pengguna_id di Toko (FK)
        sourceKey: "pengguna_id", // pengguna_id di Pengguna (PK)
      });
    }
  }
  Pengguna.init(
    {
      pengguna_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      pengguna_nama: {
        type: DataTypes.STRING,
      },
      pengguna_jk: {
        type: DataTypes.ENUM(["pria", "wanita"]),
      },
      pengguna_password: {
        type: DataTypes.TEXT,
      },
      api_key: {
        type: DataTypes.TEXT,
      },
      refresh_token: {
        type: DataTypes.TEXT,
      },
      roles: {
        type: DataTypes.TEXT,
      },
      api_level: {
        type: DataTypes.TEXT,
      },
      api_quota: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "pengguna",
      tableName: "pengguna",
      paranoid: true,
      name: {
        singular: "Pengguna",
        plural: "Pengguna",
      },
    }
  );
  return Pengguna;
};

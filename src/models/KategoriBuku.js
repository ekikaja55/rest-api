"use strict";
const { Model } = require("sequelize");

/**
 * parameter yang dia minta adalah:
 * sequelize disini adalah KONEKSI KITA (connectionBuku)
 * DataTypes disini pakai datatypesnya sequelize
 * */
module.exports = (sequelize, DataTypes) => {
  /**
   * kita buat classnya, extends Model Nya Sequelize
   * STATIC FUNCTION ASSOCIATE adalah tempat kita mendaftarkan RELATIONSHIP-nya
   * */
  class KategoriBuku extends Model {
    static associate(models) {
      // saya berpacaran dengan si dia, buktinya adalah PK & FK
      KategoriBuku.hasMany(models.Buku, {
        foreignKey: "kategori_id", // kategori_id di tabel buku (fk)
        sourceKey: "kategori_id", // kategori_id di tabel kategori buku (PK)
      });
    }
  }

  /**
   * Function init menerima 2 parameter
   * parameter #1 : untuk mendeskripsikan kita punya kolom apa saja?
   * parameter #2 : mendeskripsikan informasi/config lain, nama tabel?, konek kemana?, softDelete?
   */
  KategoriBuku.init(
    {
      kategori_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      kategori_nama: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize, //koneksi
      modelName: "kategori_buku",
      tableName: "kategori_buku",
      name: {
        singular: "KategoriBuku",
        plural: "KategoriBuku",
      },
      timestamps: true, // nanti di database ini akan ada kolom createdAt dan updatedAt
      paranoid: true, // mengaktifkan deletedAt

      // // menyesuaikan dengan nama kolom di database
      //   createdAt: "created_at",
      //   updatedAt: "updated_at",
      //   deletedAt: "deleted_at",
    }
  );

  // return class nya
  return KategoriBuku;
};

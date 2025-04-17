"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Buku extends Model {
    static associate(models) {
      Buku.belongsTo(models.KategoriBuku, {
        foreignKey: "kategori_id", // kategori_id di tabel buku (fk)
        targetKey: "kategori_id", // kategori_id di tabel kategori buku (pk)
      });

      // khusus untuk many to many
      Buku.belongsToMany(models.Toko, {
        foreignKey: "buku_id", // yang saya punya
        otherKey: "toko_id", // punya target
        through: models.TokoBuku,
      });
    }
  }
  Buku.init(
    {
      buku_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      buku_nama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // get supaya ketika kita menarik datanya, maka otomatis di format sesuai yang kita mau
        get() {
          const val = this.getDataValue("buku_nama");
          return val ? val.toUpperCase() : null;
        },
        // set supaya ketika user insert ke database, maka otomatis nilainya di format seperti yang kita mau
        set(value) {
          this.setDataValue("buku_nama", value.toUpperCase());
        },
      },
      buku_tahun_terbit: {
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: true,
          min: {
            args: [1900],
            msg: "Tidak boleh kurang dari 1900",
          },
        },
      },
      kategori_id: {
        type: DataTypes.BIGINT,
      },
      keterangan_lengkap: {
        type: DataTypes.VIRTUAL,
        get() {
          return `Buku berjudul ${this.buku_nama} tahun ${this.buku_tahun_terbit}`;
        },
        set() {
          throw new Error("Tidak boleh membuat field keterangan lengkap");
        },
      },
    },
    {
      sequelize,
      modelName: "buku",
      tableName: "buku",
      name: {
        singular: "Buku",
        plural: "Buku",
      },
      timestamps: true,
      paranoid: true,
    }
  );
  return Buku;
};

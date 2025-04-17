const { Sequelize, Op } = require("sequelize");
const { Buku, Toko, KategoriBuku, Pengguna } = require("../models");

// const queryBuku = async (req, res) => {
//   // GET http://localhost:3000/api/v1/bukuorm

//   // where: { buku_nama: "WAWA", buku_tahun_terbit: 2000 }, // WHERE buku_nama = "WAWA"
//   const { keyword } = req.query;

//   const result = await Buku.findAll({
//     attributes: [
//       "buku_id",
//       "buku_nama",
//       "buku_tahun_terbit",
//       "keterangan_lengkap",
//     ],
//     order: [["buku_id", "desc"]],
//     // limit: 100,
//     offset: 0,
//     where: {
//       [Op.or]: [
//         { buku_nama: { [Op.like]: `%${keyword}%` } },
//         {
//           [Op.and]: [
//             { buku_tahun_terbit: { [Op.gte]: 1900, [Op.lte]: 2100 } },
//             { kategori_id: { [Op.not]: null } },
//           ],
//         },
//       ],
//     },

//     // WHERE buku_nama like '%keyword%' OR
//     // ((buku_tahun_terbit >= 1900 AND buku_tahun_terbit <= 2100 ) and kategori_id not null)
//   });

//   if (result.length > 0) {
//     return res.status(200).json(result);
//   } else {
//     return res.status(404).json({ pesan: "data tidak ditemukan" });
//   }
// };

const queryBuku = async (req, res) => {
  // KALAU BUNTU MAPPING
  const result = await Buku.findAll({
    attributes: [
      "buku_id",
      "buku_nama",
      [Sequelize.literal("KategoriBuku.kategori_nama"), "kategori_nama"],
      [
        Sequelize.fn("SUM", Sequelize.literal("`Toko->toko_buku`.`tb_stok`")),
        "jumlahStokKeseluruhan",
      ],
    ],
    include: [
      { model: KategoriBuku, attributes: [] },
      {
        model: Toko,
        through: { attributes: [] },
        attributes: [
          [Sequelize.literal("`Toko->Pengguna`.`pengguna_nama`"), "owner"],
        ],
        include: [{ model: Pengguna, attributes: [] }],
      },
    ],
    group: ["buku_id"],
  });
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ pesan: "data tidak ditemukan" });
  }
};

const getSingleBuku = async (req, res) => {
  // http://localhost:3000/api/v1/bukuorm/3
  const { buku_id } = req.params;
  const result = await Buku.findByPk(buku_id, {
    attributes: [
      "buku_nama",
      "buku_tahun_terbit",
      [
        Sequelize.fn("LOWER", Sequelize.literal("buku_nama")),
        "buku_nama_lower",
      ], // LOWER(buku_nama) as buku_nama_lower, supaya gampang boleh pakai Sequelize.col atau Sequelize.literal
    ],
  });
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json("Tidak Ditemukan");
  }
};
const storeBuku = async (req, res) => {
  const { buku_nama, buku_tahun_terbit, kategori_id } = req.body;
  try {
    const result = await Buku.create({
      buku_nama,
      buku_tahun_terbit,
      kategori_id,
    });
    console.log(result);

    if (result) {
      return res
        .status(200)
        .json({ pesan: `Sukses Insert dengan id ${result.buku_id}` });
    } else {
      return res.status(500).json({ pesan: "Silakan coba lagi" });
    }
  } catch (error) {
    return res.status(500).json({ pesan: error.message });
  }
};
const updateBuku = async (req, res) => {
  const { buku_id } = req.params;
  const { buku_nama, buku_tahun_terbit, kategori_id } = req.body;
  const bukuYangMauDiubah = await Buku.findByPk(buku_id);
  if (!bukuYangMauDiubah) {
    return res.status(404).json({ pesan: "Buku tidak ditemukan" });
  }

  // kalau bukunya ada
  const result = await bukuYangMauDiubah.update({
    buku_nama,
    buku_tahun_terbit,
    kategori_id,
  });

  return res
    .status(200)
    .json({ pesan: `Buku dengan id ${result.buku_id} berhasil diupdate` });
};
const deleteBuku = async (req, res) => {
  const { buku_id } = req.params;
  const bukuYangMauDiHapus = await Buku.findByPk(buku_id);
  if (!bukuYangMauDiHapus) {
    return res.status(404).json({ pesan: "Buku tidak ditemukan" });
  }

  // kalau bukunya ada
  const result = await bukuYangMauDiHapus.destroy();
  // const result = await bukuYangMauDiHapus.restore();

  return res
    .status(200)
    .json({ pesan: `Buku dengan id ${result.buku_id} berhasil dihapus` });
};

const contohRelasi = async (req, res) => {
  // eager loading
  // const pengguna = await Pengguna.findAll({ include: Toko });
  // const result = pengguna.map((item) => {
  //   return {
  //     pengguna_nama: item.pengguna_nama,
  //     toko_nama: item.Toko.toko_nama,
  //   };
  // });
  // lazy loading
  // const pengguna = await Pengguna.findByPk(1);
  // return res.status(200).json({
  //   pengguna: pengguna,
  //   toko: await pengguna.getToko(),
  // });
  // contoh lazy loading di model antara kategori dengan buku
  // const kategori = await KategoriBuku.findByPk(1);
  // return res.status(200).json({
  //   kategori: kategori,
  //   buku: await kategori.getBuku(),
  // });

  // contoh insert buku sekaligus kategori
  // const body = req.body;
  // const kategori = await KategoriBuku.findByPk(2);
  // const result = await kategori.createBuku(body);
  // return res.status(200).json(result);

  // contoh insert ke tabel pivot dari relasi many to many, misal toko 3 akan stok buku nomor 10, sebanyak 66
  // cari dulu toko dan cari buku nya, stelah itu baru digandeng
  const body = req.body;
  const toko = await Toko.findByPk(3);
  const buku = await Buku.findByPk(10);
  // // tambahi data ke tabel pivot (toko_buku)
  // kalau di laravel seperti attach
  // const result = await toko.addBuku(buku, {
  //   through: { tb_stok: body.tb_stok },
  // });

  // // UBAH data tb_stok di tabel pivot (toko_buku)
  // kalau di laravel seperti attach
  // const result = await buku.addToko(toko, {
  //   through: { tb_stok: body.tb_stok },
  // });

  // // HAPUS data di tabel pivot (toko_buku)
  // kalau di laravel seperti detach
  const result = await buku.removeToko(toko);
  return res.status(200).json(result);
};

module.exports = {
  queryBuku,
  getSingleBuku,
  storeBuku,
  updateBuku,
  deleteBuku,
  contohRelasi,
};

/**
 * Cara gooo aaron
 * 
 * 
 * try {
    const result = await Buku.update(
      { buku_nama, buku_tahun_terbit, kategori_id },
      { where: { buku_id } }
    );
    if (result[0] === 0) {
      return res
        .status(404)
        .json({ message: `Buku with ID ${buku_id} not found` });
    }
    return res.status(200).json({ message: `Buku with ID ${buku_id} updated` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
 * 
 *  */

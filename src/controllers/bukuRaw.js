// kita akan bermain dengan database, database hasilnya bisa kembali dalam waktu yang bervariasi
// kita akan menunggu kembalian dari database kita

const { QueryTypes } = require("sequelize");
const db = require("../database/connectionBuku");

// kita akan pakai await dan async function
const getBuku = async (req, res) => {
  let result;

  // kita mau nembak database, ingat database itu tidak tau selesainya kapan
  // bila kita langsung minta hasil db.query, keluarnya promise (janji bahwa nanti akan di kasi datanya)
  // kita await supaya nanti ketika selesai dan promisenya dipenuhi, kita dapat datanya
  // await harus dimasukkan async function

  const keyword = "of";
  result = await db.query(
    "SELECT * FROM buku JOIN kategori_buku ON kategori_buku.kategori_id = buku.kategori_id WHERE buku_nama like ?",
    {
      type: QueryTypes.SELECT,
      replacements: [`%${keyword}%`],
    }
  );
  console.log(result);

  return res.status(200).json(result);
};
const getOneBuku = async (req, res) => {};

const insertBuku = async (req, res) => {
  const { buku_nama, buku_tahun_terbit, kategori_id } = req.body;
  // const result = await db.query(
  //   "INSERT INTO buku(buku_nama,buku_tahun_terbit,kategori_id) VALUES(?,?,?)",
  //   {
  //     type: QueryTypes.INSERT,
  //     replacements: [buku_nama, buku_tahun_terbit, kategori_id],
  //   }
  // );
  const result = await db.query(
    "INSERT INTO buku(buku_nama,buku_tahun_terbit,kategori_id) VALUES(:buku_nama,:buku_tahun_terbit,:kategori_id)",
    {
      type: QueryTypes.INSERT,
      replacements: {
        buku_nama: buku_nama,
        buku_tahun_terbit: buku_tahun_terbit,
        kategori_id: kategori_id,
      },
    }
  );
  if (result) {
    console.log(result);
    return res.status(200).json(`Berhasil Insert dengan id ${result[0]}`);
  } else {
    return res.status(500).json("gagal insert");
  }
};

const updateBuku = async (req, res) => {};
const deleteBuku = async (req, res) => {};

module.exports = {
  getBuku,
  getOneBuku,
  insertBuku,
  updateBuku,
  deleteBuku,
};

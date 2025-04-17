const express = require("express");
const {
  contohQuery,
  contohParams,
  contohPost,
  contohArrayFunction,
} = require("../controllers/contoh");
const router = express.Router();

router.get("/contohquery", contohQuery);

// localhost:3000/api/v1/contoh/contohurl/mario/umur/70
router.get("/contohurl/:nama/umur/:umur", contohParams);

router.post("/contohpost", contohPost);

router.get("/contohaf", contohArrayFunction);

module.exports = router;

/**
 * API MATURITY LEVEL
 *
 * CRUD = create read update delete
 *
 * READ semua data mahasiswa -> GET /api/v1/mhs
 * READ 1 data mahasiswa -> GET /api/v1/mhs/:nrp
 * CREATE -> POST /api/v1/mhs
 * UPDATE -> PUT  /api/v1/mhs/:nrp
 * DELETE -> DELETE /api/v1/mhs/:nrp
 *
 */

// /api/v1/tambahBuku
// /api/v1/addPegawai
// /api/v1/createCategory

// POST /api/v1/buku
// POST /api/v1/pegawai
// POST /api/v1/kategori

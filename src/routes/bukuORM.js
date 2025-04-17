const express = require("express");
const router = express.Router();
const {
  queryBuku,
  getSingleBuku,
  storeBuku,
  updateBuku,
  deleteBuku,
  contohRelasi,
} = require("../controllers/bukuORM");

// http://localhost:3000/api/v1/bukuorm/contohrelasi

router.get("/", queryBuku);
// urutannya diperhatikan, ty yoshi
router.post("/contohrelasi", contohRelasi);
router.get("/:buku_id", getSingleBuku);
router.post("/", storeBuku);
router.put("/:buku_id", updateBuku);
router.delete("/:buku_id", deleteBuku);

module.exports = router;

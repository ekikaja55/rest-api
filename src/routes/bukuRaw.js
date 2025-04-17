const express = require("express");
const {
  getBuku,
  getOneBuku,
  insertBuku,
  updateBuku,
  deleteBuku,
} = require("../controllers/bukuRaw");
const router = express.Router();

// GET /api/v1/buku
router.get("/", getBuku);
// GET /api/v1/buku/777
router.get("/:buku_id", getOneBuku);
// POST /api/v1/buku
router.post("/", insertBuku);
// PUT|PATCH /api/v1/buku/777
router.put("/:buku_id", updateBuku);
// DELETE /api/v1/buku/777
router.delete("/:buku_id", deleteBuku);

module.exports = router;

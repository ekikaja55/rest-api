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
const verifyJWT = require("../middlewares/verifyJWT");
const checkRoles = require("../middlewares/checkRoles");

//semua pasang sekaligus
router.use([verifyJWT, checkRoles("admin")]);

router.get("/", queryBuku);
// urutannya diperhatikan, ty yoshi
router.post("/contohrelasi", contohRelasi);
router.get("/:buku_id", getSingleBuku);
router.post("/", storeBuku);
router.put("/:buku_id", updateBuku);
router.delete("/:buku_id", deleteBuku);

module.exports = router;

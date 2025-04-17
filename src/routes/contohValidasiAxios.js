const express = require("express");
const {
  validasiUser,
  validasiCustom,
  axiosAnime,
  axiosCat,
} = require("../controllers/contohValidasiAxios");
const router = express.Router();

router.post("/validasiuser", validasiUser);
router.post("/validasicustom", validasiCustom);
router.get("/axiosanime", axiosAnime);
router.get("/axioscat", axiosCat);

module.exports = router;

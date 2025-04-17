const express = require("express");
const {
  adminPage,
  managerPage,
  visitorPage,
} = require("../controllers/contohMiddleware");
const verifyJWT = require("../middlewares/verifyJWT");
const checkRoles = require("../middlewares/checkRoles");
const router = express.Router();

router.get("/admin", [verifyJWT, checkRoles("admin")], adminPage);
router.get("/manager",[verifyJWT, checkRoles("admin","manager")], managerPage);
router.get("/visitor",[verifyJWT, checkRoles("admin","manager","visitor")], visitorPage);

module.exports = router;

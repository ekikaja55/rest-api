const express = require("express");
const {
  adminPage,
  managerPage,
  visitorPage,
  testAPIKey,
  topup,
} = require("../controllers/contohMiddleware");

const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const checkRoles = require("../middlewares/checkRoles");
const {
  checkApiKey,
  kurangiQuota,
  checkQuota,
  logAccess,
  rateLimit,
} = require("../middlewares/apiKey");

router.get("/admin", [verifyJWT, checkRoles("admin")], adminPage);
router.get(
  "/manager",
  [verifyJWT, checkRoles("admin", "manager")],
  managerPage
);
router.get(
  "/visitor",
  [verifyJWT, checkRoles("admin", "manager", "visitor")],
  visitorPage
);

//hati2 sama urutan nulis middleware
router.get(
  "/testapikey",
  [checkApiKey, rateLimit, logAccess, checkQuota, kurangiQuota],
  testAPIKey
);

router.get("/topup", [checkApiKey], topup);

module.exports = router;

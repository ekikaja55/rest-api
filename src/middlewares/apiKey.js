const { Op } = require("sequelize");
const { Pengguna, ApiTierlist, ApiLog } = require("../models");

const checkApiKey = async (req, res, next) => {
  //step 1 : api key apakah sudah disertakan pada header request

  //keliatannya sebaiknya nama key dari req.headers.apikey kita kecil semua
  const apikey = req.headers.apikey;

  //step 2 : cek apakah api key tersebut ada atau tidak
  if (!apikey) {
    return res.status(401).json("Tidak Ada API Key");
  }

  //step 3 : cek apakah api key benar dan ada user yang punya?

  const pengguna = await Pengguna.findOne({
    where: {
      api_key: apikey,
    },
  });
  if (!pengguna) {
    return res.status(401).json("Api Key Salah");
  }

  //step 4 :kasi tau siapa  yang lagi login sekarang

  req.yanglogin = pengguna;

  //step 5 : jangan pernah lupa kondisi next
  next();
};

const rateLimit = async (req, res, next) => {
  //step 1 : ambil dulu data tier dulu agar tau user tersebut sejauh apa

  const kapasitasUser = await ApiTierlist.findByPk(req.yanglogin.api_level);

  //step 2 : cari tau user tersebut sudah menembak  api kita berapa kali?
  const jumlahPemakaian = await ApiLog.count({
    where: {
      pengguna_id: req.yanglogin.pengguna_id,
      createdAt: { [Op.gte]: Date.now() - 10 * 1000 },
    },
  });

  if (
    req.yanglogin.api_level !== "premium" &&
    jumlahPemakaian >= kapasitasUser.api_limit
  ) {
    return res.sendStatus(429);
  }

  next();
};

const logAccess = async (req, res, next) => {
  await ApiLog.create({
    pengguna_id: req.yanglogin.pengguna_id,
  });
  next();
};

const checkQuota = async (req, res, next) => {
  if (req.yanglogin.api_level !== "premium" && req.yanglogin.api_quota <= 0) {
    return res.status(400).json("Quota Kamu Sudah Habis");
  }
  next();
};

const kurangiQuota = async (req, res, next) => {
  //func increment / decrement itu update database dengan incrementing atau decrementing

  if (req.yanglogin.api_level !== "premium") {
    await req.yanglogin.increment({ api_quota: -1 });
    // await req.yanglogin.decrement({ api_quota: 1 });
  }
  next();
};

module.exports = {
  checkApiKey,
  rateLimit,
  logAccess,
  checkQuota,
  kurangiQuota,
};

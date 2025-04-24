const adminPage = async (req, res) => {
  return res
    .status(200)
    .json({ pesan: `Halo admin, ${req.yanglogin.pengguna_nama}` });
};
const managerPage = async (req, res) => {
  return res.status(200).json({ pesan: `Halo manager` });
};
const visitorPage = async (req, res) => {
  return res.status(200).json({ pesan: `Halo visitor` });
};

const testAPIKey = async (req, res) => {
  return res
    .status(200)
    .json(
      `Anda Mengakses Enpoint ini setelah lolos pengecekan api key, Halo ${req.yanglogin.pengguna_nama}`
    );
};

const topup = async (req, res) => {
  if (req.yanglogin.api_level === "premium") {
    return res
      .status(200)
      .json(
        "Anda adalah premium user ( sistem tanpa quota ). Kartu kredit anda akan ditagih lagi pada tanggal 5 januari 2026"
      );
  } else {
    await req.yanglogin.increment({ api_quota: 10 });
    return res.status(200).json("Kuota sudah nambah 10, enjoy");
  }
};
module.exports = { adminPage, managerPage, visitorPage, testAPIKey, topup };

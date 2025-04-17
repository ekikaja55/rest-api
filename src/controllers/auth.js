const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { Pengguna } = require("../models");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  //1. ambil inputan dari user
  const { pengguna_nama, pengguna_password, pengguna_jk } = req.body;
  //2. hash dulu passwordnya sebelum disimpan di database
  const hashedPassword = await bcryptjs.hash(pengguna_password, 10);
  //3. randomkan api key untuk user
  // api key bisa dipakai oleh user kita untuk dipasang di program
  const apikey = crypto.randomUUID();

  //4. insert ke database
  const result = await Pengguna.create({
    pengguna_nama: pengguna_nama,
    pengguna_password: hashedPassword,
    pengguna_jk: pengguna_jk,
    api_key: apikey,
    roles: "visitor",
  });

  return res.status(200).json(result);
};
const login = async (req, res) => {
  // 1. Ambil data dari user
  const { pengguna_nama, pengguna_password } = req.body;

  // 2. cari usernya ada apa tidak
  const pengguna = await Pengguna.findOne({
    where: { pengguna_nama: pengguna_nama },
    attributes: [
      "pengguna_id",
      "pengguna_nama",
      "pengguna_jk",
      "pengguna_password",
      "roles",
    ],
  });

  if (!pengguna) {
    return res.status(404).json({ pesan: "Gagal Login" });
  }

  // 4. Kalau usernya ada, compare!
  const cekpassword = await bcryptjs.compare(
    pengguna_password,
    pengguna.pengguna_password
  );

  if (cekpassword) {
    // 5. kalau password cocok maka
    // HATI HATI BUANGETT HAPUS DULU DATA PASSWORD DARI VARIABLE, BARU DIBUAT JWTNYA
    pengguna.pengguna_password = undefined;

    //6. buat access token
    const accessToken = jwt.sign(
      { pengguna },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    // buat refresh token
    const refreshToken = jwt.sign(
      { pengguna },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    //8. catat refresh token ke database
    const updatePengguna = await Pengguna.findByPk(pengguna.pengguna_id);
    await updatePengguna.update({
      refresh_token: refreshToken,
    });

    //9. catat refresh token pada cookie
    res.cookie("refreshtokensaya", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 1000,
    });

    //10. pastikan access token kembali ke usernya
    return res
      .status(200)
      .json({ pesan: "Berhasil login", token: accessToken });
  } else {
    //kalau password salah maka
    return res.status(401).json({ pesan: "Gagal Login" });
  }
};

const refreshToken = async (req, res) => {
  // 1. baca refresh token dari cookie
  const cookies = req.cookies;
  if (!cookies?.refreshtokensaya) {
    // kalau cookienya tidak ada
    return res.sendStatus(401);
  }

  // 2. kalau ada mari kita pakai dan cek
  const refreshToken = cookies.refreshtokensaya;
  const pengguna = await Pengguna.findOne({
    where: { refresh_token: refreshToken },
    attributes: [
      "pengguna_id",
      "pengguna_nama",
      "pengguna_jk",
      "pengguna_password",
      "roles",
    ],
  });

  // 3. cek data pengguna kalau tidak ketemu
  if (!pengguna) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      pengguna.pengguna_password = undefined;

      // 6. buat access token
      const accessToken = jwt.sign(
        { pengguna },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      return res.status(200).json(accessToken);
    }
  });
};

//tujuannya adalah hapus refresh token dari database dan cookies
const logout = async (req, res) => {
  //1. cari dulu cookies kita tadi
  const cookies = req.cookies;
  if (!cookies?.refreshtokensaya) {
    // kalo cookienya tidak ada, ya bagus dong berarti kan sudah ke logout
    return res.sendStatus(204); //204 OK / sukses tanpa pesan kembalian apapun;
  }

  //2. lah kalo misalnya masih ada cookie yang menyimpan refresh token user??? gimana??
  //ambil dulu isi dari refresh token kita

  const refreshToken = cookies.refreshtokensaya;

  const pengguna = await Pengguna.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (pengguna) {
    //kalo penggunanya ketemu buang refresh token dari tabel nya

    await pengguna.update({
      refresh_token: null,
    });
    res.clearCookie("refreshtokensaya", { httpOnly: true });
    return res.status(200).json({ pesan: "berhasil logout" });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};

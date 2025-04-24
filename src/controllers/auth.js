const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { Pengguna } = require("../models");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  // 1. ambil inputan dari user
  const { pengguna_nama, pengguna_password, pengguna_jk } = req.body;

  // 2. hash dulu passwordnya sebelum di simpan di database
  const hashedPassword = await bcryptjs.hash(pengguna_password, 10);

  // 3. randomkan api key untuk user
  // api key bisa dipakai oleh user kita untuk dipasang di program
  const apikey = crypto.randomUUID();

  // 4. insert ke database
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
  // 1. ambil data dari user
  const { pengguna_nama, pengguna_password } = req.body;

  // 2. cari usernya ada apa tidak
  // select * from pengguna where pengguna_nama="mimi"
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

  // 3. kalau pengguna tidak ditemukan
  if (!pengguna) {
    return res.status(401).json({ pesan: "Gagal Login" });
  }

  // 4. kalau user data, compare!
  // parameter 1 : adalah password inputan user, parameter 2 : adalah password yang sudah terhash dari database
  const cekpassword = await bcryptjs.compare(
    pengguna_password,
    pengguna.pengguna_password
  );

  if (cekpassword) {
    // 5. kalau password cocok maka
    // HATI-HATI BUANGETTTTT, HAPUS DULU DATA PASSWORD DARI VARIABLE, BARU DIBUAT JWTNYA
    pengguna.pengguna_password = undefined;

    // 6. buat access token
    const accessToken = jwt.sign(
      { pengguna },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    // 7. buat refresh token
    const refreshToken = jwt.sign(
      { pengguna },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    // 8. catat refresh token ke database
    const updatePengguna = await Pengguna.findByPk(pengguna.pengguna_id);
    await updatePengguna.update({ refresh_token: refreshToken });

    // 9. catat refresh token pada cookie
    res.cookie("refreshtokensaya", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 1000,
    });

    // 10. pastikan access Token kembali ke usernya
    return res.status(200).json({ pesan: "Sukses Login", token: accessToken });
  } else {
    // Kalau password salah
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

const logout = async (req, res) => {
  // TUJUAN LOGOUT ADALAH menghapus refresh token di cookie dan di database, supaya usernya tidak bisa minta REFRESH DAN TIDAK BISA DAPAT ACCESS TOKEN BARU
  // 1. BACA DULU REFRESH TOKEN DARI COOKIE
  const cookies = req.cookies;
  if (!cookies?.refreshtokensaya) {
    // kalau ketika di cek, ternyata tidak ada refresh token di cookie, berarti user tersebut belum pernah login sebelumnya
    return res.status(204); // 204 success tapi tidak ada konten
  }

  // 2. Misalnya ternyata cookie menyimpan refresh token, maka ambil dulu refresh token tersebut
  const refreshToken = cookies.refreshtokensaya;

  // 3. cari dari database, ada yang punya refresh token tersebut atau tidak, kalau ada, maka hapus refresh token dari user tersebut
  const pengguna = await Pengguna.findOne({
    where: { refresh_token: refreshToken },
  });
  if (pengguna) {
    // kalau ketemu, maka hapus refresh token tersebut dari user tersebut
    await pengguna.update({ refresh_token: null });
  }

  // 4. hapus refresh token di cookie
  res.clearCookie("refreshtokensaya", { httpOnly: true });

  return res.status(200).json({ pesan: "Sukses Logout" });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};

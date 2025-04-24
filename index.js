/*
1. ciptakan url / endpoint dari ws/api kita
2. siapkan dan jalankan server
3. 
*/

// mengimport function express
const express = require("express");
const cookieParser = require("cookie-parser");

// memanggil function express dimasukkan ke const bernama app
const app = express();

// kita punya const port dengan nilai 3000
const port = 3000;

// PENTING!!! AKTIFKAN DOTENV
require("dotenv").config();

// SUPAYA KITA BISA BACA BODY DALAM BENTUK FORM-ENCODE MAUPUN JSON, TAMBAHKAN 2 BARIS INI
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//PAKAI / GUNAKAN COOKIE PARSER KITA
app.use(cookieParser());

// menciptakan url/endpoint dengan alamat localhost:3000
// shortcutnya adalah nexget
// bila arrow function tidak pakai {}, maka diasumsikan lagi melakukan return
app.get("/", (req, res) => res.send("Ko pulang poo"));

const {
  contohRouter,
  bukuRawRouter,
  bukuORMRouter,
  contohValidasiAxiosRouter,
  authRouter,
  contohMiddlewareRouter,
} = require("./src/routes");
// localhost:3000/api/v1/contoh
app.use("/api/v1/contoh", contohRouter);
app.use("/api/v1/buku", bukuRawRouter);
app.use("/api/v1/bukuorm", bukuORMRouter);
app.use("/api/v1/validasiaxios", contohValidasiAxiosRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/contohmiddleware", contohMiddlewareRouter);

// menjalankan server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// // kalau di ujian/praktikum monggo kalian bikin di satu file index.js
// app.get("/contoh", (req, res) => {
//   console.log(req.query);
//   console.log(req.query.nama);

//   // const {} = suatuObject, bisa digunakan untuk mengambil property tertentu saja
//   const { nama, alamat } = req.query;
//   console.log(nama);
//   console.log(alamat);

//   return res.status(200).json(req.query);
// });

// npm install secara global(-g) sebuah package bernama nodemon
// npm i -g nodemon

// npx nodemon index
/**
 *
 * Cara mendapatkan input user
 *
 * 1. query contoh abc.com?nama=jojo&umur=70
 * 2. url parameter contoh abc.com/barang/B001
 * 3. POST contoh abc.com, data dikirim lewat body
 * 4. JSON
 * 5. FORM yang dilengkapi dengan encryption type multipart/form
 */

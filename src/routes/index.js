/**
 * Cara Go Aaron
 *
 * index.js disini untuk mendaftarkan semua VARIABLE/FUNCTION yang ada di FOLDER INI (contoh folder /src/routes)
 *  */

const contohRouter = require("./contoh");
const bukuRawRouter = require("./bukuRaw");
const bukuORMRouter = require("./bukuORM");
const contohValidasiAxiosRouter = require("./contohValidasiAxios");
const authRouter = require("./auth");
const contohMiddlewareRouter = require("./contohMiddleware");
module.exports = {
  contohRouter,
  bukuRawRouter,
  bukuORMRouter,
  contohValidasiAxiosRouter,
  authRouter,
  contohMiddlewareRouter,
};

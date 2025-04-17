//middleware nya tugasnya adalah
//menolak
//meneruskan request (next())
//meneruskan request (next()) sambil ganti isi request
//midlleware disini dipakai untuk mengecek apakah user ketika mengakses endpoint, sudah membawa access token yang valid

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  // kalau pakai postman atau pakai tc lalu menu Auth > Bearer maka
  //di header kalian akan ada databaru dengan nama key Authorization
  // Bearer token123

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    //kalau header kita tidak punya token maka tolak
    return res.status(404).json("Header tidak ada");
  }

  //Bearer Token123
  //setelah displit kembalian nya array
  const accessToken = authHeader.split(" ")[1];
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json("Invalid Token");
    }

    req.yanglogin = decoded.pengguna;
                
    next();
  });
};

module.exports = verifyJWT;

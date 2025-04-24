const { array } = require("joi");

const checkRoles = (...roleYangDiperbolehkan) => {
  return (req, res, next) => {
    // 1. asumsikan user tidak memiliki hak untuk memakai endpoint ini
    let bolehmasuk = false;

    // checkRoles("admin","manager")
    // ["admin","manager"]
    // 2. cek apakah user memiliki hak akses
    for (const r of roleYangDiperbolehkan) {
      if (req.yanglogin.roles.includes(r)) {
        bolehmasuk = true;
      }
    }

    if (!bolehmasuk) {
      return res.status(403).json("Role tidak cocok");
    }

    next();
  };
};

module.exports = checkRoles;

/**
    "pengguna_nama": "esther",
    "roles": "visitor"


    checkRoles("admin")
    checkRoles("manager")
    checkRoles("visitor")
    checkRoles("manager","visitor")
    checkRoles("admin","manager")
    checkRoles("admin","manager","visitor")

    variadic paramater
    
    hitung(a, b, c);
    hitung(...angka){
        angka adalah array

        for(let i = 0; i < angka.length; i++){
            
        }
    }
 */

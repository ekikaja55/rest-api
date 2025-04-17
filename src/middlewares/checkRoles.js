const checkRoles = (...roleYangDiperbolehkan) => {
  return (req, res, next) => {
    let bolehMasuk = false;

    //['admin','manager']
    for (const r of roleYangDiperbolehkan) {
      //visitor
      if (req.yanglogin.roles.includes(r)) {
        bolehMasuk = true;
      }
    }

    if (!bolehMasuk) {
      return res.status(403).json("Role Tidak Cocok");
    }
    
    next();
  };
};

module.exports = checkRoles;

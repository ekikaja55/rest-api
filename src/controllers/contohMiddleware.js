const adminPage = async (req, res) => {
  return res
    .status(200)
    .json(`halo admin namamu adalah ${req.yanglogin.pengguna_nama}`);
};
const managerPage = async (req, res) => {
  return res.status(200).json("halo manager");
};
const visitorPage = async (req, res) => {
  return res.status(200).json("halo visitor");
};

module.exports = { adminPage, managerPage, visitorPage };

const { default: axios } = require("axios");
const { userSchema, customSchema } = require("../utils/validation");

const validasiUser = async (req, res) => {
  try {
    let inputanuser = await userSchema.validateAsync(req.body, {
      abortEarly: false, // dibuat false supaya dia cek semua aturan dan tampilkan semua error untuk semua inputan
    });
    // inputanuser yang sesuai aturan bisa digunakan untuk misalnya insert ke database
    // const result = await Pengguna.create(inputanuser)
    return res.status(200).json(inputanuser);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const validasiCustom = async (req, res) => {
  try {
    let inputanuser = await customSchema.validateAsync(req.body, {
      abortEarly: false, // dibuat false supaya dia cek semua aturan dan tampilkan semua error untuk semua inputan
    });
    // inputanuser yang sesuai aturan bisa digunakan untuk misalnya insert ke database
    // const result = await Pengguna.create(inputanuser)
    return res.status(200).json(inputanuser);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const axiosAnime = async (req, res) => {
  // const response = await axios.get(
  //   "https://api.jikan.moe/v4/anime?q=jojo&rating=r17"
  // );
  const response = await axios.get("https://api.jikan.moe/v4/anime", {
    params: req.query,
  });
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.data);

  const animedata = response.data.data;

  const result = animedata.map((item) => {
    // return {
    //   mal_id: item.mal_id,
    //   title: item.title,
    //   image: item.images.jpg.image_url,
    //   genre: item.genres[0].name,
    // };
    return `Anime id: ${item.mal_id} bernama ${item.title} memiliki gambar ${item.images.jpg.image_url} ber-genre ${item.genres[0].name}`;
  });

  return res.status(200).json(result);
};
const axiosCat = async (req, res) => {
  const API_URL = process.env.CAT_URL;
  const API_KEY = process.env.CAT_KEY;

  const headerOpts = {
    headers: {
      "x-api-key": API_KEY,
    },
  };

  // dengan melakukan ini kita akan tembak https://api.thecatapi.com/v1/breeds, sekalian mengirim x-api-key kita (api key)
  const datajeniskucing = await axios.get(`${API_URL}/breeds`, headerOpts);
  return res.status(200).json(datajeniskucing.data);
};

module.exports = {
  validasiUser,
  validasiCustom,
  axiosAnime,
  axiosCat,
};

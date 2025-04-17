// controllers bertugas membuat function yang akan dipanggil

const contohQuery = (req, res) => {
  console.log(req.query);
  console.log(req.query.nama);

  // const {} = suatuObject, bisa digunakan untuk mengambil property tertentu saja
  const { nama, alamat } = req.query;
  console.log(nama);
  console.log(alamat);

  return res.status(200).json(req.query);
};

const contohParams = (req, res) => {
  const { nama, umur } = req.params;
  console.log(nama);
  console.log(umur);
  return res.status(200).json(req.params);
};

const contohPost = (req, res) => {
  const { nama, umur } = req.body;
  console.log(nama);
  console.log(umur);
  return res.status(200).json(req.body);
};
const contohArrayFunction = (req, res) => {
  let arr1 = [
    { nama: "jojo", umur: 40 },
    { nama: "giorno", umur: 100 },
    { nama: "jolyn", umur: 50 },
  ];
  arr1.push({ nama: "narancia", umur: 60 });

  let result = {};
  result.asli = arr1;

  // array function map

  // Nama jojo berumur 40
  // const contohmap = arr1.map((item) => {
  //   return `Nama ${item.nama} berumur ${item.umur}`;
  // });

  // map untuk mengubah bentuk itemnya
  // jika ketika map tidak memberikan {}, maka otomatis mode return
  const contohmap = arr1.map(
    (item) => `Nama ${item.nama} berumur ${item.umur}`
  );
  result.contohmap = contohmap;

  // find, untuk mencari data, kembaliannya 1 data saja
  // const contohfind = arr1.find((item) => {
  //   return item.nama.includes("jo");
  // });
  const contohfind = arr1.find((item) => item.nama.includes("jo"));
  result.contohfind = contohfind;

  // filter
  const contohfilter = arr1.filter((item) => {
    // return item.nama != "giorno";
    if (item.nama != "giorno") {
      return item;
    }
  });
  // const contohfilter = arr1.filter((item) => item.nama != "giorno");
  result.contohfilter = contohfilter;

  // reduce
  const contohreduce = arr1.reduce(
    (sipalingsenior, item) => {
      // return item.umur > sipalingsenior ? item.umur : sipalingsenior;
      if (item.umur > sipalingsenior.umur) {
        return item;
      } else {
        return sipalingsenior;
      }
    },
    { nama: "", umur: 0 }
  );
  // {nama:giorno,umur:100}
  result.contohreduce = contohreduce;

  return res.status(200).json(result);
};

module.exports = {
  contohQuery,
  contohParams,
  contohPost,
  contohArrayFunction,
};

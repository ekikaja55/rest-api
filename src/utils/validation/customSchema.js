const Joi = require("joi");
// panjang 9
// INV123456
// RTR123456

const customPengecekan = (value, helpers) => {
  if (value === "-") {
    return helpers.error("any.invalid");
  }

  if (value.length != 9) {
    throw new Error("Panjang Invoice tidak betul");
  }

  if (value.substr(0, 3) != "INV" && value.substr(0, 3) != "RTR") {
    throw new Error("Harus diawali INV atau RTR");
  }
  // TY go aaron
  // jangan lupa return value
  return value;
};

const customSchema = Joi.object({
  kode_invoice: Joi.string().custom(customPengecekan),
  kota_tujuan: Joi.string().valid("SBY", "JKT", "JBR"),
});

module.exports = customSchema;

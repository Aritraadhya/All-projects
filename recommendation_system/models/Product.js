const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productId: String
});

module.exports = mongoose.model("Product", ProductSchema);

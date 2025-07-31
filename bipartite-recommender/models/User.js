const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: String,
  likedProducts: [String]
});

module.exports = mongoose.model("User", UserSchema);


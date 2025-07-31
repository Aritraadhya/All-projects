const mongoose = require('mongoose');

const UserProductSchema = new mongoose.Schema({
  userId: String,
  productId: String,
});

module.exports = mongoose.model('UserProduct', UserProductSchema);

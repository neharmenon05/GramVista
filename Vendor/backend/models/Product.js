const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  name: String,
  description: String,
  price: Number,
  duration: Number,
  maxPeople: Number,
});

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  vendorName: String,
  name: String,
  desc: String,
  price: Number,
  duration: Number,
  max: Number
});

module.exports = mongoose.model('Experience', experienceSchema);

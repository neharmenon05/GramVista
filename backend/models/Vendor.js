const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const vendorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  vendorId: {
    type: String,
    required: true,
    unique: true,
    default: () => `VENDOR-${uuidv4().slice(0, 8)}`
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

vendorSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

vendorSchema.pre('save', async function(next) {
  const user = await mongoose.model('User').findOne({ email: this.email });
  if (user) {
    throw new Error('Email already registered as a user');
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
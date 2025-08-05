const mongoose = require('mongoose');

const villageStaySchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  amenities: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  maxGuests: {
    type: Number,
    required: true
  },
  rooms: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    rating: { type: Number, min: 1, max: 5 }
  }],
  availability: [{
    date: Date,
    available: Boolean
  }],
  features: {
    type: [String],
    required: true
  },
  currentOccupants: {
    type: Number,
    default: 0
  },
  ladiesOnly: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VillageStay', villageStaySchema);

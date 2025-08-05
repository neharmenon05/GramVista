const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) { return v.length === 4; },
      message: 'Exactly 4 options are required'
    }
  },
  tags: {
    type: [String],
    required: true
  },
  votes: [{
    option: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Poll', pollSchema);
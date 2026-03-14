

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({

  question: {
    type: String,
    required: true,
    minlength: 10
  },


  options: [{
    text: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      default: 0
    }
  }],


  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


  votedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],


  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;

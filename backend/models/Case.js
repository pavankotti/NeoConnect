

const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({

  trackingId: {
    type: String,
    required: true,
    unique: true
  },


  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.isAnonymous;
    }
  },


  isAnonymous: {
    type: Boolean,
    default: false
  },


  category: {
    type: String,
    enum: ['Safety', 'Policy', 'Facilities', 'HR', 'Other'],
    required: true
  },

  department: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },

  description: {
    type: String,
    required: true,
    minlength: 10
  },


  attachmentUrl: {
    type: String
  },


  status: {
    type: String,
    enum: ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'],
    default: 'New'
  },


  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },


  response: {
    type: String
  },


  createdAt: {
    type: Date,
    default: Date.now
  },

  lastResponseAt: {
    type: Date
  },

  resolvedAt: {
    type: Date
  }
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;

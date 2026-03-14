

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },


  password: {
    type: String,
    required: true,
    minlength: 6
  },


  name: {
    type: String,
    required: true,
    trim: true
  },


  role: {
    type: String,
    enum: ['staff', 'secretariat', 'case_manager', 'admin'],

    default: 'staff'
  },


  department: {
    type: String,
    required: function() {

      return this.role === 'staff';
    }
  },


  createdAt: {
    type: Date,
    default: Date.now
  }
});




const User = mongoose.model('User', userSchema);


module.exports = User;

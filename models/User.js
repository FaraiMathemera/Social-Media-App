const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  imageProfile: {
    type: String,
    required: false
  },
  friends: {
    type: [String],
    required: false
  },
  date: {
    type: String,
    default: Date.now
  }
});

let User = module.exports = mongoose.model('User', UserSchema);

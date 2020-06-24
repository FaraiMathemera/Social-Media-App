const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const FriendSchema = new mongoose.Schema({

    id:     {type: ObjectId},
    name:   {type: String },
    imageProfile: {type: String},
    surname:  {type: String},
    status:   {type: Boolean}

});

const FriendRequestSchema = new mongoose.Schema({

    id:     {type: ObjectId},
    imageProfile: {type: String},
    name:   {type: String},
    surname:  {type: String}

});

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
  friends: [],

  friendRequests:[],

  searchResults:[],

  date: {
    type: String,
    default: Date.now
  }
});

let User = module.exports = mongoose.model('User', UserSchema);

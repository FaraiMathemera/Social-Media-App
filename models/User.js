const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const FriendSchema = new mongoose.Schema({
  friend: {type: [{
    id:     {type: ObjectId},
    name:   {type: String , default: "James"},
    surname:  {type: String, default: "Bond" },
    status:   {type: String , default: "Online"}
  }]}
});

const FriendRequestSchema = new mongoose.Schema({
  friend: {type: [{
    id:     {type: ObjectId},
    name:   {type: String , default: "James"},
    surname:  {type: String, default: "Bond" }
  }]}
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
  friends: {
    type: [FriendSchema],
    required: true
  },
  friendRequest: {
    type: [FriendRequestSchema],
    required: true
  },
  status: {
    type: Boolean,
    required: false
  },
  date: {
    type: String,
    default: Date.now
  }
});

let User = module.exports = mongoose.model('User', UserSchema);

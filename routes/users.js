const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model
let User = require('../models/User');

//Login Page
router.get('/login', (req,res) => res.render('login'));

//Register Page
router.get('/register', (req,res) => res.render('register'));

//Profile Page
router.get('/dashboard/edit', (req,res) => res.render('dashboard'));

//Dashboard Page
router.get('/profile/edit', (req,res) => res.render('profile'));

//Friends Page
router.get('/friends/edit', (req,res) => res.render('friends'));

//Change password Page
router.get('/password/edit', (req,res) => res.render('password'));

//Register handle ----------------------------------------------------------------------------------
router.post('/register', (req, res) => {
const {name, surname, age, email, password, password2, friends} = req.body;
let errors =[];
//Check required fields
if(!name||!surname||!email||!password||!password2){
  errors.push({msg: 'Please fill in all the fields'});
}
//Check passwords
if (password != password2){
  errors.push({msg: 'Passwords do not match'});
}

//Check password length
if(password.length< 6){
  errors.push({msg: 'Password should be at least 6 characters'});
}

//Check for  upper and lower case character
if(password.search(/[\[\]?=.*[a-zA-Z]/) == -1){
  errors.push({msg: 'Password should contain an upper and lower case character'});
}

//Check for a number
if(password.search(/[\[\]?=.*[0-9]/) == -1){
  errors.push({msg: 'Password should contain a number'});
}

//Check for a special character
if(password.search(/[\[\]?=.*[!@#$%^&*]/) == -1){
  errors.push({msg: 'Password should contain a special character'});
}

if (errors.length>0){
res.render('register', {
  errors,
  name,
  surname,
  age,
  email,
  password,
  password2
});
}else {
  //Validation passed
  User.findOne({ email: email})
    .then(user => {
      if(user){
        //user exists
        errors.push({msg: 'Email is already registered'});
        res.render('register', {
          errors,
          name,
          surname,
          age,
          email,
          password,
          password2
        });
      } else {
const newUser = new User({
  name,
  surname,
  age,
  email,
  password,
  friends
});

//hash password
bcrypt.genSalt(10,(err, salt) =>
 bcrypt.hash(newUser.password, salt, (err, hash) => {
   if(err) throw err;
//savepassword hash
   newUser.password = hash;
   newUser.save()
     .then(user =>{
       req.flash('success_msg', 'You are now registered and can log in!!!');
       res.redirect('/users/login');
     })
     .catch(err => console.log(err));

 }))
      }
    });

}
});
//Register handle ---------------------------------------------------------------------------------------------------------------

//Change Password handle --------------------------------------------------------------------------------------------------------
router.post('/password/:id', (req, res) => {
var item = {_id, password, oldpassword, password1, password2} = req.body;
let errors =[];
let query = {_id:req.body._id}
//Check required fields
if(!oldpassword||!password1||!password2){
  errors.push({msg: 'Please fill in all the fields'});
  console.log("Please fill in all the fields");
}
//Check new passwords
if (password1 != password2){
  errors.push({msg: 'Passwords do not match'});
  console.log("Passwords do not match");
}

//Check old password
bcrypt.compare(oldpassword, password, function(err, result) {
    // result == true
    if (result != true){
      errors.push({msg: 'Incorrect Password'});
      console.log("Incorrect Password");
}
});

//Check password length
if(password1.length< 6){
  errors.push({msg: 'Password should be at least 6 characters'});
  console.log("> 6");
}

//Check for  upper and lower case character
if(password1.search(/[\[\]?=.*[a-zA-Z]/) == -1){
  errors.push({msg: 'Password should contain an upper and lower case character'});
  console.log("Lower and upper");
}

//Check for a number
if(password1.search(/[\[\]?=.*[0-9]/) == -1){
  errors.push({msg: 'Password should contain a number'});
  console.log("number");
}

//Check for a special character
if(password1.search(/[\[\]?=.*[!@#$%^&*]/) == -1){
  errors.push({msg: 'Password should contain a special character'});
  console.log("special");
}


 if (errors.length>0){
 res.render('password', {
   _id,
   errors,
   password,
   oldpassword,
   password1,
   password2
 });

}else {

//hash password
  bcrypt.genSalt(10,(err, salt) =>
   bcrypt.hash(password1, salt, (err, hash) => {
     if(err) throw err;
  //save password hash
  //password1 = hash;
  const friends = {
          friend: {
              name: "Jane",
              surname: "Doe",
              status: true
          }
      };

     User.updateOne(query,{$set:{"password":hash,"friends":friends}}, {multi: true},function(err, result){
         req.flash('success_msg', 'You have successfully updated your password');
         res.redirect('/users/password/edit');
         console.log("Password Changed");
       })
       .catch(err => console.log(err));

   }))


}
});
//Change password handle ------------------------------------------------------------------------------------------------------------------

//Dashboard handle ------------------------------------------------------------------------------------------------------------------------
router.post('/dashboard/:id',(req, res) =>{
var item = {_id, name, surname, age, email, imageProfile, friends} = req.body;
let errors =[];
let query = {_id:req.body._id}
//Check required fields
if(!name||!surname||!age){
  errors.push({msg: 'Please fill in required fields'});
}

if(errors.length > 0){
res.render('dashboard', {
  _id,
  errors,
  name,
  surname,
  age,
  email,
  imageProfile,
  friends
});
}else {
  //Validation Passed
  //Update user
  User.updateOne(query,{$set:item}, {multi: true},function(err, result){
req.flash('success_msg', 'You have updated your details!!');
res.redirect('/users/dashboard/edit');
console.log(query);
});
}
});
//Dashboard handle ---------------------------------------------

//Search function -----------------------------------------------
router.post('/friends/:id',(req, res) =>{
var item = {_id, name, surname, age, email, imageProfile, friends} = req.body;
let errors =[];
let results = [];
let query = {name:req.body.search}

// User.find(query,function(err, results) {
//             if (err) {
//                 return res.send(500, err);
//             }
//             req.flash('friends', 'List of friends');
//             res.redirect('/users/friends/edit');
//             console.log(results);
//
//             // res.render('friends', {
//             //     title: 'Friend Connect | Results',
//             //     searchResults: results
//             // });
//
//         });
});
//Search function ---------------------------------------------

//Update handle -----------------------------------------------
router.post('/profile/:id',(req, res) =>{
var item = {_id, name, surname, age, email, imageProfile, friends} = req.body;
let errors =[];
let query = {_id:req.body._id}
//Check required fields
if(!name||!surname||!age){
  errors.push({msg: 'Please fill in required fields'});
}

if(errors.length > 0){
res.render('profile', {
  _id,
  errors,
  name,
  surname,
  age,
  email,
  imageProfile,
  friends
});
}else {
  //Validation Passed
  //Update user
  User.updateOne(query,{$set:item}, {multi: true},function(err, result){
req.flash('success_msg', 'You have updated your details!!');
res.redirect('/users/profile/edit');
console.log(query);
});
}
});
//Update handle ---------------------------------------------


//Login handle
router.post('/login', (req, res, next) =>{
passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect:  '/users/login',
  failureFlash: true
})(req, res, next);
});

//Logout handle
router.get('/logout', (req, res) => {
req.logout();
req.flash('success_msg', 'You are logged out!!')
res.redirect('/users/login');
});

module.exports=router;

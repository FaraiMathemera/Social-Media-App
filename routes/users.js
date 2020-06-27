var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var formidable = require('formidable');
var path = require('path');
var async = require('async');
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');


var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// friends
router.get('/friends', function (req, res) {
	res.render('friends');
});

// friends
router.get('/picture', function (req, res) {
	res.render('picture');
});

// Password
router.get('/password', function (req, res) {
	res.render('password');
});
//dashboard
router.get('/dashboard', function (req, res) {
	res.render('dashboard');
});
//change password
router.get('/passwordchange', function (req, res) {
	res.render('passwordchange');
});

// Register User--------------------------------------------------------------------------------------------------------------
router.post('/register', function (req, res) {
	var name = req.body.name;
	var surname = req.body.surname;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('surname', 'Surname is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	//Check password length
	req.checkBody('password', 'Password should be at least 6 characters').isLength({ min: 6});
	//Check password case Check password contains number //Check password special character
	req.checkBody('password', 'Password should contain an upper and lower case character, number and special character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/, "i");


	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: {
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						surname: surname,
						email: email,
						username: username,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});
// Current Password---------------------------------------------------------------------------------------------------------
// Register User---------------------------------------------------------------------------------------------------------
router.post('/password',
	passport.authenticate('local', { successRedirect: '/passwordchange', failureRedirect: '/password', failureFlash: true }),
	function (req, res) {
		res.redirect('/passwordchange');
	});
	// enter current password---------------------------------------------------------------------------------------------------------
//password update handle ---------------------------------------------------------------------------------------------------------------------------------
router.post('/passwordchange', (req, res) => {

var item = {_id, password, oldpassword, password1, password2} = req.body;
let query = {_id:req.body._id}


//Check required fields
req.checkBody('password1', 'New password is required').notEmpty();
req.checkBody('password2', 'Password confirmation needed').notEmpty();
req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);

//Check password length
req.checkBody('password1', 'Password should be at least 6 characters').isLength({ min: 6});
//Check password case Check password contains number //Check password special character
req.checkBody('password1', 'Password should contain an upper and lower case character, number and special character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/, "i");
//check old password
//req.checkBody('oldpassword', 'incorrect password').customfunction();


//Change password---------------------------------------------------------------
var errors = req.validationErrors();
	if (errors) {
		res.render('password', {
			errors: errors,
		});
	}
  else {

//hash password
  bcrypt.genSalt(10,(err, salt) =>
   bcrypt.hash(password1, salt, (err, hash) => {
     if(err) throw err;
  //save password hash
     User.updateOne(query,{$set:{"password":hash}}, {multi: true},function(err, result){
         req.flash('success_msg', 'You have updated your password');
         res.redirect('/password');
         console.log("Password Changed");
       })
       .catch(err => console.log(err));
   }))
}
//Change password---------------------------------------------------------------

});
// password User---------------------------------------------------------------------------------------------------------------------------

//Dashboard handle ------------------------------------------------------------------------------------------------------------------------
router.post('/dashboard',(req, res) =>{
var item = {_id, name, surname, age, email, userImage, username} = req.body;
let query = {_id:req.body._id}
//Check required fields
req.checkBody('name', 'Name is required').notEmpty();
req.checkBody('surname', 'Surname is required').notEmpty();
req.checkBody('email', 'Email is required').notEmpty();
req.checkBody('email', 'Email is not valid').isEmail();
req.checkBody('username', 'Username is required').notEmpty();

var errors = req.validationErrors();

	if (errors) {
		res.render('dashboard', {
			errors: errors
		});
	}
  else {

  User.updateOne(query,{$set:item}, {multi: true},function(err, result){
req.flash('success_msg', 'You have updated your details!!');
res.redirect('/dashboard');
console.log(query);
});
}
});
//Dashboard handle ---------------------------------------------------------------------------------------------------------------------------------

//Strategy--------------------------------------------------------------------------------------------------------------
passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});
// Register User--------------------------------------------------------------------------------------------------------------
router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),

	function (req, res) {
		if (req.body.remember_me) {
                        req.session.cookie.originalMaxAge = 2592000000;
                    } else {
                        req.session.cookie._expires = false;
                  }
		res.redirect('/');

	});

router.get('/logout', function (req, res) {
	//logout function
	let query = {_id:req.body._id}
	User.updateOne(query,{$set:{"status":"Offline"}}, {multi: true},function(err, result){
			console.log("Offline");
		})
		.catch(err => console.log(err));
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;

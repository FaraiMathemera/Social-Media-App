var express = require('express');
var router = express.Router();
var passport = require('passport');
const bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Dashboard
router.get('/dashboard', function (req, res) {
	res.render('dashboard');
});


// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// password change
router.get('/password', function (req, res) {
	res.render('password');
});

// Login
router.get('/search', function (req, res) {
	res.render('search');
});

// friends
router.get('/friends', function (req, res) {
	res.render('friends');
});
//Dashboard handle ------------------------------------------------------------------------------------------------------------------------
router.post('/dashboard',(req, res) =>{
var item = {_id, name, surname, age, email, imageProfile, username} = req.body;
let query = {_id:req.body._id}
//Check required fields
req.checkBody('name', 'Name is required').notEmpty();
req.checkBody('surname', 'Surname is required').notEmpty();
req.checkBody('email', 'Email is required').notEmpty();
req.checkBody('email', 'Email is not valid').isEmail();
req.checkBody('username', 'Username is required').notEmpty();
var form =new formidable.IncomingForm();
form.parse(req);
let reqPath= path.join(__dirname, '../');
let newfilename;
form.on('fileBegin', function(name, file){
	file.path = reqPath+ 'public/upload/'+ req.user.username + file.name;
	newfilename= req.user.username+ file.name;
});
form.on('file', function(name, file) {
	User.findOneAndUpdate({
		username: req.user.username
	},
	{
		'userImage': newfilename
	},
	function(err, result){
		if(err) {
			console.log(err);
		}
	});
});
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
//password update handle ---------------------------------------------------------------------------------------------------------------------------------
router.post('/password', (req, res) => {
var item = {_id, password, oldpassword, password1, password2} = req.body;
let query = {_id:req.body._id}
var passcheck;

//Check required fields
req.checkBody('oldpassword', 'Old password is required').notEmpty();
req.checkBody('password1', 'New password is required').notEmpty();
req.checkBody('password2', 'Password confirmation needed').notEmpty();
req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);

//Check password length
req.checkBody('password1', 'Password should be at least 6 characters').isLength({ min: 6});
//Check password case Check password contains number //Check password special character
req.checkBody('password1', 'Password should contain an upper and lower case character, number and special character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/, "i");
//check old password
req.checkBody('oldpassword').custom(oldpassword=> {
  bcrypt.compare(oldpassword, password, function(err, result) {
      passcheck = result;
  });
  if (passcheck == true){throw new Error('Incorrect Password')}else{
            return true;
}
 })


//Check old password
var errors = req.validationErrors();

	if (errors) {
		res.render('password', {
			errors: errors
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
});
// password User----------------------------------------------------------------------------------------------------------------------------------
// Register User----------------------------------------------------------------------------------------------------------------------------------
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

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
//register handle-----------------------------------------------------------------------------------------------------------------
//startegy handle-----------------------------------------------------------------------------------------------------------------
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
//strategy handle-----------------------------------------------------------------------------------------------------------------
//Passport handle-----------------------------------------------------------------------------------------------------------------
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});
//passport handle-----------------------------------------------------------------------------------------------------------------
router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const index = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;
//Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err));
//ejs
index.use(expressLayouts);
index.set('view engine', 'ejs');
//BodyParser middleware
index.use(express.urlencoded({extended: false}));
//Express session middleware
index.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
//Passport middleware
index.use(passport.initialize());
index.use(passport.session());
//Connect flash
index.use(flash());
//global vars
index.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
///routes
index.use('/', require('./routes/index'));
index.use('/users', require('./routes/users'));

const PORT = process.env.PORT|| 5000;

index.listen(PORT, console.log(`Server started on port ${PORT}`));

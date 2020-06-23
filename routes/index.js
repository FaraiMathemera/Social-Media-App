const express = require('express');
const router = express.Router();
const { ensureAuthenticated} = require('../config/auth');
//Welcome Page
router.get('/', (req,res) => res.render('welcome'));
router.get('/dashboard', ensureAuthenticated, (req,res) => res.render('dashboard',
{_id: req.user._id, name: req.user.name, surname: req.user.surname, email: req.user.email, age: req.user.age, imageProfile: req.user.imageProfile, friends: req.user.friends, friendRequests: req.user.friendRequests}));

router.get('/profile', ensureAuthenticated, (req,res) => res.render('profile',
{_id: req.user._id, name: req.user.name, surname: req.user.surname, email: req.user.email, age: req.user.age, imageProfile: req.user.imageProfile, friends: req.user.friends, friendRequests: req.user.friendRequests}));

router.get('/friends', ensureAuthenticated, (req,res) => res.render('friends',
{_id: req.user._id, name: req.user.name, surname: req.user.surname, email: req.user.email, age: req.user.age, imageProfile: req.user.imageProfile, friends: req.user.friends, friendRequests: req.user.friendRequests}));

router.get('/password', ensureAuthenticated, (req,res) => res.render('password',
{_id: req.user._id, name: req.user.name, surname: req.user.surname, email: req.user.email, age: req.user.age, imageProfile: req.user.imageProfile, friends: req.user.friends, password: req.user.password}));
module.exports=router;

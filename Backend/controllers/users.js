const passport = require('passport')
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const ExpressError = require('../utilities/ExpressError')
const wrapAsync = require('../utilities/wrapAsync')


module.exports.renderUserForm = (req, res) => {
    res.render('users/register'); //Render Register Page
}

module.exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error logging in user' });
            }

            res.status(200).json({ success: true, message: 'Success! Logged In', user: registeredUser });
        });
    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return next(err);
        }
        if (!user) {
            console.log('Authentication failed:', info.message);
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        req.login(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return next(err);
            }
            console.log('Login successful:', user);
            res.json({
                success: true,
                username: user.username,
                message: 'Login successful',
            });
        });
    })(req, res, next);
};


module.exports.logoutUser = (req, res, next) => {
    //Log out with passport Function, redirect to error handler if theres an error
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out.');
        res.redirect('/spotgrounds');
    });
}



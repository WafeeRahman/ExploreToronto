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
            console.error('Authentication error:', err); // Log error
            return next(err); // Handle any errors
        }
        if (!user) {
            console.warn('Authentication failed:', info); // Log failed authentication
            return res.status(401).json({ success: false, message: 'Invalid username or password' }); // Authentication failed
        }
        req.login(user, (err) => {
            if (err) {
                console.error('Login error:', err); // Log error during login
                return next(err);
            }
            // Send response with user info
            console.log('Login successful for user:', user.username); // Log successful login
            res.json({
                success: true,
                username: user.username, // Include username in response
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



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

        //Take email, username, password from body
        const { email, username, password } = req.body;

        //Create User Object with Username and Password
        const user = new User({ email, username });

        //Use Passport register function to pass in and HASH password with salts, etc
        const registeredUser = await User.register(user, password);

        //Log user in with passport
        req.login(registeredUser, err => {

            //General Error Handler
            if (err) return next(err);

            req.flash('success', 'Welcome to spotGROUNDS');
            res.redirect('/spotgrounds');

        })

        console.log(registeredUser);
    }

    catch (err) {
        req.flash('error', err.message); //If Passport throws an error, flash its error message
        res.redirect('/register')
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    // Login User

    req.flash('success', 'Welcome back!');

    //After login, redirect to page that user was looking at, or /spotgrounds as a default
    const redirectUrl = res.locals.returnTo || '/spotgrounds';
    delete req.session.returnTo //Delete ReturnTo Afterwards and Redirect
    res.redirect(redirectUrl);
}

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



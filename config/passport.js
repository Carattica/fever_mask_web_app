const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// get the User model for the database
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // find the user in the DB via email
            User.findOne({email: email}).then(user => {
                if (!user) return done(null, false);

                // make sure the password is correct with the given email
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) return done(null, user);
                    else return done(null, false);
                });
            });
        })
    );

    // turn DB model into session identifier
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // turn session identifier into DB model
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

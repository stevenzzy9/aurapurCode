'use strict';

// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        username     : { type: String, unique: true, index: true},
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.statics.newLocalUser = async function(username, email, password) {
    var user = await User.findLocalUserByUsername(username);
    if (user) {
        throw new Error('User: ' + username + ' already exists');
    }
    user = new User({
        local: {
            username: username,
            email: email,
            password: password
        }
    });
    return await user.save();
}

userSchema.statics.findLocalUserByUsername = async function(username) {
    return await User.findOne({'local.username': username});
}

const User = mongoose.model('User', userSchema)

// create the model for users and expose it to our app
module.exports = User;

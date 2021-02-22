const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Token = require("./token");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: "Your email is required",
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: "Your username is required",
    },
    password: {
        type: String,
        required: "Your passport is required",
        max: 100
    },
    firstname: {
        type: String,
        required: "First Name is required",
        max: 100
    },
    lastname: {
        type: String,
        required: "Last Name is required",
        max: 100
    },
    profileImage: {
        type: String,
        required: false,
        max: 255
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {timestamps: true});

// Function used to compare the password entered by the user during login to the 
// user’s password currently in the database.
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};

// Function used for creating the authentication tokens using the jwt package. 
// This token will be returned to the user and will be required for accessing protected routes. 
// The token payload includes the user’s first name, last name, username 
// and email address and is set to expire 60 days in the future.
UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    })
};

// Function used to generate a password reset token using the crytpo package and and 
// calculates an expiry time (1 hour), the user object is updated with this data.
UserSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

// Function used to generate a token and creates and returns an instance of the Token model.
UserSchema.methods.generateVerificationToken = function() {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString("hex")
    }

    return new Token(payload);
};

module.exports = mongoose.model("Users", UserSchema);
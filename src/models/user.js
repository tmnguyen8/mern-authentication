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
        
    }
})
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    avtar: {
        type: String
    },
    lastSeen: {
        type: Date
    },
    refreshTokens: [
        {
            token: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

}, { timestamps: true })

const User = mongoose.model("User", userSchema);
module.exports = { User }
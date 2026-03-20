const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    bio: {
        type: String,
        default: ""
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    friendRequestsSent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    friendRequestsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
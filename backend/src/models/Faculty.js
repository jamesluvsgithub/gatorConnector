const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema(
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

    specialty: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Faculty", FacultySchema);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

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

FacultySchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("Faculty", FacultySchema);
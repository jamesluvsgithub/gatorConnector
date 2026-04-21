const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
{
    // ---------------------------------------------------------------------------------------
    // The following (up to the next comment) are used for login and communication.
    // ---------------------------------------------------------------------------------------

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minLength: 6
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    isPublic: {
        type: Boolean,
        default: false
    },
    // Optional bio

    bio: {
        type: String,
        default: ""
    },


    // ---------------------------------------------------------------------------------------
    // The following (up to the next comment) are used for the matching algorithm.
    // ---------------------------------------------------------------------------------------

    accountType: {
        type: String,
        enum: {
            values: ["mentor", "mentee"],
            message: "Can only be either mentor or mentee"
        }
    },

    majors: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: "At least one major is required!"
        }
    },

    minors: {
        type: [String]
    },

    hobbies: {
        type: [String]
    },


    // ---------------------------------------------------------------------------------------
    // The following (up to the next comment) are used for tracking user's friend statuses.
    // ---------------------------------------------------------------------------------------

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

UserSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", UserSchema);
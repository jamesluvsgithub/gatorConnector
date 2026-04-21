const mongoose = require("mongoose");

const Message = new mongoose.Schema(
{
    // The chat that the message is being sent to
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Chat"
    },

    // The people who sent the message
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"
    },

    // The content of the message
    text: String
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Message", Message);
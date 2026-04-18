const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
{
    // Everyone in the chat (groupchat support!)
    people: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"
    }],

    // The most recent message. Used for previewing the chat when the user
    // scrolls through their chats
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Message"
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Chat", ChatSchema);
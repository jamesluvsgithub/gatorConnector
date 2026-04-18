const Message = require("../models/Message");
const Chat = require("../models/Chat");


// CREATE
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;

        if (!chatId || !text) {
            return res.status(400).json({ error: "chatId and text required" });
        }

        const message = await Message.create({
            chatId,
            sender: req.body.chatId,
            text
        });

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: message._id
        });

        res.status(201).json(message);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// READ - all messages in a chat
exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const messages = await Message.find({ chatId })
            .sort({ createdAt: -1 }) // newest first
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("sender", "username");

        res.status(200).json(messages.reverse()); // oldest -> newest

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ - single message
exports.getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)
            .populate("sender", "username");

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.status(200).json(message);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Only sender can delete" });
        }

        await message.deleteOne();

        res.status(200).json({ message: "Message deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
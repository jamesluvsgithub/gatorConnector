const Chat = require("../models/Chat");

// CREATE or get regular chat
exports.createChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId required" });
        }

        // check if chat already exists
        let chat = await Chat.findOne({
            people: { $all: [req.user._id, userId], $size: 2 }
        }).populate("people", "username");

        if (!chat) {
            chat = await Chat.create({
                people: [req.user._id, userId]
            });

            chat = await chat.populate("people", "username");
        }

        res.status(200).json(chat);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// CREATE group chat
exports.createGroupChat = async (req, res) => {
    try {
        let { people } = req.body;

        if (!people || people.length < 2) {
            return res.status(400).json({ error: "At least 2 users required" });
        }

        // include current user & remove duplicates
        people = [...new Set([...people, req.user._id.toString()])];

        const chat = await Chat.create({ people });

        res.status(201).json(chat);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// READ - all chats for a user
exports.getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            people: req.user._id
        })
        .populate("people", "username")
        .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: "username"
            }
        })
        .sort({ updatedAt: -1 });

        res.status(200).json(chats);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// READ - single chat
exports.getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate("people", "username")
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "username"
                }
            });

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        // ensure user is part of chat
        const isMember = chat.people.some(
            user => user._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        res.status(200).json(chat);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// DELETE
exports.deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        const isMember = chat.people.some(
            user => user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ error: "Only members can delete" });
        }

        await chat.deleteOne();

        res.status(200).json({ message: "Chat deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
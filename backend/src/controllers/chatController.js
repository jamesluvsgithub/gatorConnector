const Chat = require("../models/Chat");

//  regular chat
exports.createChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId required" });
        }

        // check if chat already exists
        let chat = await Chat.findOne({
            people: { $all: [req.user.id, userId], $size: 2 }
        }).populate("people", "_id username");

        if (!chat) {
            chat = await Chat.create({
                people: [req.user.id, userId]
            });
            chat = await chat.populate("people", "_id username");
        }

        res.status(200).json(chat);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// CREATE chat
exports.createGroupChat = async (req, res) => {
    try {
        let { people } = req.body;

        if (!people || people.length < 2) {
            return res.status(400).json({ error: "At least 2 users required" });
        }

        people = [...new Set([...people, req.user.id.toString()])];

        const chat = await Chat.create({ people });

        res.status(201).json(chat);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            people: req.user.id
        })
        .populate("people", "_id username")
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



exports.getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate("people", "_id username")
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
            u => u._id.toString() === req.user.id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        res.status(200).json(chat);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// delete chat
exports.deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        const isMember = chat.people.some(
            u => u.toString() === req.user.id.toString()
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
const User = require("../models/User");

// CREATE
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ
exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
};
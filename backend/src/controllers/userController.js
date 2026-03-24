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
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// UPDATE
exports.updateUser = async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        const updatedUser = await User.findById(req.params.id);
        res.status(200).json(updatedUser);

    } catch(error){
         res.status(500).json({error: error.message });
    }
};

// DELETE
exports.deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        res.status(200).json({msg: "User deleted."});
        
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};

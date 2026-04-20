const Faculty = require("../models/Faculty");
const User = require("../models/User");

// CREATE
exports.createFaculty = async (req, res) => {
    try {
        
        const user = await Faculty.create(req.body);
        res.status(201).json(user);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ
exports.getFaculty = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: "Forbidden" });
    }
    try {
        const user = await Faculty.findById(req.params.id);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// UPDATE
exports.updateFaculty = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: "Forbidden" });
    }
    try{
        const user = await Faculty.findByIdAndUpdate(req.params.id, req.body);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        const updatedUser = await Faculty.findById(req.params.id);
        res.status(200).json(updatedUser);

    } catch(error){
         res.status(500).json({error: error.message });
    }
};

// DELETE
exports.deleteFaculty = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: "Forbidden" });
    }
    try{
        const user = await Faculty.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        res.status(200).json({msg: "User deleted."});
        
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};

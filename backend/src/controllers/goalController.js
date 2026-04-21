const Goal = require("../models/Goal");

// CREATE
exports.createGoal = async (req, res) => {
    try {
        const goal = await Goal.create(req.body);
        res.status(201).json(goal);
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ
// Read ONE goal
exports.getGoal = async (req, res)  => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ error: "Goal not found." });
        }

        res.status(200).json(goal);

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

// GET ALL GOALS FOR ONE USER
exports.getGoalsByUser = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.params.userId });
        res.status(200).json(goals);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findByIdAndUpdate(req.params.id, req.body);

        if (!goal) {
            return res.status(404).json({ error: "Goal not found." });
        }

        const updatedGoal = await Goal.findById(req.params.id);
        res.status(200).json(updatedGoal);

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

// DELETE
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findByIdAndDelete(req.params.id);

        if (!goal) {
            return res.status(404).json({ error: "Goal not found." });
        }

        res.status(200).json({ msg: "Goal deleted." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
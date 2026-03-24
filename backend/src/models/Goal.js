const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["not started", "in progress", "completed"],
        default: "not started"
    }
}
);

module.exports = mongoose.model("Goal", GoalSchema);
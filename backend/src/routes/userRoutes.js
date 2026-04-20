const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const { requireRole } = require("../middleware/requireAuth");
const User = require("../models/User");

router.get("/me", requireAuth.userVerification, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

router.put("/profile", requireAuth.userVerification, async (req, res) => {
    try {
        const { bio, majors, minors, hobbies, isPublic } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                bio,
                majors,
                minors,
                hobbies,
                isPublic
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});
router.post("/", requireAuth.userVerification, requireRole("user"), userController.createUser);
router.get("/:id", requireAuth.userVerification, requireRole("user"), userController.getUser);
router.put("/:id", requireAuth.userVerification, requireRole("user"), userController.updateUser);
router.delete("/:id", requireAuth.userVerification, requireRole("user"), userController.deleteUser);
module.exports = router;
const express = require("express");
const router = express.Router();
const authController = require("../controllers/facultyAuthController");
const requireAuth = require("../middleware/requireAuth")


// For faculty users:
router.post("/login", authController.loginUser);
router.post("/signup", authController.signupUser);
router.get("/verify", requireAuth.userVerification, requireAuth.requireRole("faculty"), authController.verifyUser);

module.exports = router;
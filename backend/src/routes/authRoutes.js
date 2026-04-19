const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth")

// For student users:
router.post("/login", authController.loginUser);
router.post("/signup", authController.signupUser);
// router.post("/logout", authController.logoutUser);
router.get('/verify', requireAuth.userVerification, authController.verifyUser);

module.exports = router;
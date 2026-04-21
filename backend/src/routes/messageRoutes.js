const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const requireAuth = require("../middleware/requireAuth");

// Require authentication for sending messages
router.post("/", requireAuth.userVerification, messageController.sendMessage);
router.get("/:chatId", messageController.getMessages);
router.get("/single/:id", messageController.getMessageById);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const requireAuth = require("../middleware/requireAuth");

// Require authentication for chat creation
router.post("/", requireAuth.userVerification, chatController.createChat);
router.post("/group", requireAuth.userVerification, chatController.createGroupChat);
router.get("/", requireAuth.userVerification, chatController.getUserChats);
router.get("/:id", requireAuth.userVerification, chatController.getChatById);
router.delete("/:id", requireAuth.userVerification, chatController.deleteChat);

module.exports = router;
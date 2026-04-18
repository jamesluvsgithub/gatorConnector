const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/", messageController.sendMessage);
router.get("/:chatId", messageController.getMessages);
router.get("/single/:id", messageController.getMessageById);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
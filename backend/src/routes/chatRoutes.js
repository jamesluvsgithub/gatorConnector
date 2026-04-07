const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.createChat);
router.post("/group", chatController.createGroupChat);
router.get("/", chatController.getUserChats);
router.get("/:id", chatController.getChatById);
router.delete("/:id", chatController.deleteChat);

module.exports = router;
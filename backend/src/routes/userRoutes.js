const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const { requireRole } = require("../middleware/requireAuth");

router.post("/", requireAuth.userVerification, requireRole("user"), userController.createUser);
router.get("/:id", requireAuth.userVerification, requireRole("user"), userController.getUser);
router.put("/:id", requireAuth.userVerification, requireRole("user"), userController.updateUser);
router.delete("/:id", requireAuth.userVerification, requireRole("user"), userController.deleteUser);

module.exports = router;
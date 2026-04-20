const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const requireAuth = require("../middleware/requireAuth");
const { requireRole } = require("../middleware/requireAuth");

router.post("/", requireAuth.userVerification, requireRole("faculty"), facultyController.createFaculty);
router.get("/students", requireAuth.userVerification, requireRole("faculty"), facultyController.getAllStudents);
router.get("/:id", requireAuth.userVerification, requireRole("faculty"), facultyController.getFaculty);
router.put("/:id", requireAuth.userVerification, requireRole("faculty"), facultyController.updateFaculty);
router.delete("/:id", requireAuth.userVerification, requireRole("faculty"), facultyController.deleteFaculty);
module.exports = router;
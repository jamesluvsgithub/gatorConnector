const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

router.post("/", facultyController.createFaculty);
router.get("/:id", facultyController.getFaculty);
router.put("/:id", facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);
router.post("/:id", facultyController.loginFaculty);

module.exports = router;
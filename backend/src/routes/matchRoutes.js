const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// xompare two users
// GET /api/matching/score?userA=<id>&userB=<id>
router.get('/score', matchController.getScore);

// top matches for a mentor
// GET /api/matching/top/mentor/:userId?limit=10
router.get('/top/mentor/:userId', matchController.getTopMentor);

// top matches for a mentee
// GET /api/matching/top/mentee/:userId?limit=10
router.get('/top/mentee/:userId', matchController.getTopMentee);

module.exports = router;
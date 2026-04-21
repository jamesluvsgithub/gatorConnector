const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// GET /api/matches/score?userA=<id>&userB=<id>
router.get('/score', matchController.getScore);

// GET /api/matches/top/:userId?limit=10
router.get('/top/:userId', matchController.getTop);

module.exports = router;
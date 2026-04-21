const {
  getMatchScoreByIds,
  getTopMatchesForMentor,
  getTopMatchesForMentee,
} = require('../services/matchingService');

// GET /score
exports.getScore = async (req, res) => {
  try {
    const { userA, userB } = req.query;
    const result = await getMatchScoreByIds(userA, userB);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /top/mentor/:userId
exports.getTopMentor = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const matches = await getTopMatchesForMentor(userId, limit);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /top/mentee/:userId
exports.getTopMentee = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const matches = await getTopMatchesForMentee(userId, limit);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
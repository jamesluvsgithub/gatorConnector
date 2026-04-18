const {
  getMatchScoreByIds,
  getTopMatches,
} = require('../services/matchingService');

// Returns the score for two users
async function getScore(req, res) {
  try {
    const { userA, userB } = req.query;

    if (!userA || !userB) {
      return res.status(400).json({ error: 'Both userA and userB query params are required.' });
    }

    if (userA === userB) {
      return res.status(400).json({ error: 'userA and userB must be different users.' });
    }

    const result = await getMatchScoreByIds(userA, userB);
    return res.json(result);
  } catch (err) {
    console.error('[getScore]', err.message);
    return res.status(500).json({ error: err.message });
  }
}

// Gets top n matches for a user
async function getTop(req, res) {
  try {
    const { userId } = req.params;
    const n = parseInt(req.query.n, 10) || 10;

    const matches = await getTopMatches(userId, n);
    return res.json({ userId, matches });
  } catch (err) {
    console.error('[getTop]', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { getScore, getTop };
/*
Computes a compatibility score (0–100) between two users based on
things they share, such as majors and hobbies. Each similarity is
weighted by importance (ex: majors are weighted more than minors)

Uses the jaccard similarity index
https://www.geeksforgeeks.org/python/jaccard-similarity/
*/

const User = require('../models/User');

const WEIGHTS = {
  majors: 50,
  minors: 25,
  hobbies: 30,
};


/* 
Given an array of strings, returns a lowercase trimmed set 
i.e., each item is unique and all lowercase - used for comparison
*/
function toSet(arr = []) {
  return new Set((arr || []).map((s) => s.toLowerCase().trim()));
}


// jaccard scoring function

function jaccardScore(setA, setB, weight) {
  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return { points: 0, shared: [], possible: weight };

  const similarity = intersection.length / union.size;
  return {
    points: Math.round(similarity * weight),
    shared: intersection,
    possible: weight,
  };
}



// Main scoring function

function calculateMatchScore(userA, userB) {
  const majorsResult  = jaccardScore(toSet(userA.majors),  toSet(userB.majors),  WEIGHTS.majors);
  const minorsResult  = jaccardScore(toSet(userA.minors),  toSet(userB.minors),  WEIGHTS.minors);
  const hobbiesResult = jaccardScore(toSet(userA.hobbies), toSet(userB.hobbies), WEIGHTS.hobbies);

  const score = Math.min(
    majorsResult.points + minorsResult.points + hobbiesResult.points,
    100
  );

  return {
    score,
    results: {
      majors:  majorsResult,
      minors:  minorsResult,
      hobbies: hobbiesResult,
    },
  };
}



// score two users by id

async function getMatchScoreByIds(userIdA, userIdB) {
  const [userA, userB] = await Promise.all([
    User.findById(userIdA).select('username majors minors hobbies'),
    User.findById(userIdB).select('username majors minors hobbies'),
  ]);

  if (!userA) throw new Error(`User not found: ${userIdA}`);
  if (!userB) throw new Error(`User not found: ${userIdB}`);

  const result = calculateMatchScore(userA, userB);

  return {
    userA: { id: userA._id, username: userA.username },
    userB: { id: userB._id, username: userB.username },
    ...result,
  };
}


// Get top n mentee matches for a mentor, not including themselves.

async function getTopMatchesForMentor(userId, n = 10) {
  const user = await User.findById(userId).select('username majors minors hobbies');
  if (!user) throw new Error(`User not found: ${userId}`);

  // Exclude self; you could also add friends to the exclusion list here
  const candidates = await User.find({ _id: { $ne: userId, type: "mentee" } }).select('username majors minors hobbies');

  const scored = candidates.map((candidate) => {
    const result = calculateMatchScore(user, candidate);
    return {
      candidate: {
        id: candidate._id,
        username: candidate.username,
        majors: candidate.majors,
        minors: candidate.minors,
        hobbies: candidate.hobbies,
      },
      ...result,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, n);
}



// Get top n mentor matches for a mentee, not including themselves.

async function getTopMatchesForMentee(userId, n = 10) {
  const user = await User.findById(userId).select('username majors minors hobbies');
  if (!user) throw new Error(`User not found: ${userId}`);

  // Exclude self; you could also add friends to the exclusion list here
  const candidates = await User.find({ _id: { $ne: userId, type: "mentor" } }).select('username majors minors hobbies');

  const scored = candidates.map((candidate) => {
    const result = calculateMatchScore(user, candidate);
    return {
      candidate: { id: candidate._id, username: candidate.username },
      ...result,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, n);
}



module.exports = {
  calculateMatchScore,
  getMatchScoreByIds,
  getTopMatches,
};
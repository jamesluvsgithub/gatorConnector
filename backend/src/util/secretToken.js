require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

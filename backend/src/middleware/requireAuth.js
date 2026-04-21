const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.userVerification = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};


module.exports.requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.userType !== role) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    };
};

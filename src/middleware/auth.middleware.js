const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const protect = async (req, res, next) => {
  let token;

  // Check for token inside the Authorization request headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Isolate the token text string out from the "Bearer " prefix string
      token = req.headers.authorization.split(' ')[1];

      // Decode the token payload using your local environment signature secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the full profile document context from the DB and omit the hashed password string
      req.user = await Member.findById(decoded.id).select('-password');
      
      // Fallback binding mapping to support cross-compatible controller syntax profiles
      req.member = req.user;

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user data record not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, validation token signature failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no authorization token supplied" });
  }
};

module.exports = { protect };
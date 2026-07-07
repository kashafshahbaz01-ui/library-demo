const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

// This middleware function intercepts the request before it reaches the book routes
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request has an Authorization header that starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the raw token string out of the header (splits "Bearer <token_string>")
      token = req.headers.authorization.split(" ")[1];

      // 2. Decode and verify the token using your secret vault key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the matching member profile in MongoDB using the ID embedded in the token
      // We use .select("-password") so we don't carry the encrypted password around in memory
      req.member = await Member.findById(decoded.id).select("-password");

      // 4. Everything is valid! Call next() to let the request move to the controller/route
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token verification failed" });
    }
  }

  // If no token exists at all in the request headers
  if (!token) {
    res.status(401).json({ message: "Not authorized, no security token provided" });
  }
};

module.exports = { protect };
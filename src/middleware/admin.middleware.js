const adminOnly = (req, res, next) => {
  // The 'protect' middleware runs first and attaches the logged-in user data
  // Check both req.user or req.member depending on what your protect middleware uses
  const currentUser = req.user || req.member;

  // Verify if a user is logged in and if their account role is exactly "admin"
  if (currentUser && currentUser.role === 'admin') {
    next(); // Authorized! Pass control over to the next function/controller 
  } else {
    // 403 Forbidden is the proper status code when the user's identity is known, 
    // but they lack the privileges or roles required to run the action 
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
};

module.exports = { adminOnly }; // Exporting the middleware wrapper object [cite: 60]
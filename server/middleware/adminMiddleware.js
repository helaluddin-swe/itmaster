const adminMiddleware = (req, res, next) => {
  // Check if req.user exists and inspect the role safely
  const role = req.user?.role?.toLowerCase();

  // Allow 'admin' (and optional 'moderator' if applicable to your admin panel)
  if (role === 'admin') {
    return next();
  }

  return res.status(403).json({ 
    success: false, 
    message: "Access denied: This action requires Administrator clearance." 
  });
};

module.exports = adminMiddleware;
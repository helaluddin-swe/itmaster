const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Get token from header (format: Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "No token provided, authorization denied" 
    });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach decoded payload (e.g., { id, role, email }) to request
    req.user = decoded; 
    
    // Optional helper: attach userId directly for convenience in controllers
    req.userId = decoded.id || decoded._id || decoded.userId;

    next(); // Move to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: "Token is invalid or expired" 
    });
  }
};

module.exports = authMiddleware;
const jwt = require('jsonwebtoken');

const authMiddleware = (req) => {
  const authHeader = req?.headers?.authorization;
  
  if (!authHeader) {
    console.log("⚠️ Auth Debug: No Authorization header found in request.");
    return null; 
  }

  // Split 'Bearer <token>' by space
  const parts = authHeader.split(' ');

  // Validation: Must be an array of exactly 2 items, and the first must be 'Bearer'
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log("⚠️ Auth Debug: Malformed header format. Expected 'Bearer <token>'. Got:", authHeader);
    return null; 
  }

  const token = parts[1]; // Extract the actual token string

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Auth Debug: Token verified successfully for userId:", decoded.userId);
    return decoded; // Returns the payload { userId: "..." }
  } catch (error) {
    console.log("❌ Auth Debug: JWT Verification Failed ->", error.message);
    return null; 
  }
};

module.exports = authMiddleware;

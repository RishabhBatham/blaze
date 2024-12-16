const jwt = require("jsonwebtoken");

// Middleware to authenticate user using JWT
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if Authorization header exists and has a Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "No token provided",
    });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

    // Attach the decoded token data (user info) to the request object
    req.user = decoded;

    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    // If token verification fails
    return res.status(403).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticateUser;

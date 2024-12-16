const jwt = require('jsonwebtoken');  // Assuming you're using JWT for token authentication
require('dotenv').config();


const adminAuthenticator = (req, res, next) => {
    // Get the token from the request header
    const token = req.headers['authorization']?.split(' ')[1]; 

   
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }
  
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret key
      const userEmail = decoded.email;

      console.log('decoded is ',decoded)
  
      // Check if user is an admin based on the email and password from .env
      if (/* userEmail === process.env.ADMIN_EMAIL && */ decoded.password === process.env.ADMIN_PASS) {
        next();  // Continue to the actual API endpoint
      } else {
        return res.status(403).json({ error: 'Access denied. Invalid admin credentials.' });
      }
    } catch (error) {
        console.log(error)
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
  };
  
 
  module.exports = adminAuthenticator;
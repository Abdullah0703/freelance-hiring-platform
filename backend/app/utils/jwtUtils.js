'use strict';

const jwt = require('jsonwebtoken');

const secretKey = 'suria';
const tokenBlacklist = new Set(); // Maintain a set to store invalidated tokens
// Set expiration time to a very large value (e.g., 10 years)
const expirationTime = Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60;
module.exports.generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '10y' });
  };
  


module.exports.verifyToken = (token) => {
  console.log('Verifying token...');
  try {
    if (tokenBlacklist.has(token)) {
      throw new Error('Token is blacklisted');
    }

    const decodedToken = jwt.verify(token, secretKey);
    // console.log('Token verification successful:', decodedToken);
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error.message);
    throw error;
  }
};

module.exports.addToBlacklist = (token) => {
  tokenBlacklist.add(token);
};

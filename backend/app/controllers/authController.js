'use strict';

const jwtUtils = require('../utils/jwtUtils');
const UserController = require('./userController');
const fs = require('fs');

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      let user = await UserController.login(email, password);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const profilePath = `uploads/profile/${user?.profilePicture}`;
      let profilePic;
      let profilePicture = "";
      if (fs.existsSync(profilePath)) {
        try {
          profilePic = fs.readFileSync(profilePath);
          profilePicture = Buffer.from(profilePic).toString('base64');
        } catch (err) {
          console.error('Error reading profile file:', err);
        }
      }

      const authToken = jwtUtils.generateToken({
        id: user.userId,
        email: user.email,
        role: user.role,
      });
      console.log("User Login successful");
      return res.status(200).json({ success: true, message: 'Login successful', user, profilePicture, authToken });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
  }


  static async signup(req, res) {
    try {

      let user = await UserController.createUser(req.body);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const authToken = jwtUtils.generateToken({
        id: user.userId,
        email: user.email,
        role: user.role,
      });

      return res.status(200).json({ success: true, message: 'SignUp successful', user, authToken });
    } catch (error) {
      console.error('SignUp error:', error);
      return res.status(500).json({ success: false, message: 'SignUp failed', error: error.message });
    }
  }

  static async logout(req, res) {
    const authToken = req.header('Authorization');

    if (!authToken) {
      return res.status(401).json({ success: false, message: 'Access denied. Missing authentication token.' });
    }

    try {
      const token = authToken.split(' ')[1]; // Splitting the token
      jwtUtils.addToBlacklist(token); // Add the token to the blacklist

      // Respond with a success message
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ success: false, message: 'Failed to log out', error: error.message });
    }
  }
}

module.exports = AuthController;

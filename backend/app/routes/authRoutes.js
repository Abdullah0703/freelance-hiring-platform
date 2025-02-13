'use strict';

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
// const AuthMiddleware = require('../middleware/authMiddleware');
// const UserController = require('../controllers/userController');


// Login User
router.post('/login', AuthController.login);

// Logout User
router.post('/logout', AuthController.logout);

// Register User
router.post('/signup', AuthController.signup);


module.exports = router;

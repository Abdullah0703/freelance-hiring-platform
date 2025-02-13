'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');



// Get all user
router.get('/', userController.getAllUsers);

// Get all user
router.get('/clients', userController.getAllClients);

// Get all user
router.get('/billers', userController.getAllBillers);

// Get a specific user by ID
router.get('/:id', userController.getUserById);

// Update a user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

// Add a profile picture for a user by ID
router.post('/profile-picture/:id', userController.uploadProfilePictureUser);

module.exports = router;

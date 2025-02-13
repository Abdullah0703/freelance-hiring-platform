
// app\middleware\errorHandler.js


const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const adminController = require('../controllers/adminController');
const validation = require('../utils/validation');


// Add a new client
router.post('/client', validation.validateClient, clientController.addClient);


// Delete a client by ID
router.delete('/client/:id', clientController.deleteClient);

// Modify a client by ID
router.put('/client/:id', clientController.modifyClient);

// Get all clients
router.get('/clients', clientController.getAllClients);

// Get a client by name or email
router.get('/client', clientController.getClientByNameOrEmail);

router.post('/admin/signup', validation.validateAdminSignup, adminController.adminSignup);


module.exports = router;

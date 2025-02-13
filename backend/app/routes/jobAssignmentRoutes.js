'use strict';

const express = require('express');
const router = express.Router();
const jobAssignmentController = require('../controllers/jobAssignmentController');

// Get all jobs
router.get('/', jobAssignmentController.getAllJobAssignments);

// Get a specific job by ID
router.get('/:id', jobAssignmentController.getJobAssignmentById);

// Create a new job
router.post('/', jobAssignmentController.createJobAssignment);

// Update a job by ID
router.put('/:id', jobAssignmentController.updateJobAssignment);

// Delete a job by ID
router.delete('/:id', jobAssignmentController.deleteJobAssignment);

module.exports = router;
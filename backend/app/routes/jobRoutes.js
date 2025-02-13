'use strict';

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Get all jobs
router.get('/', jobController.getAllJobs);

// Get all jobs
router.get('/client/:id', jobController.getJobsOfClient);

// Get all jobs
router.get('/biller/:id', jobController.getJobsOfBiller);

// Get all jobs
router.get('/biller-of-job/:id', jobController.getBillersOfJob);

// Get a specific job by ID
router.get('/:id', jobController.getJobById);

// Create a new job
router.post('/', jobController.createJob);

// Update a job by ID
router.put('/:id', jobController.updateJob);

// Delete a job by ID
router.delete('/:id', jobController.deleteJob);

module.exports = router;
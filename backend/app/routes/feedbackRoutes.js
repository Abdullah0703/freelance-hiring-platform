'use strict';

const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');

// Create a new feedback
router.post('/', FeedbackController.createFeedback);

// Get all feedbacks
router.get('/', FeedbackController.getAllFeedbacks);

// Get a specific feedback by ID
router.get('/:id', FeedbackController.getFeedbackById);

// Update a feedback by ID
router.put('/:id', FeedbackController.updateFeedback);

// Delete a feedback by ID
router.delete('/:id', FeedbackController.deleteFeedback);

// Get feedbacks by client and job ID (optional)
router.get('/client-job/:clientId/:jobId', FeedbackController.getByClientAndJobID);

// Get feedbacks by biller and job ID (optional)
router.get('/biller-job/:billerId/:jobId', FeedbackController.getByBillerAndJobID);

// Get feedbacks by biller ID (optional)
router.get('/biller/:billerId', FeedbackController.getByBillerId);

// Get feedbacks by job ID (optional)
router.get('/job/:jobId', FeedbackController.getByJobId);

// Get feedbacks by client ID (optional)
router.get('/client/:clientId', FeedbackController.getByClientId);

module.exports = router;

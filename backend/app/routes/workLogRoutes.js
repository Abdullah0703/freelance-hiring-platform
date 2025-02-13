'use strict';

const express = require('express');
const router = express.Router();
const WorkLogController = require('../controllers/workLogController');



// create work logs
router.post('/', WorkLogController.createWorkLog);

// Get a specific work logs by ID
router.get('/:id', WorkLogController.getWorkLogById);

// Get all work logs 
router.get('/', WorkLogController.getAllWorkLogs);

// get a work logs by biller and client ID
router.get('/biller/:id', WorkLogController.getWorkLogsByBillerId);
router.get('/client/:id', WorkLogController.getWorkLogsByClientId);

// get a work logs by biller and job ID
router.get('/biller-by-job/:billerId/:jobId', WorkLogController.getWorkLogsByBillerAndJobId);

// Update a work logs by ID
router.put('/:id', WorkLogController.updateWorkLog);

// Delete a work logs by ID
router.delete('/:id', WorkLogController.deleteWorkLog);


module.exports = router;

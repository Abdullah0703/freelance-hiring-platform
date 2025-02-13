'use strict';

const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController'); // Adjust the path as necessary

// Get total count of clients
router.get('/', DashboardController.getDashboardData);
router.get('/client-dashboard/:id', DashboardController.getClientDashboardData);


// router.get('/clients/count', DashboardController.GetTotalClientsCount);

// // Get total count of billers
// router.get('/billers/count', DashboardController.GetTotalBillersCount);

// // Get total count of jobs assigned
// router.get('/jobs/count', DashboardController.GetTotalJobsCount);

// // Get count of interviews scheduled
// router.get('/interviews/scheduled/count', DashboardController.GetInterviewSchedulingCount);

// // Get last two billers
// router.get('/billers/last-two', DashboardController.GetLastTwoBillers);

// // Get last two clients
// router.get('/clients/last-two', DashboardController.GetLastTwoClients);

// // Get client report count (active and non-active clients)
// router.get('/clients/report/count', DashboardController.GetClientReportCount);

// // Get total hours logged
// router.get('/worklog/total-hours', DashboardController.getTotalHours);

// // Get average feedback rating
// router.get('/feedback/average-rating', DashboardController.getAverageRating);

module.exports = router;

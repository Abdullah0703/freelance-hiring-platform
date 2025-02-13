'use strict';

const Users = require('../models/userModel')
const JobsAssigned = require('../models/jobAssignmentModel')
const job = require('../models/jobModel')
const WorkLog = require('../models/workLogModel')
const Feedback = require('../models/feedbackModel');
const { or, Op, fn, literal, col } = require('sequelize');

class DashboardController {

    static async getDashboardData(req, res) {
        try {

            const totalClientsCount = await DashboardController.GetTotalClientsCount();
            const totalBillersCount = await DashboardController.GetTotalBillersCount();
            const totalJobsCount = await DashboardController.GetTotalJobsCount();
            const interviewSchedulingCount = await DashboardController.GetInterviewSchedulingCount();
            const lastTwoBillers = await DashboardController.GetLastTwoBillers();
            const lastTwoClients = await DashboardController.GetLastTwoClients();
            const clientReportCount = await DashboardController.GetClientReportCount();
            const totalHours = await DashboardController.getTotalHours();
            const averageRating = await DashboardController.getAverageRating();

            const dashboardData = {
                totalClientsCount,
                totalBillersCount,
                totalJobsCount,
                interviewSchedulingCount,
                lastTwoBillers,
                lastTwoClients,
                clientReportCount,
                totalHours,
                averageRating
            };

            return res.status(200).json({ success: true, dashboardData });
        } catch (error) {
            console.error('Error retrieving dashboard data:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve dashboard data', error: error.message });
        }
    }
    static async getClientDashboardData(req, res) {
        try {
            const clientId = req.params.id; // Get client ID from route parameter

            // Ensure the client exists
            const client = await Users.findByPk(clientId, { where: { role: 'CLIENT' } });
            if (!client) {
                return res.status(404).json({ success: false, message: 'Client not found' });
            }

            // Fetch job statistics for the client
            const jobsPosted = await job.count({
                where: {
                    clientId: clientId
                }
            });

            const jobsCompleted = await job.count({
                where: {
                    clientId: clientId,
                    status: 'COMPLETED'
                }
            });

            const jobsAborted = await job.count({
                where: {
                    clientId: clientId,
                    status: 'ABORTED'
                }
            });

            // const revenue = await job.sum('price', {
            //     where: {
            //         clientId: clientId,
            //         status: 'COMPLETED'
            //     }
            // });

            const dashboardData = {
                jobsPosted,
                jobsCompleted,
                jobsAborted,
                // revenue
            };

            return res.status(200).json({ success: true, dashboardData });
        } catch (error) {
            console.error('Error retrieving client dashboard data:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve client dashboard data', error: error.message });
        }
    }
    static async GetTotalClientsCount() {
        try {
            const { count } = await Users.findAndCountAll({
                where: { role: 'CLIENT' }
            });
            return count;
        } catch (error) {
            console.error('Error Getting Clients Count:', error);
            throw new Error('Failed Getting Clients Count');
        }
    }


    static async GetTotalBillersCount() {
        try {
            const { count } = await Users.findAndCountAll({
                where: { role: 'BILLER' }
            });
            return count;
        } catch (error) {
            console.error('Error Getting Billers Count:', error);
            throw new Error('Failed Getting Billers Count');
        }
    }

    static async GetTotalJobsCount() {
        try {
            const { count } = await job.findAndCountAll();
            return count;
        } catch (error) {
            console.error('Error Getting Jobs Count:', error);
            throw new Error('Failed Getting Jobs Count');
        }
    }

    static async GetInterviewSchedulingCount() {
        try {
            const { count } = await JobsAssigned.findAndCountAll({
                include: [{
                    model: job,
                    where: {
                        meetingLink: { [Op.is]: null }
                    },
                    attributes: []
                }]
            });
            return count;
        } catch (error) {
            console.error('Error Getting Interview Scheduling Count:', error);
            throw new Error('Failed Getting Interview Scheduling Count');
        }
    }

    static async GetLastTwoBillers() {
        try {
            const billers = await Users.findAll({
                where: { role: 'BILLER' },
                order: [['createdAt', 'DESC']],
                limit: 2
            });
            return billers;
        } catch (error) {
            console.error('Error Getting Last 2 Billers:', error);
            throw new Error('Failed Getting Last 2 Billers');
        }
    }

    static async GetLastTwoClients() {
        try {
            const clients = await Users.findAll({
                where: { role: 'CLIENT' },
                order: [['createdAt', 'DESC']],
                limit: 2
            });

            for (const client of clients) {
                const clientId = client.userId;

                const totalPostedJobsCount = await job.count({
                    where: {
                        clientId: clientId
                    }
                });

                const activeJobsCount = await JobsAssigned.count({
                    include: [{
                        model: job,
                        where: {
                            clientId: clientId,

                        },
                        attributes: []
                    }],
                    where: {
                        jobId: {
                            [Op.ne]: null
                        }
                    },
                    raw: true,
                    distinct: true,
                    col: 'jobId'
                });

                client.setDataValue('totalPostedJobsCount', totalPostedJobsCount);
                client.setDataValue('activeJobsCount', activeJobsCount);
            }

            return clients;
        } catch (error) {
            console.error('Error Getting Last 2 Clients with Job Counts:', error);
            throw new Error('Failed Getting Last 2 Clients with Job Counts');
        }
    }


    static async GetClientReportCount() {
        try {
            const result = await JobsAssigned.findAll({
                include: [{
                    model: job,
                    attributes: []
                }],
                attributes: [[literal('COUNT(DISTINCT(`Job`.`clientId`))'), 'distinctClientCount']],
                raw: true
            });

            const uniqueClientCount = result[0] ? result[0].distinctClientCount : 0;

            const { count } = await Users.findAndCountAll({
                where: { role: 'CLIENT' }
            });

            const nonActiveClientCount = count - uniqueClientCount;

            return {
                ActiveCount: uniqueClientCount,
                NonActiveCount: nonActiveClientCount
            };
        } catch (error) {
            console.error('Error Getting Client Report Count:', error);
            throw new Error('Failed Getting Client Report Count');
        }
    }

    static async getTotalHours() {
        try {
            const result = await WorkLog.findAll({
                attributes: [
                    [fn('SUM', col('hoursLog')), 'totalHours']
                ],
                raw: true
            });

            const totalHours = result[0] ? result[0].totalHours : 0;
            return totalHours;
        } catch (error) {
            console.error('Error Getting Total Hours:', error);
            throw new Error('Failed Getting Total Hours');
        }
    }

    static async getAverageRating() {
        try {
            const result = await Feedback.findOne({
                attributes: [
                    [fn('AVG', col('rating')), 'averageRating']
                ],
                raw: true
            });

            const averageRating = result.averageRating || 0;
            return averageRating;
        } catch (error) {
            console.error('Error Getting Average Rating:', error);
            throw new Error('Failed Getting Average Rating');
        }
    }
}
// (async () => {
//     try {
//         const totalClientsCount = await DashboardController.GetTotalClientsCount();
//         console.log(totalClientsCount);
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// })();

module.exports = DashboardController;

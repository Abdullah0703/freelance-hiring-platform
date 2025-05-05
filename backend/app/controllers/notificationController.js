'use strict';
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const JobAssignment = require('../models/jobAssignmentModel');
const db = require('../../config/dbConfig');
const Notifications = require('../models/notificationModel');
const { Op } = require('sequelize');
const Ticket = require('../models/TicketModel');

class NotificationController {
    // Create a notification
    static async createNotification(userId, title, description, type, jobId = null) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const notification = await Notifications.create({
                userId,
                title,
                description,
                type,
                jobId,
                read: false
            });

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error; // Don't wrap the error, throw the original
        }
    }

    // Notify admin about job operations
    static async notifyAdminOnJobOperation(jobId, operationType) {
        try {
            if (!['CREATE', 'UPDATE', 'DELETE'].includes(operationType)) {
                throw new Error('Invalid operation type');
            }
            
            const job = await Job.findByPk(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            // Get all admin users
            console.log("jobId: ", jobId)
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            // Create notification based on operation
            let title, description, type;
            switch (operationType) {
                case 'CREATE':
                    title = 'New Job Created';
                    description = `A new Job titled '${job.title}' has been created.`;
                    type = 'JOB_POSTED';
                    break;
                case 'UPDATE':
                    title = 'Job Updated';
                    description = `Job titled '${job.title}' has been updated to status ${job.status}.`;
                    type = `${job.status}`;
                    break;
                case 'DELETE':
                    title = 'Job Deleted';
                    description = `Job titled '${job.title}' has been deleted.`;
                    type = 'JOB_DELETED';
                    break;
                default:
                    throw new Error('Invalid operation type');
            }
            // Create notifications for all admins
            for (const admin of admins) {
                await this.createNotification(admin.userId, title, description, type, jobId);
            }
        } catch (error) {
            console.error('Error notifying admin on job operation:', error);
            throw error; // Don't wrap the error, throw the original
        }
    }

    // Display all notifications to the admin
    static async displayAllNotificationsForAdmin(adminId) {
        try {
            const notifications = await Notifications.findAll({
                where: { userId: adminId },
                include: [
                    { model: Job, as: 'job' },
                    { model: JobAssignment, as: 'jobAssignment' }
                ],
                order: [['createdAt', 'DESC']]
            });
            return notifications;
        } catch (error) {
            console.error('Error retrieving notifications:', error);
            throw new Error('Failed to retrieve notifications');
        }
    }
    // static async displayAllNotificationsForClient(clientId) {
    //     try {
    //         // Fetch notifications for the given client
    //         const notifications = await Notifications.findAll({
    //             where: { userId: clientId },
    //             include: [
    //                 {
    //                     model: Job,
    //                     as: 'job',
    //                     where: { clientId: clientId }
    //                 }
    //             ],
    //             order: [['createdAt', 'DESC']]
    //         });

    //         // Process the notifications to include relevant job info
    //         const processedNotifications = notifications.map(notification => {
    //             return {
    //                 ...notification.toJSON(),
    //                 jobDetails: {
    //                     jobId: notification.job.jobId,
    //                     jobTitle: notification.job.title,
    //                     jobDescription: notification.job.description,
    //                     // Add more fields as needed
    //                 }
    //             };
    //         });

    //         return processedNotifications;
    //     } catch (error) {
    //         console.error('Error retrieving notifications for client:', error);
    //         throw new Error('Failed to retrieve notifications for client');
    //     }
    // }
    // static async displayAllNotificationsForBiller(billerId) {
    //     try {
    //         // Fetch job assignments for the given biller
    //         const jobAssignments = await JobAssignment.findAll({
    //             where: { billerId: billerId },
    //             include: [
    //                 {
    //                     model: Job,
    //                     as: 'job'
    //                 }
    //             ]
    //         });
    //         // Extract job IDs from the job assignments
    //         const jobIds = jobAssignments.map(assignment => assignment.jobId);
    //         // Fetch notifications related to those jobs
    //         const notifications = await Notifications.findAll({
    //             where: {
    //                 jobId: {
    //                     [Op.in]: jobIds
    //                 }
    //             },
    //             include: [
    //                 {
    //                     model: Job,
    //                     as: 'job'
    //                 }
    //             ],
    //             order: [['createdAt', 'DESC']]
    //         });
    //         // Process the notifications to include relevant job info
    //         const processedNotifications = notifications.map(notification => {
    //             return {
    //                 ...notification.toJSON(),
    //                 jobDetails: {
    //                     jobId: notification.job.jobId,
    //                     jobTitle: notification.job.title,
    //                     jobDescription: notification.job.description,
    //                 }
    //             };
    //         });
    //         return processedNotifications;
    //     } catch (error) {
    //         console.error('Error retrieving notifications for biller:', error);
    //         throw new Error('Failed to retrieve notifications for biller');
    //     }
    // }

    // Function to notify users when a job status changes to COMPLETED or ABORTED
    static async notifyJobStatusChange(jobId) {
        try {
            const job = await Job.findByPk(jobId, {
                include: [{
                    model: User,
                    as: 'billers',
                    through: JobAssignment
                }]
            });

            if (!job) {
                throw new Error('Job not found');
            }
            const { status, clientId, billers } = job;
            if (status === 'COMPLETED' || status === 'ABORTED') {
                // Notify the client who posted the job
                // await this.createNotification(clientId, 'Job Status Update', `The job you posted has been ${status.toLowerCase()}.`, status, jobId);
                // Notify each biller assigned to the job
                for (const biller of billers) {
                    await this.createNotification(biller.userId, 'Job Status Update', `The Job you were assigned to has been ${status.toLowerCase()}.`, status, jobId);
                }
                // Notify the admin
                const admins = await User.findAll({ where: { role: 'ADMIN' } });
                for (const admin of admins) {
                    await this.createNotification(admin.userId, 'Job Status Update', `The Job titled ${job.title} has been ${status.toLowerCase()}.`, status, jobId);
                }
            }
        } catch (error) {
            console.error('Error notifying job status change:', error);
            throw new Error('Failed to notify job status change');
        }
    }
    //Notify Finalized Billers for the Job
    static async notifyFinailizedBillers(jobId) {
        try {
            const job = await Job.findByPk(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            if (job.status === 'FINALIZED') {
                // Notify billers
                if (job.billers && job.billers.length > 0) {
                    for (const biller of job.billers) {
                        await Notifications.create({
                            userId: biller.userId,
                            title: 'Job Finalized',
                            message: `The job "${job.title}" has been finalized`,
                            type: 'JOB_STATUS'
                        });
                    }
                }

                // Notify admins
                const admins = await User.findAll({ where: { role: 'ADMIN' } });
                for (const admin of admins) {
                    await Notifications.create({
                        userId: admin.userId,
                        title: 'Job Finalized',
                        message: `The job "${job.title}" has been finalized`,
                        type: 'JOB_STATUS'
                    });
                }
            }
        } catch (error) {
            console.error('Error notifying finalized billers:', error);
            throw error;
        }
    }
    // Notify only the client and recommended billers when the job status is INTERVIEW_SCHEDULED
    static async notifyClientAndBillersOnStatusChange(jobId) {
        try {
            const job = await Job.findByPk(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            if (job.status === 'INTERVIEW_SCHEDULED') {
                // Notify client
                await this.createNotification(
                    job.clientId,
                    'Interview Scheduled',
                    `An interview has been scheduled for job: ${job.title}`,
                    'JOB_STATUS',
                    jobId
                );

                // Notify billers
                if (job.billers && job.billers.length > 0) {
                    for (const biller of job.billers) {
                        await this.createNotification(
                            biller.userId,
                            'Interview Scheduled',
                            `An interview has been scheduled for job: ${job.title}`,
                            'JOB_STATUS',
                            jobId
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error notifying client and billers:', error);
            throw error;
        }
    }

    static async notifyClientMeetAdmin(jobId) {
        try {
            const job = await Job.findByPk(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            if (job.status === 'INITIAL_MEETING_SCHEDULED') {
                // Notify the client who posted the job
                console.log("Client id fetched from job in notification controller method:", job.clientId)
                if (job.clientId) {
                    await this.createNotification(
                        job.clientId,
                        'Interview Scheduled',
                        `The Interview for the  job titled '${job.title}' has been scheduled.`,
                        job.status,
                        jobId
                    );
                    console.log('Notification sent to the client for interview.');
                } else {
                    console.log('Client not found for the job.');
                }
            }
        } catch (error) {

        }
    }
    //mark notification as read
    static async markNotificationAsRead(notificationId) {
        try {
            const notification = await Notifications.findByPk(notificationId);
            if (!notification) {
                throw new Error('Notification not found');
            }
            notification.read = true;
            await notification.save();
            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error; // Don't wrap the error, throw the original
        }
    }
    //unread notifications
    static async getUnreadNotificationsCount(userId) {
        try {
            const count = await Notifications.count({
                where: {
                    userId,
                    read: false
                }
            });
            return count;
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);
            throw new Error('Failed to fetch unread notifications count');
        }
    }

    static async sendTicketNotification(jobId) {
        try {
            const job = await Job.findByPk(jobId, {
                include: [{ model: User, as: 'client' }]
            });
            if (!job) {
                throw new Error('Job not found');
            }

            const client = job.client;
            if (!client || client.role !== 'CLIENT') {
                throw new Error('Invalid client associated with the job');
            }

            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            if (!admins || admins.length === 0) {
                throw new Error('No admins found to notify');
            }

            const tickets = await Ticket.findAll({ where: { jobId } });
            if (!tickets || tickets.length === 0) {
                return;
            }

            for (const ticket of tickets) {
                const notificationTitle = `New Ticket Created for Job: ${job.title}`;
                const notificationDescription = `Complaint: ${ticket.complaint}`;
                
                for (const admin of admins) {
                    await this.createNotification(
                        admin.userId,
                        notificationTitle,
                        notificationDescription,
                        'TICKET',
                        job.jobId
                    );
                }
            }
        } catch (error) {
            console.error('Error sending ticket notification:', error.message);
            throw error; // Re-throw the error to be caught by the test
        }
    }

    static async sendResolveTicketNotificationToClient(ticketId) {
        try {
            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            const job = await Job.findByPk(ticket.jobId, {
                include: [{ model: User, as: 'client' }]
            });
            if (!job) {
                throw new Error('Job associated with the ticket not found');
            }

            const client = job.client;
            if (!client || client.role !== 'CLIENT') {
                throw new Error('Invalid client associated with the job');
            }

            await this.createNotification(
                client.userId,
                `The Ticket ID: ${ticket.ticketId} is Resolved`,
                `Complaint: ${ticket.complaint}`,
                'TICKET'
            );
        } catch (error) {
            console.error('Error sending resolved ticket notification to client:', error.message);
            throw error; // Re-throw the error to be caught by the test
        }
    }
    static async sendResolveTicketNotificationToAdmin(ticketId) {
        try {
            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            const job = await Job.findByPk(ticket.jobId, {
                include: [{ model: User, as: 'client' }]
            });
            if (!job) {
                throw new Error('Job associated with the ticket not found');
            }

            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            if (!admins || admins.length === 0) {
                throw new Error('Admin user not found');
            }

            for (const admin of admins) {
                await this.createNotification(
                    admin.userId,
                    `Ticket ID: ${ticket.ticketId} is Resolved by Client`,
                    `A ticket has been resolved. Complaint: ${ticket.complaint}`,
                    'TICKET',
                    ticket.jobId
                );
            }
        } catch (error) {
            console.error('Error sending resolved ticket notification to admin:', error.message);
            throw error; // Re-throw the error to be caught by the test
        }
    }
}

// Export the class
module.exports = NotificationController;
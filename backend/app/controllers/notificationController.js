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
    static async createNotification(userId, title, description, type, jobId = null, jobAssignmentId = null) {
        try {
            const notification = await Notifications.create({
                userId,
                title,
                description,
                type,
                jobId,
                jobAssignmentId
            });
            console.log("Notification created: ", notification);
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Failed to create notification');
        }
    }

    // Notify admin about job operations
    static async notifyAdminOnJobOperation(jobId, operation) {
        try {
            // Get all admin users
            console.log("jobId: ", jobId)
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            // Fetch job details
            const job = await Job.findByPk(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            // Create notification based on operation
            let title, description, type;
            switch (operation) {
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
            throw new Error('Failed to notify admin');
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
            if (status === 'FINALIZED') {
                const admins = await User.findAll({ where: { role: 'ADMIN' } });
                // Notify each biller assigned to the job
                for (const biller of billers) {
                    await this.createNotification(biller.userId, 'Job Status Update', `You have been Finalized for Job titled ${job.title}`, status, jobId);
                    // Notify the admin
                    for (const admin of admins) {
                        await this.createNotification(admin.userId, 'Job Status Update', `The Biller ${biller.userId} have been Finalized for the Job`, status, jobId);
                    }
                }
            }
        } catch (error) {
            console.error('Error notifying job status change:', error);
            throw new Error('Failed to notify job status change');
        }
    }
    // Notify only the client and recommended billers when the job status is INTERVIEW_SCHEDULED
    static async notifyClientAndBillersOnStatusChange(jobId) {
        try {
            // Find the job by ID, including the client who posted the job and the recommended billers
            const job = await Job.findByPk(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            console.log("recommended profiles raw in notification: ", job.recommendedProfiles, "of type", typeof (job.recommendedProfiles));
            // Parse and validate recommendedProfiles
            const recommendedProfiles = Array.isArray(job.recommendedProfiles)
                ? job.recommendedProfiles
                : JSON.parse(job.recommendedProfiles || '[]');
            if (!Array.isArray(recommendedProfiles)) {
                throw new Error('Expected parsedProfiles to be an array');
            }
            console.log("Parsed recommendedProfiles in notification: ", recommendedProfiles)
            console.log("job custom: ", job)
            // Notify the recommended billers if the status is INTERVIEW_SCHEDULED
            if (job.status === 'INTERVIEW_SCHEDULED' && job.recommendedProfiles.length > 0) {
                console.log("creating notification for the client after recommending billers")
                await this.createNotification(
                    job.clientId,
                    'Billers Recommended',
                    `The Billers for the Job "${job.title}" are recommended`,
                    job.status,
                    jobId
                );
                for (const biller of recommendedProfiles) {
                    console.log("Biller for loop:", biller);
                    await this.createNotification(
                        biller,
                        'Interview Scheduled',
                        `Your interview for the job titled '${job.title}' has been scheduled with Client.`,
                        job.status,
                        jobId,
                    );
                }
                console.log('Notifications sent to recommended billers for interview.');
            }
            else {
                console.log('Job status is not INTERVIEW_SCHEDULED. No notifications sent.');
            }
        } catch (error) {
            console.error('Error notifying client and billers for status change:', error);
            throw new Error('Failed to notify client and billers for status change');
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
            throw new Error('Failed to mark notification as read');
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
            // Fetch the job with the associated client details
            const job = await Job.findByPk(jobId, {
                include: [{ model: User, as: 'client' }]
            });
            if (!job) {
                throw new Error('Job not found');
            }
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            if (!admins || admins.length === 0) {
                throw new Error('No admins found to notify.');
            }
            // Fetch all tickets related to this job
            const tickets = await Ticket.findAll({ where: { jobId } });
            if (!tickets || tickets.length === 0) {
                console.log('No tickets found for this job.');
                return;
            }
            const client = job.client; // Extracting client details from the job
            if (!client || client.role !== 'CLIENT') {
                throw new Error('Invalid client associated with the job.');
            }
            // Loop through all tickets and create notifications
            for (const ticket of tickets) {
                const notificationTitle = `New Ticket Created for Job: ${job.title}`;
                const notificationDescription = `Complaint: ${ticket.complaint}`;
                const notificationType = 'TICKET';
                // Create a notification for the client
                for (const admin of admins) {
                    await this.createNotification(admin.userId, notificationTitle, notificationDescription, notificationType, job.jobId);
                }
            }
            console.log('Notifications sent successfully.');
        } catch (error) {
            console.error('Error sending ticket notification:', error.message);
        }
    }

    static async sendResolveTicketNotificationToClient(ticketId) {
        try {
            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            const { jobId } = ticket;
            const job = await Job.findByPk(jobId, {
                include: [{ model: User, as: 'client' }]
            });
            if (!job) {
                throw new Error('Job associated with the ticket not found');
            }
            const client = job.client;
            if (!client || client.role !== 'CLIENT') {
                throw new Error('Invalid client associated with the job.');
            }
            const notificationTitle = `The Ticket ID: ${ticket.ticketId} is Resolved`;
            const notificationDescription = `Complaint: ${ticket.complaint}`;
            const notificationType = 'TICKET';
            // Create a notification for the client
            await this.createNotification(
                client.userId,
                notificationTitle,
                notificationDescription,
                notificationType
            );
            console.log("sednResolveTicketNotification to client");
        } catch (error) {
            console.error('Error sending resolved ticket notification to client:', error.message);
        }
    }
    static async sendResolveTicketNotificationToAdmin(ticketId) {
        try {
            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            const { jobId } = ticket;
            const job = await Job.findByPk(jobId, {
                include: [{ model: User, as: 'client' }]
            });
            if (!job) {
                throw new Error('Job associated with the ticket not found');
            }
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            if (!admins) {
                throw new Error('Admin user not found');
            }
            const notificationTitle = `Ticket ID: ${ticket.ticketId} is Resolved by Client`;
            const notificationDescription = `A ticket has been resolved. \nComplaint: ${ticket.complaint}`;
            const notificationType = 'TICKET';
            for (const admin of admins) {
                if (admin.userId) {
                    await this.createNotification(
                        admin.userId,
                        notificationTitle,
                        notificationDescription,
                        notificationType
                    );
                } else {
                    console.error(`Admin userId is null for admin: ${admin}`);
                }
            }
            console.log("sendResolveTicketNotification to admins");
        } catch (error) {
            console.error('Error sending resolved ticket notification to admin:', error.message);
        }
    }
    static async sendEditTicketNotification(ticketId) {
        try {
            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            if (!admins) {
                throw new Error('Admin user not found');
            }
            const notificationTitle = `Ticket ID: ${ticket.ticketId} is Edited`;
            const notificationDescription = `A ticket has been edited. \nComplaint: ${ticket.complaint}`;
            const notificationType = 'TICKET';
            for (const admin of admins) {
                if (admin.userId) {
                    await this.createNotification(
                        admin.userId,
                        notificationTitle,
                        notificationDescription,
                        notificationType
                    );
                } else {
                    console.error(`Admin userId is null for admin: ${admin}`);
                }
            }
            console.log("sendResolveTicketNotification to admins");
        } catch (error) {

        }
    }
    static async sendDeleteTicketNotification(ticketId) {
        try {
            const tickets = await Ticket.findByPk(ticketId);
            if (!tickets) {
                throw new Error('Ticket not found');
            }
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            if (!admins || admins.length === 0) {
                throw new Error('No admins found to notify.');
            }
            const notificationTitle = `Ticket ID: ${tickets.ticketId} is Deleted`;
            const notificationDescription = `A ticket has been Deleted. \nComplaint: ${tickets.complaint}`;
            const notificationType = 'TICKET';
            for (const admin of admins) {
                if (admin.userId) {
                    await this.createNotification(
                        admin.userId,
                        notificationTitle,
                        notificationDescription,
                        notificationType
                    );
                } else {
                    console.error(`Admin userId is null for admin: ${admin}`);
                }
            }
            console.log("send Delete ticket notification to admins");
        } catch (error) {
            console.error('Error sending delete ticket notification to admin:', error.message);
        }
    }

}

module.exports = NotificationController;

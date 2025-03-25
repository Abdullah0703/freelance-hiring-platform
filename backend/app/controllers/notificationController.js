'use strict';
const { Job, User, JobAssignment, Notifications, Ticket } = require('../models'); // updated paths
const db = require('../../config/dbConfig');
const { Op } = require('sequelize');

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
            if (operation !== 'CREATE' && operation !== 'UPDATE') {
                throw new Error('Invalid operation type');
            }
            console.log("jobId: ", jobId);
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            const job = await Job.findByPk(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
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
            for (const admin of admins) {
                await this.createNotification(admin.userId, title, description, type, jobId);
            }
        } catch (error) {
            console.error('Error notifying admin on job operation:', error);
            throw error;
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
            const { status, billers } = job;
            if (status === 'COMPLETED' || status === 'ABORTED') {
                for (const biller of billers) {
                    await this.createNotification(biller.userId, 'Job Status Update', `The Job you were assigned to has been ${status.toLowerCase()}.`, status, jobId);
                }
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

    // Notify Finalized Billers for the Job
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
            const { status, billers } = job;
            if (status === 'FINALIZED') {
                const admins = await User.findAll({ where: { role: 'ADMIN' } });
                for (const biller of billers) {
                    await this.createNotification(biller.userId, 'Job Status Update', `You have been Finalized for Job titled ${job.title}`, status, jobId);
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
            const job = await Job.findByPk(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            console.log("recommended profiles raw in notification: ", job.recommendedProfiles, "of type", typeof (job.recommendedProfiles));
            const recommendedProfiles = Array.isArray(job.recommendedProfiles)
                ? job.recommendedProfiles
                : JSON.parse(job.recommendedProfiles || '[]');
            if (!Array.isArray(recommendedProfiles)) {
                throw new Error('Expected parsedProfiles to be an array');
            }
            console.log("Parsed recommendedProfiles in notification: ", recommendedProfiles);
            console.log("job custom: ", job);
            if (job.status === 'INTERVIEW_SCHEDULED' && job.recommendedProfiles.length > 0) {
                console.log("creating notification for the client after recommending billers");
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
                console.log("Client id fetched from job in notification controller method:", job.clientId);
                if (job.clientId) {
                    await this.createNotification(
                        job.clientId,
                        'Interview Scheduled',
                        `The Interview for the job titled '${job.title}' has been scheduled.`,
                        job.status,
                        jobId
                    );
                    console.log('Notification sent to the client for interview.');
                } else {
                    console.log('Client not found for the job.');
                }
            }
        } catch (error) {
            console.error('Error in notifyClientMeetAdmin:', error);
        }
    }

    // Mark notification as read
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
            throw error;
        }
    }

    // Unread notifications count
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
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            if (!admins || admins.length === 0) {
                throw new Error('No admins found to notify.');
            }
            const tickets = await Ticket.findAll({ where: { jobId } });
            if (!tickets || tickets.length === 0) {
                console.log('No tickets found for this job.');
                return;
            }
            const client = job.client;
            if (!client || client.role !== 'CLIENT') {
                throw new Error('Invalid client associated with the job.');
            }
            for (const ticket of tickets) {
                const notificationTitle = `New Ticket Created for Job: ${job.title}`;
                const notificationDescription = `Complaint: ${ticket.complaint}`;
                const notificationType = 'TICKET';
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
            await this.createNotification(
                client.userId,
                notificationTitle,
                notificationDescription,
                notificationType
            );
            console.log("sendResolveTicketNotification to client");
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
            console.log("sendEditTicketNotification to admins");
        } catch (error) {
            console.error('Error sending edit ticket notification:', error.message);
        }
    }

    static async sendDeleteTicketNotification(ticketId) {
        try {
            const ticket = await Ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            const admins = await User.findAll({ where: { role: 'ADMIN' } });
            if (!admins || admins.length === 0) {
                throw new Error('No admins found to notify.');
            }
            const notificationTitle = `Ticket ID: ${ticket.ticketId} is Deleted`;
            const notificationDescription = `A ticket has been Deleted. \nComplaint: ${ticket.complaint}`;
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
            console.log("sendDeleteTicketNotification to admins");
        } catch (error) {
            console.error('Error sending delete ticket notification to admin:', error.message);
        }
    }
}

module.exports = NotificationController;

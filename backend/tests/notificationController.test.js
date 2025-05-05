const NotificationController = require('../app/controllers/notificationController');
const Notifications = require('../app/models/notificationModel');
const Job = require('../app/models/jobModel');
const User = require('../app/models/userModel');
const JobAssignment = require('../app/models/jobAssignmentModel');
const Ticket = require('../app/models/TicketModel');

jest.mock('../app/models/notificationModel');
jest.mock('../app/models/jobModel');
jest.mock('../app/models/userModel');
jest.mock('../app/models/jobAssignmentModel');
jest.mock('../app/models/TicketModel');

describe('NotificationController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createNotification', () => {
        it('should throw error if userId is not provided', async () => {
            await expect(NotificationController.createNotification(null, 'title', 'desc', 'JOB_POSTED')).rejects.toThrow('User ID is required');
        });

        it('should create notification and return it', async () => {
            const mockNotification = { notificationId: 1, userId: 2, title: 'title', description: 'desc', type: 'JOB_POSTED', read: false };
            Notifications.create.mockResolvedValue(mockNotification);
            const result = await NotificationController.createNotification(2, 'title', 'desc', 'JOB_POSTED');
            expect(Notifications.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: 2,
                title: 'title',
                description: 'desc',
                type: 'JOB_POSTED',
                read: false
            }));
            expect(result).toBe(mockNotification);
        });
    });

    describe('notifyAdminOnJobOperation', () => {
        it('should throw error for invalid operation type', async () => {
            await expect(NotificationController.notifyAdminOnJobOperation(1, 'INVALID')).rejects.toThrow('Invalid operation type');
        });

        it('should throw error if job not found', async () => {
            Job.findByPk.mockResolvedValue(null);
            await expect(NotificationController.notifyAdminOnJobOperation(1, 'CREATE')).rejects.toThrow('Job not found');
        });

        it('should create notifications for all admins on CREATE', async () => {
            const job = { jobId: 1, title: 'Test Job', status: 'POSTED' };
            const admins = [{ userId: 10 }, { userId: 11 }];
            Job.findByPk.mockResolvedValue(job);
            User.findAll.mockResolvedValue(admins);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyAdminOnJobOperation(1, 'CREATE');
            expect(Notifications.create).toHaveBeenCalledTimes(admins.length);
        });
    });

    describe('displayAllNotificationsForAdmin', () => {
        it('should return notifications for admin', async () => {
            const notifications = [{ notificationId: 1 }];
            Notifications.findAll.mockResolvedValue(notifications);
            const result = await NotificationController.displayAllNotificationsForAdmin(1);
            expect(result).toBe(notifications);
        });

        it('should throw error on failure', async () => {
            Notifications.findAll.mockRejectedValue(new Error('fail'));
            await expect(NotificationController.displayAllNotificationsForAdmin(1)).rejects.toThrow('Failed to retrieve notifications');
        });
    });

    describe('markNotificationAsRead', () => {
        it('should throw error if notification not found', async () => {
            Notifications.findByPk.mockResolvedValue(null);
            await expect(NotificationController.markNotificationAsRead(1)).rejects.toThrow('Notification not found');
        });

        it('should mark notification as read', async () => {
            const save = jest.fn().mockResolvedValue(true);
            const notification = { read: false, save };
            Notifications.findByPk.mockResolvedValue(notification);
            const result = await NotificationController.markNotificationAsRead(1);
            expect(notification.read).toBe(true);
            expect(save).toHaveBeenCalled();
            expect(result).toBe(notification);
        });
    });

    describe('getUnreadNotificationsCount', () => {
        it('should return count of unread notifications', async () => {
            Notifications.count.mockResolvedValue(5);
            const count = await NotificationController.getUnreadNotificationsCount(1);
            expect(count).toBe(5);
        });

        it('should throw error on failure', async () => {
            Notifications.count.mockRejectedValue(new Error('fail'));
            await expect(NotificationController.getUnreadNotificationsCount(1)).rejects.toThrow('Failed to fetch unread notifications count');
        });
    });

    // Additional tests for notifyJobStatusChange
    describe('notifyJobStatusChange', () => {
        it('should throw error if job not found', async () => {
            Job.findByPk.mockResolvedValue(null);
            await expect(NotificationController.notifyJobStatusChange(1)).rejects.toThrow('Job not found');
        });

        it('should not notify if job status is neither COMPLETED nor ABORTED', async () => {
            const job = { status: 'POSTED', clientId: 1, billers: [], title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            await NotificationController.notifyJobStatusChange(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });

        it('should notify billers and admins if job is COMPLETED', async () => {
            const billers = [{ userId: 2 }, { userId: 3 }];
            const admins = [{ userId: 10 }, { userId: 11 }];
            const job = { status: 'COMPLETED', clientId: 1, billers, title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            User.findAll.mockResolvedValue(admins);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyJobStatusChange(1);
            expect(Notifications.create).toHaveBeenCalledTimes(billers.length + admins.length);
        });

        it('should handle error and throw custom error', async () => {
            Job.findByPk.mockRejectedValue(new Error('fail'));
            await expect(NotificationController.notifyJobStatusChange(1)).rejects.toThrow('Failed to notify job status change');
        });
    });

    // Additional tests for notifyFinailizedBillers
    describe('notifyFinailizedBillers', () => {
        it('should throw error if job not found', async () => {
            Job.findByPk.mockResolvedValue(null);
            await expect(NotificationController.notifyFinailizedBillers(1)).rejects.toThrow('Job not found');
        });

        it('should not notify if job status is not FINALIZED', async () => {
            const job = { status: 'POSTED', billers: [], title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            await NotificationController.notifyFinailizedBillers(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });

        it('should notify billers and admins if job is FINALIZED', async () => {
            const billers = [{ userId: 2 }, { userId: 3 }];
            const admins = [{ userId: 10 }, { userId: 11 }];
            const job = { status: 'FINALIZED', billers, title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            User.findAll.mockResolvedValue(admins);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyFinailizedBillers(1);
            expect(Notifications.create).toHaveBeenCalledTimes(billers.length + admins.length);
        });
    });

    // Additional tests for notifyClientAndBillersOnStatusChange
    describe('notifyClientAndBillersOnStatusChange', () => {
        it('should throw error if job not found', async () => {
            Job.findByPk.mockResolvedValue(null);
            await expect(NotificationController.notifyClientAndBillersOnStatusChange(1)).rejects.toThrow('Job not found');
        });

        it('should not notify if job status is not INTERVIEW_SCHEDULED', async () => {
            const job = { status: 'POSTED', clientId: 1, billers: [], title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            await NotificationController.notifyClientAndBillersOnStatusChange(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });

        it('should notify client and billers if job status is INTERVIEW_SCHEDULED', async () => {
            const billers = [{ userId: 2 }, { userId: 3 }];
            const job = { status: 'INTERVIEW_SCHEDULED', clientId: 1, billers, title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyClientAndBillersOnStatusChange(1);
            expect(Notifications.create).toHaveBeenCalledTimes(1 + billers.length);
        });
    });

    // Additional tests for notifyClientMeetAdmin
    describe('notifyClientMeetAdmin', () => {
        it('should throw error if job not found', async () => {
            Job.findByPk.mockResolvedValue(null);
            await expect(NotificationController.notifyClientMeetAdmin(1)).rejects.toThrow('Job not found');
        });

        it('should not notify if job status is not INITIAL_MEETING_SCHEDULED', async () => {
            const job = { status: 'POSTED', clientId: 1, title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            await NotificationController.notifyClientMeetAdmin(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });

        it('should notify client if job status is INITIAL_MEETING_SCHEDULED and clientId exists', async () => {
            const job = { status: 'INITIAL_MEETING_SCHEDULED', clientId: 1, title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyClientMeetAdmin(1);
            expect(Notifications.create).toHaveBeenCalledTimes(1);
        });
    });

    // Additional tests for sendTicketNotification
    describe('sendTicketNotification', () => {
        it('should throw error if job not found', async () => {
            Job.findByPk.mockResolvedValue(null);
            await expect(NotificationController.sendTicketNotification(1)).rejects.toThrow('Job not found');
        });

        it('should throw error if client is invalid', async () => {
            Job.findByPk.mockResolvedValue({ client: null });
            await expect(NotificationController.sendTicketNotification(1)).rejects.toThrow('Invalid client associated with the job');
        });

        it('should throw error if no admins found', async () => {
            Job.findByPk.mockResolvedValue({ client: { role: 'CLIENT' }, title: 'Test Job', jobId: 1 });
            User.findAll.mockResolvedValue([]);
            await expect(NotificationController.sendTicketNotification(1)).rejects.toThrow('No admins found to notify');
        });

        it('should do nothing if no tickets found', async () => {
            Job.findByPk.mockResolvedValue({ client: { role: 'CLIENT' }, title: 'Test Job', jobId: 1 });
            User.findAll.mockResolvedValue([{ userId: 10 }]);
            Ticket.findAll.mockResolvedValue([]);
            await NotificationController.sendTicketNotification(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });

        it('should notify all admins for each ticket', async () => {
            Job.findByPk.mockResolvedValue({ client: { role: 'CLIENT' }, title: 'Test Job', jobId: 1 });
            User.findAll.mockResolvedValue([{ userId: 10 }, { userId: 11 }]);
            Ticket.findAll.mockResolvedValue([{ complaint: 'Issue 1' }, { complaint: 'Issue 2' }]);
            Notifications.create.mockResolvedValue({});
            await NotificationController.sendTicketNotification(1);
            expect(Notifications.create).toHaveBeenCalledTimes(4);
        });
    });

    // Additional tests for sendResolveTicketNotificationToClient
    describe('sendResolveTicketNotificationToClient', () => {
        it('should throw error if ticket not found', async () => {
            Ticket.findByPk.mockResolvedValue(null);
            await expect(NotificationController.sendResolveTicketNotificationToClient(1)).rejects.toThrow('Ticket not found');
        });

        it('should throw error if job not found', async () => {
            Ticket.findByPk.mockResolvedValue({ jobId: 1 });
            Job.findByPk.mockResolvedValue(null);
            await expect(NotificationController.sendResolveTicketNotificationToClient(1)).rejects.toThrow('Job associated with the ticket not found');
        });

        it('should throw error if client is invalid', async () => {
            Ticket.findByPk.mockResolvedValue({ jobId: 1 });
            Job.findByPk.mockResolvedValue({ client: null });
            await expect(NotificationController.sendResolveTicketNotificationToClient(1)).rejects.toThrow('Invalid client associated with the job');
        });

        it('should notify client if all data is valid', async () => {
            Ticket.findByPk.mockResolvedValue({ jobId: 1, ticketId: 2, complaint: 'Issue' });
            Job.findByPk.mockResolvedValue({ client: { userId: 5, role: 'CLIENT' } });
            Notifications.create.mockResolvedValue({});
            await NotificationController.sendResolveTicketNotificationToClient(1);
            expect(Notifications.create).toHaveBeenCalledTimes(1);
        });
    });

    // Additional tests for sendResolveTicketNotificationToAdmin
    describe('sendResolveTicketNotificationToAdmin', () => {
        it('should throw error if ticket not found', async () => {
            Ticket.findByPk.mockResolvedValue(null);
            await expect(NotificationController.sendResolveTicketNotificationToAdmin(1)).rejects.toThrow('Ticket not found');
        });

        it('should throw error if job not found', async () => {
            Ticket.findByPk.mockResolvedValue({ jobId: 1 });
            Job.findByPk.mockResolvedValue(null);
            await expect(NotificationController.sendResolveTicketNotificationToAdmin(1)).rejects.toThrow('Job associated with the ticket not found');
        });

        it('should throw error if no admins found', async () => {
            Ticket.findByPk.mockResolvedValue({ jobId: 1, ticketId: 2, complaint: 'Issue' });
            Job.findByPk.mockResolvedValue({ client: { userId: 5, role: 'CLIENT' } });
            User.findAll.mockResolvedValue([]);
            await expect(NotificationController.sendResolveTicketNotificationToAdmin(1)).rejects.toThrow('Admin user not found');
        });

        it('should notify all admins if all data is valid', async () => {
            Ticket.findByPk.mockResolvedValue({ jobId: 1, ticketId: 2, complaint: 'Issue' });
            Job.findByPk.mockResolvedValue({ client: { userId: 5, role: 'CLIENT' } });
            User.findAll.mockResolvedValue([{ userId: 10 }, { userId: 11 }]);
            Notifications.create.mockResolvedValue({});
            await NotificationController.sendResolveTicketNotificationToAdmin(1);
            expect(Notifications.create).toHaveBeenCalledTimes(2);
        });
    });
});

describe('NotificationController - Additional Edge Cases', () => {
    describe('createNotification', () => {
        it('should throw error if title is missing', async () => {
            await expect(NotificationController.createNotification(1, null, 'desc', 'JOB_POSTED')).rejects.toThrow();
        });

        it('should throw error if description is missing', async () => {
            await expect(NotificationController.createNotification(1, 'title', null, 'JOB_POSTED')).rejects.toThrow();
        });

        it('should throw error if type is missing', async () => {
            await expect(NotificationController.createNotification(1, 'title', 'desc', null)).rejects.toThrow();
        });
    });

    describe('notifyAdminOnJobOperation', () => {
        it('should handle empty admins array gracefully', async () => {
            const job = { jobId: 1, title: 'Test Job', status: 'POSTED' };
            Job.findByPk.mockResolvedValue(job);
            User.findAll.mockResolvedValue([]);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyAdminOnJobOperation(1, 'CREATE');
            expect(Notifications.create).not.toHaveBeenCalled();
        });
    });

    describe('markNotificationAsRead', () => {
        it('should not call save if notification is already read', async () => {
            const save = jest.fn();
            const notification = { read: true, save };
            Notifications.findByPk.mockResolvedValue(notification);
            const result = await NotificationController.markNotificationAsRead(1);
            expect(save).not.toHaveBeenCalled();
            expect(result).toBe(notification);
        });
    });

    describe('getUnreadNotificationsCount', () => {
        it('should return 0 if user has no unread notifications', async () => {
            Notifications.count.mockResolvedValue(0);
            const count = await NotificationController.getUnreadNotificationsCount(999);
            expect(count).toBe(0);
        });
    });

    describe('displayAllNotificationsForAdmin', () => {
        it('should return empty array if admin has no notifications', async () => {
            Notifications.findAll.mockResolvedValue([]);
            const result = await NotificationController.displayAllNotificationsForAdmin(12345);
            expect(result).toEqual([]);
        });
    });

    describe('notifyJobStatusChange', () => {
        it('should not throw if billers or admins are empty arrays', async () => {
            const job = { status: 'COMPLETED', clientId: 1, billers: [], title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            User.findAll.mockResolvedValue([]);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyJobStatusChange(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });
    });

    describe('notifyFinailizedBillers', () => {
        it('should not throw if billers or admins are empty arrays', async () => {
            const job = { status: 'FINALIZED', billers: [], title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            User.findAll.mockResolvedValue([]);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyFinailizedBillers(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });
    });

    describe('notifyClientAndBillersOnStatusChange', () => {
        it('should not throw if billers is empty', async () => {
            const job = { status: 'INTERVIEW_SCHEDULED', clientId: 1, billers: [], title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            Notifications.create.mockResolvedValue({});
            await NotificationController.notifyClientAndBillersOnStatusChange(1);
            expect(Notifications.create).toHaveBeenCalledTimes(1); // Only client notified
        });
    });

    describe('notifyClientMeetAdmin', () => {
        it('should not notify if clientId is missing', async () => {
            const job = { status: 'INITIAL_MEETING_SCHEDULED', title: 'Test Job' };
            Job.findByPk.mockResolvedValue(job);
            await NotificationController.notifyClientMeetAdmin(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });
    });

    describe('sendTicketNotification', () => {
        it('should not throw if tickets is undefined', async () => {
            Job.findByPk.mockResolvedValue({ client: { role: 'CLIENT' }, title: 'Test Job', jobId: 1 });
            User.findAll.mockResolvedValue([{ userId: 10 }]);
            Ticket.findAll.mockResolvedValue(undefined);
            await NotificationController.sendTicketNotification(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });
    });

    describe('sendResolveTicketNotificationToClient', () => {
        it('should not throw if client has no userId', async () => {
            Ticket.findByPk.mockResolvedValue({ jobId: 1, ticketId: 2, complaint: 'Issue' });
            Job.findByPk.mockResolvedValue({ client: { role: 'CLIENT' } });
            Notifications.create.mockResolvedValue({});
            await NotificationController.sendResolveTicketNotificationToClient(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });
    });

    describe('sendResolveTicketNotificationToAdmin', () => {
        it('should not throw if admins have no userId', async () => {
            Ticket.findByPk.mockResolvedValue({ jobId: 1, ticketId: 2, complaint: 'Issue' });
            Job.findByPk.mockResolvedValue({ client: { userId: 5, role: 'CLIENT' } });
            User.findAll.mockResolvedValue([{}]);
            Notifications.create.mockResolvedValue({});
            await NotificationController.sendResolveTicketNotificationToAdmin(1);
            expect(Notifications.create).not.toHaveBeenCalled();
        });
    });
});

describe('Notifications Model', () => {
    it('should have correct model definition', () => {
        expect(Notifications).toBeDefined();
        expect(Notifications.tableName).toBe('Notifications' || 'Notification');
    });
});
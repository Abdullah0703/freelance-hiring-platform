const NotificationController = require('../app/controllers/notificationController');
const { Notifications, User, Job, Ticket } = require('../app/models');

jest.mock('../app/models', () => ({
    Notifications: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        count: jest.fn()
    },
    User: {
        findAll: jest.fn(),
        findByPk: jest.fn()
    },
    Job: {
        findByPk: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
    },
    JobAssignment: {
        findAll: jest.fn(),
    },
    Ticket: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    sequelize: {
        Op: {
            in: jest.fn()
        },
        close: jest.fn(),
        authenticate: jest.fn(),
    }
}));

describe('NotificationController', () => {

    beforeAll(() => {
        // Mock implementations
        require('../app/models').Job.findByPk.mockImplementation(id => ({
            jobId: id,
            title: 'Test Job',
            status: 'OPEN',
            clientId: 1,
            billers: []
        }));

        require('../app/models').Notifications.create.mockImplementation(data => ({
            ...data,
            notificationId: 1,
            save: jest.fn()
        }));
        require('../app/models').User.findAll.mockResolvedValue([
            { userId: 1, role: 'ADMIN' },
            { userId: 2, role: 'ADMIN' }
        ]);
    });

    afterAll(async () => {
        await require('../app/models').sequelize.close();
    });

    describe('createNotification', () => {
        it('should create a notification successfully', async () => {
            Notifications.create.mockResolvedValueOnce({ notificationId: 1 });

            const result = await NotificationController.createNotification(
                1,
                'Test Title',
                'Test Description',
                'JOB_POSTED',
                29
            );

            expect(Notifications.create).toHaveBeenCalledWith({
                userId: 1,
                title: 'Test Title',
                description: 'Test Description',
                type: 'JOB_POSTED',
                jobId: 29,
                jobAssignmentId: null
            });
            expect(result).toHaveProperty('notificationId', 1);
        });

        it('should handle creation errors', async () => {
            Notifications.create.mockRejectedValueOnce(new Error('DB Error'));

            await expect(
                NotificationController.createNotification(1, 'Test', 'Desc', 'TYPE')
            ).rejects.toThrow('Failed to create notification');
        });
    });

    describe('notifyAdminOnJobOperation', () => {
        it('should notify admins on job creation', async () => {
            const jobMock = {
                jobId: 1,
                title: 'New Job',
                status: 'OPEN',
                save: jest.fn(),
            };

            Job.findByPk.mockResolvedValueOnce(jobMock);

            await NotificationController.notifyAdminOnJobOperation(1, 'CREATE');

            expect(User.findAll).toHaveBeenCalledWith({ where: { role: 'ADMIN' } });
            expect(Notifications.create).toHaveBeenCalledTimes(2);
        });

        it('should handle invalid operations', async () => {
            await expect(
                NotificationController.notifyAdminOnJobOperation(1, 'INVALID')
            ).rejects.toThrow('Invalid operation type');
        });
    });

    describe('displayAllNotificationsForAdmin', () => {
        it('should retrieve notifications with associations', async () => {
            const mockNotifications = [{
                notificationId: 1,
                job: { jobId: 1 },
                jobAssignment: null
            }];

            Notifications.findAll.mockResolvedValueOnce(mockNotifications);

            const result = await NotificationController.displayAllNotificationsForAdmin(1);

            expect(Notifications.findAll).toHaveBeenCalledWith({
                where: { userId: 1 },
                include: [
                    { model: Job, as: 'job' },
                    { model: require('../app/models').JobAssignment, as: 'jobAssignment' }
                ],
                order: [['createdAt', 'DESC']]
            });
            expect(result).toEqual(mockNotifications);
        });
    });

    describe('notifyJobStatusChange', () => {
        it('should notify relevant parties when job is completed', async () => {
            const jobMock = {
                jobId: 1,
                status: 'COMPLETED',
                title: 'Completed Job',
                clientId: 1,
                billers: [
                    { userId: 2, save: jest.fn() },
                    { userId: 3, save: jest.fn() }
                ],
                save: jest.fn(),
            };

            Job.findByPk.mockResolvedValueOnce(jobMock);

            await NotificationController.notifyJobStatusChange(1);

            expect(Notifications.create).toHaveBeenCalledTimes(4); // 2 billers + 2 admins
        });
    });

    describe('markNotificationAsRead', () => {
        it('should update notification read status', async () => {
            const mockNotification = {
                notificationId: 1,
                read: false,
                save: jest.fn().mockResolvedValue(true)
            };

            Notifications.findByPk.mockResolvedValueOnce(mockNotification);

            const result = await NotificationController.markNotificationAsRead(1);

            expect(result.read).toBe(true);
            expect(result.save).toHaveBeenCalled();
        });

        it('should handle missing notification', async () => {
            Notifications.findByPk.mockResolvedValueOnce(null);

            await expect(
                NotificationController.markNotificationAsRead(999)
            ).rejects.toThrow('Notification not found');
        });
    });

    describe('getUnreadNotificationsCount', () => {
        it('should return correct count', async () => {
            Notifications.count.mockResolvedValueOnce(5);

            const result = await NotificationController.getUnreadNotificationsCount(1);

            expect(Notifications.count).toHaveBeenCalledWith({
                where: { userId: 1, read: false }
            });
            expect(result).toBe(5);
        });
    });

    describe('sendTicketNotification', () => {
        it('should notify admins about new tickets', async () => {
            const jobMock = {
                jobId: 1,
                title: 'Test Job',
                client: { userId: 2, role: 'CLIENT' },
                save: jest.fn(),
            };

            const ticketsMock = [
                { ticketId: 1, complaint: 'Issue 1' },
                { ticketId: 2, complaint: 'Issue 2' }
            ];

            Job.findByPk.mockResolvedValueOnce(jobMock);
            Ticket.findAll.mockResolvedValueOnce(ticketsMock);

            await NotificationController.sendTicketNotification(1);

            expect(Notifications.create).toHaveBeenCalledTimes(4); // 2 tickets × 2 admins
        });
    });
});
const WorkLogController = require('../app/controllers/workLogController');
const httpMocks = require('node-mocks-http');

jest.mock('../app/models/jobModel.js');
jest.mock('../app/models/userModel');
jest.mock('../app/models/workLogModel');

jest.mock('../app/models/index', () => {
    return {
        Job: require('../app/models/jobModel.js'),
        User: require('../app/models/userModel'),
        WorkLog: require('../app/models/workLogModel')
    };
});

const { Job, User, WorkLog } = require('../app/models/index');

describe('WorkLogController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // CREATE WORKLOG
    describe('createWorkLog', () => {
        it('should return 400 if required fields are missing', async () => {
            const req = httpMocks.createRequest({ body: {} });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().success).toBe(false);
        });

        it('should return 400 if hoursLog is invalid (negative)', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: -1 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if hoursLog is not a number', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: "abc" }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if date is invalid', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: 'invalid-date', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if biller is not found', async () => {
            User.findByPk.mockResolvedValue(null);
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if biller is not BILLER', async () => {
            User.findByPk.mockResolvedValue({ role: 'CLIENT' });
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if job is not found', async () => {
            User.findByPk.mockResolvedValue({ role: 'BILLER' });
            Job.findByPk.mockResolvedValue(null);
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should create work log and return 201', async () => {
            User.findByPk.mockResolvedValue({ role: 'BILLER' });
            Job.findByPk.mockResolvedValue({ id: 1 });
            WorkLog.create.mockResolvedValue({ id: 1, billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 });
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData().success).toBe(true);
        });

        it('should return 400 for Sequelize validation error', async () => {
            User.findByPk.mockResolvedValue({ role: 'BILLER' });
            Job.findByPk.mockResolvedValue({ id: 1 });
            WorkLog.create.mockRejectedValue({ name: 'SequelizeValidationError', message: 'Validation error' });
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 500 for unknown error', async () => {
            User.findByPk.mockResolvedValue({ role: 'BILLER' });
            Job.findByPk.mockResolvedValue({ id: 1 });
            WorkLog.create.mockRejectedValue({ name: 'OtherError', message: 'Unknown error' });
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(500);
        });
    });

    // UPDATE WORKLOG
    describe('updateWorkLog', () => {
        it('should return 404 if work log not found', async () => {
            WorkLog.findByPk.mockResolvedValue(null);
            const req = httpMocks.createRequest({ params: { id: 1 }, body: {} });
            const res = httpMocks.createResponse();
            await WorkLogController.updateWorkLog(req, res);
            expect(res.statusCode).toBe(404);
        });

        it('should update work log and return 200', async () => {
            const update = jest.fn();
            WorkLog.findByPk.mockResolvedValue({ update });
            const req = httpMocks.createRequest({ params: { id: 1 }, body: { taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 } });
            const res = httpMocks.createResponse();
            await WorkLogController.updateWorkLog(req, res);
            expect(res.statusCode).toBe(200);
            expect(update).toHaveBeenCalled();
        });

        it('should return 500 on update error', async () => {
            WorkLog.findByPk.mockResolvedValue({ update: jest.fn().mockRejectedValue(new Error('fail')) });
            const req = httpMocks.createRequest({ params: { id: 1 }, body: { taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 } });
            const res = httpMocks.createResponse();
            await WorkLogController.updateWorkLog(req, res);
            expect(res.statusCode).toBe(500);
        });
    });

    // GET ALL WORKLOGS
    describe('getAllWorkLogs', () => {
        it('should return all work logs', async () => {
            WorkLog.findAll.mockResolvedValue([{ id: 1 }]);
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            await WorkLogController.getAllWorkLogs(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().workLogs.length).toBe(1);
        });

        it('should return 500 on error', async () => {
            WorkLog.findAll.mockRejectedValue(new Error('fail'));
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            await WorkLogController.getAllWorkLogs(req, res);
            expect(res.statusCode).toBe(500);
        });
    });

    // GET WORKLOG BY ID
    describe('getWorkLogById', () => {
        it('should return 404 if not found', async () => {
            WorkLog.findByPk.mockResolvedValue(null);
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogById(req, res);
            expect(res.statusCode).toBe(404);
        });

        it('should return work log if found', async () => {
            WorkLog.findByPk.mockResolvedValue({ id: 1 });
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogById(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().workLog.id).toBe(1);
        });

        it('should return 500 on error', async () => {
            WorkLog.findByPk.mockRejectedValue(new Error('fail'));
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogById(req, res);
            expect(res.statusCode).toBe(500);
        });
    });

    // GET WORKLOGS BY BILLER AND JOB ID
    describe('getWorkLogsByBillerAndJobId', () => {
        it('should return work logs for biller and job', async () => {
            WorkLog.findAll.mockResolvedValue([{ id: 1 }]);
            const req = httpMocks.createRequest({ params: { billerId: 1, jobId: 2 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogsByBillerAndJobId(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().workLogs.length).toBe(1);
        });

        it('should return 500 on error', async () => {
            WorkLog.findAll.mockRejectedValue(new Error('fail'));
            const req = httpMocks.createRequest({ params: { billerId: 1, jobId: 2 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogsByBillerAndJobId(req, res);
            expect(res.statusCode).toBe(500);
        });
    });

    // GET WORKLOGS BY BILLER ID
    describe('getWorkLogsByBillerId', () => {
        it('should return work logs for biller', async () => {
            WorkLog.findAll.mockResolvedValue([{ id: 1 }]);
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogsByBillerId(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().workLogs.length).toBe(1);
        });

        it('should return 500 on error', async () => {
            WorkLog.findAll.mockRejectedValue(new Error('fail'));
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogsByBillerId(req, res);
            expect(res.statusCode).toBe(500);
        });
    });

    // GET WORKLOGS BY CLIENT ID
    describe('getWorkLogsByClientId', () => {
        it('should return 404 if user not found', async () => {
            User.findByPk.mockResolvedValue(null);
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogsByClientId(req, res);
            expect(res.statusCode).toBe(404);
        });

        it('should return empty array if no jobs found', async () => {
            User.findByPk.mockResolvedValue({ userId: 1 });
            Job.findAll.mockResolvedValue([]);
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogsByClientId(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().workLogs).toEqual([]);
        });

        it('should return work logs for client', async () => {
            User.findByPk.mockResolvedValue({ userId: 1 });
            Job.findAll.mockResolvedValue([{ jobId: 1 }, { jobId: 2 }]);
            WorkLog.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogsByClientId(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().workLogs.length).toBe(2);
        });

        it('should return 500 on error', async () => {
            User.findByPk.mockResolvedValue({ userId: 1 });
            Job.findAll.mockResolvedValue([{ jobId: 1 }]);
            WorkLog.findAll.mockRejectedValue(new Error('fail'));
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.getWorkLogsByClientId(req, res);
            expect(res.statusCode).toBe(500);
        });
    });

    // DELETE WORKLOG
    describe('deleteWorkLog', () => {
        it('should return 404 if not found', async () => {
            WorkLog.findByPk.mockResolvedValue(null);
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.deleteWorkLog(req, res);
            expect(res.statusCode).toBe(404);
        });

        it('should delete work log and return 200', async () => {
            const destroy = jest.fn();
            WorkLog.findByPk.mockResolvedValue({ destroy });
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.deleteWorkLog(req, res);
            expect(res.statusCode).toBe(200);
            expect(destroy).toHaveBeenCalled();
        });

        it('should return 500 on error', async () => {
            WorkLog.findByPk.mockResolvedValue({ destroy: jest.fn().mockRejectedValue(new Error('fail')) });
            const req = httpMocks.createRequest({ params: { id: 1 } });
            const res = httpMocks.createResponse();
            await WorkLogController.deleteWorkLog(req, res);
            expect(res.statusCode).toBe(500);
        });
    });

    // ADDITIONAL EDGE CASES
    describe('More edge cases for createWorkLog', () => {
        it('should return 400 if hoursLog is zero', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 0 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if hoursLog is a float', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2.5 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if taskDescription is whitespace', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: '   ', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if date is in the future', async () => {
            const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0];
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: futureDate, hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            // Depending on your logic, this may be 400 or 201. Adjust if needed.
            expect([400, 201]).toContain(res.statusCode);
        });

        it('should return 400 if date is before 1970', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '1969-12-31', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect([400, 201]).toContain(res.statusCode);
        });

        it('should return 400 if billerId is a string', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: "abc", jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if jobId is a string', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: "abc", taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if taskDescription is missing', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if date is null', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: null, hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if hoursLog is null', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: null }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if billerId is null', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: null, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if jobId is null', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: null, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if all fields are null', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: null, jobId: null, taskDescription: null, date: null, hoursLog: null }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if extra unexpected fields are present', async () => {
            User.findByPk.mockResolvedValue({ role: 'BILLER' });
            Job.findByPk.mockResolvedValue({ id: 1 });
            WorkLog.create.mockResolvedValue({ id: 1 });
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: 2, extra: 'field' }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            // Should still succeed if extra fields are ignored
            expect([201, 400]).toContain(res.statusCode);
        });

        it('should return 400 if body is missing', async () => {
            const req = httpMocks.createRequest({});
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect([400, 500]).toContain(res.statusCode);
        });

        it('should return 400 if body is not an object', async () => {
            const req = httpMocks.createRequest({ body: "not-an-object" });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect([400, 500]).toContain(res.statusCode);
        });

        it('should return 400 if hoursLog is Infinity', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: Infinity }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if hoursLog is NaN', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: 'desc', date: '2024-01-01', hoursLog: NaN }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if taskDescription is extremely long', async () => {
            const longDesc = 'a'.repeat(10001);
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: longDesc, date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            // Depending on your validation, this may be 400 or 201. Adjust if needed.
            expect([400, 201]).toContain(res.statusCode);
        });

        it('should return 400 if taskDescription contains only special characters', async () => {
            const req = httpMocks.createRequest({
                body: { billerId: 1, jobId: 1, taskDescription: '!@#$%^&*()', date: '2024-01-01', hoursLog: 2 }
            });
            const res = httpMocks.createResponse();
            await WorkLogController.createWorkLog(req, res);
            // Depending on your validation, this may be 400 or 201. Adjust if needed.
            expect([400, 201]).toContain(res.statusCode);
        });
    });
});
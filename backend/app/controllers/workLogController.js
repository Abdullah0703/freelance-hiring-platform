'use strict';

const Job = require('../models/jobModel');
const User = require('../models/userModel');
const WorkLog = require('../models/workLogModel');

class WorkLogController {
  static async createWorkLog(req, res) {
    try {
      const { billerId, date, jobId, taskDescription, hoursLog } = req.body;

      const workLog = await WorkLog.create({
        billerId,
        jobId,
        taskDescription,
        date,
        hoursLog
      });
      console.log("worklog data from controller:", workLog);
      console.log("request body from controller", req.body);
      return res.status(201).json({ success: true, workLog });
    } catch (error) {
      console.error('Error creating work log:', error);
      return res.status(500).json({ success: false, message: 'Failed to create work log', error: error.message });
    }
  }

  static async updateWorkLog(req, res) {
    try {
      const workLogId = req.params.id;
      const { taskDescription, date, hoursLog, billerId, jobId } = req.body;

      const workLog = await WorkLog.findByPk(workLogId);

      if (!workLog) {
        return res.status(404).json({ success: false, message: 'Work log not found' });
      }

      await workLog.update({ taskDescription, date, hoursLog, billerId, jobId });

      return res.status(200).json({ success: true, message: 'Work log updated successfully', workLog });
    } catch (error) {
      console.error('Error updating work log:', error);
      return res.status(500).json({ success: false, message: 'Failed to update work log', error: error.message });
    }
  }

  static async getAllWorkLogs(req, res) {
    try {
      const workLogs = await WorkLog.findAll({
        include: [User, Job] // Include associated user and job data (optional)
      });

      return res.status(200).json({ success: true, workLogs });
    } catch (error) {
      console.error('Error retrieving all work logs:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve all work logs', error: error.message });
    }
  }

  static async getWorkLogById(req, res) {
    try {
      const workLogId = req.params.id;
      const workLog = await WorkLog.findByPk(workLogId, {
        include: [User, Job] // Include associated user and job data (optional)
      });

      if (!workLog) {
        return res.status(404).json({ success: false, message: 'Work log not found' });
      }

      return res.status(200).json({ success: true, workLog });
    } catch (error) {
      console.error('Error retrieving work log by ID:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve work log by ID', error: error.message });
    }
  }

  static async getWorkLogsByBillerAndJobId(req, res) {
    try {
      const { billerId, jobId } = req.params;
      const workLogs = await WorkLog.findAll({
        where: {
          billerId,
          jobId
        }
      });

      return res.status(200).json({ success: true, workLogs });
    } catch (error) {
      console.error('Error fetching work logs:', error);
      return res.status(500).json({ success: false, message: 'Error fetching work logs', error: error.message });
    }
  }

  static async getWorkLogsByBillerId(req, res) {
    try {
      const billerId = req.params.id;
      const workLogs = await WorkLog.findAll({
        where: {
          billerId
        }
      });

      return res.status(200).json({ success: true, workLogs });
    } catch (error) {
      console.error('Error fetching work logs:', error);
      return res.status(500).json({ success: false, message: 'Error fetching work logs', error: error.message });
    }
  }

  static async getWorkLogsByClientId(req, res) {
    try {
      const userId = req.params.id;
      // 1. Check if the user exists
      const user = await User.findByPk(userId);
      console.log("client Id in worklog controller: ", userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      // 2. Get job IDs posted by the user
      const jobs = await Job.findAll({
        where: {
          clientId: userId
        }
      });
      console.log("Jobs found in worklog controller for the client:", jobs);
      // Extract job IDs
      const jobIds = jobs.map(job => job.jobId);
      console.log("job Ids fetched for worklog in worklog controller:", jobIds)
      if (jobIds.length === 0) {
        return res.status(200).json({ success: true, workLogs: [] });
      }
      // 3. Fetch work logs associated with the job IDs
      const workLogs = await WorkLog.findAll({
        where: {
          jobId: jobIds
        }
      });
      console.log("finally getting the worklog for the clent ID: ",workLogs);
      return res.status(200).json({ success: true, workLogs });
    } catch (error) {
      console.error('Error fetching work logs:', error);
      return res.status(500).json({ success: false, message: 'Error fetching work logs', error: error.message });
    }
  }


  static async deleteWorkLog(req, res) {
    try {
      const workLogId = req.params.id;
      const workLog = await WorkLog.findByPk(workLogId);

      if (!workLog) {
        return res.status(404).json({ success: false, message: 'Work log not found' });
      }

      await workLog.destroy();

      return res.status(200).json({ success: true, message: 'Work log deleted successfully' });
    } catch (error) {
      console.error('Error deleting work log:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete work log', error: error.message });
    }
  }
}

module.exports = WorkLogController;

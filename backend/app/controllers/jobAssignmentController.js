'use strict';

const JobAssignment = require('../models/jobAssignmentModel');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const { jobAssignmentNotification } = require('../../emailTemplates');
const { SendEmailAsync, SendEmail } = require('../../sendEmail');
class JobAssignmentController {
  static async createJobAssignment(req, res) {
    try {
      const { billerId, jobId } = req.body;
      // Fetch the job details by ID
      const job = await Job.findByPk(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      // Fetch the biller's details by ID
      const biller = await User.findByPk(billerId);
      if (!biller) {
        return res.status(404).json({ success: false, message: 'Biller not found' });
      }

      const jobAssignment = await JobAssignment.create({ billerId, jobId });
      const recipientEmail = 'zack8001@gmail.com';
      const subject = `Job Assignment` ;
      const body = jobAssignmentNotification(
        job.title,
        job.description,
        biller.userName,
        job.paymentTerms,
        new Date()
      );
      await SendEmailAsync(recipientEmail, subject, body)
      return res.status(201).json({ success: true, jobAssignment });
    } catch (error) {
      console.error('Error creating job assignment:', error);
      return res.status(500).json({ success: false, message: 'Failed to create job assignment', error: error.message });
    }
  }

  static async getAllJobAssignments(req, res) {
    try {
      const jobAssignments = await JobAssignment.findAll({});
      return res.status(200).json({ success: true, jobAssignments });
    } catch (error) {
      console.error('Error retrieving all job assignments:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve all job assignments', error: error.message });
    }
  }

  static async getJobAssignmentById(req, res) {
    try {
      const jobAssignmentId = req.params.id;
      const jobAssignment = await JobAssignment.findByPk(jobAssignmentId);

      if (!jobAssignment) {
        return res.status(404).json({ success: false, message: 'Job assignment not found' });
      }
      return res.status(200).json({ success: true, jobAssignment });
    } catch (error) {
      console.error('Error retrieving job assignment by ID:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve job assignment by ID', error: error.message });
    }
  }

  static async updateJobAssignment(req, res) {
    try {
      const { billerId, jobId } = req.body;

      const jobAssignment = await JobAssignment.findByPk(req.params.id);

      if (!jobAssignment) {
        return res.status(404).json({ success: false, message: 'Job assignment not found' });
      }

      const updatedJobAssignment = await jobAssignment.update({
        jobId,
        billerId
      });

      return res.status(200).json({ success: true, message: 'Job assignment updated successfully', updatedJobAssignment });
    } catch (error) {
      console.error('Error updating job assignment details:', error);
      return res.status(500).json({ success: false, message: 'Failed to update job assignment details', error: error.message });
    }
  }

  static async deleteJobAssignment(req, res) {
    try {
      const jobAssignmentId = req.params.id;
      const jobAssignment = await JobAssignment.findByPk(jobAssignmentId);

      if (!jobAssignment) {
        return res.status(404).json({ success: false, message: 'Job assignment not found' });
      }

      await jobAssignment.destroy();

      return res.status(200).json({ success: true, message: 'Job assignment deleted successfully' });
    } catch (error) {
      console.error('Error deleting job assignment:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete job assignment', error: error.message });
    }
  }
}

module.exports = JobAssignmentController;

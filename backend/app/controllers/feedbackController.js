'use strict';

const Feedback = require('../models/feedbackModel');
class feedbackController {
    static async createFeedback(req, res) {
      try {
        const { feedbackText, rating, clientId, billerId, jobId } = req.body;
  
        const feedback = await Feedback.create({ feedbackText, rating, clientId, billerId, jobId });
  
        return res.status(201).json({ success: true, feedback });
      } catch (error) {
        console.error('Error creating feedback:', error);
        return res.status(500).json({ success: false, message: 'Failed to create feedback', error: error.message });
      }
    }

    static async updateFeedback(req, res) {
        try {
          const feedback = await Feedback.findByPk(req.params.id);
    
          if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
          }
    
          await feedback.update(req.body);
    
          return res.status(200).json({ success: true, message: 'Feedback updated successfully' });
        } catch (error) {
          console.error('Error updating feedback:', error);
          return res.status(500).json({ success: false, message: 'Failed to update feedback', error: error.message });
        }
      }
  
    static async getAllFeedbacks(req, res) {
      try {
        const feedbacks = await Feedback.findAll();
        return res.status(200).json({ success: true, feedbacks });
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch feedbacks', error: error.message });
      }
    }
  
    static async getFeedbackById(req, res) {
      try {
        const feedback = await Feedback.findByPk(req.params.id);
  
        if (!feedback) {
          return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
  
        return res.status(200).json({ success: true, feedback });
      } catch (error) {
        console.error('Error fetching feedback:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch feedback', error: error.message });
      }
    }

    static async getByClientAndJobID(req, res) {
        try {
          const { clientId, jobId } = req.params;
          const feedbacks = await Feedback.findAll({ where: { clientId, jobId } });
          return res.status(200).json({ success: true, feedbacks });
        } catch (error) {
          console.error('Error fetching feedbacks by client and job ID:', error);
          return res.status(500).json({ success: false, message: 'Failed to fetch feedbacks', error: error.message });
        }
      }
    
      static async getByBillerAndJobID(req, res) {
        try {
          const { billerId, jobId } = req.params;
          const feedbacks = await Feedback.findAll({ where: { billerId, jobId } });
          return res.status(200).json({ success: true, feedbacks });
        } catch (error) {
          console.error('Error fetching feedbacks by biller and job ID:', error);
          return res.status(500).json({ success: false, message: 'Failed to fetch feedbacks', error: error.message });
        }
      }
    
      static async getByBillerId(req, res) {
        try {
          const { billerId } = req.params;
          const feedbacks = await Feedback.findAll({ where: { billerId } });
          return res.status(200).json({ success: true, feedbacks });
        } catch (error) {
          console.error('Error fetching feedbacks by biller ID:', error);
          return res.status(500).json({ success: false, message: 'Failed to fetch feedbacks', error: error.message });
        }
      }
    
      static async getByJobId(req, res) {
        try {
          const { jobId } = req.params;
          const feedbacks = await Feedback.findAll({ where: { jobId } });
          return res.status(200).json({ success: true, feedbacks });
        } catch (error) {
          console.error('Error fetching feedbacks by job ID:', error);
          return res.status(500).json({ success: false, message: 'Failed to fetch feedbacks', error: error.message });
        }
      }
    
      static async getByClientId(req, res) {
        try {
          const { clientId } = req.params;
          const feedbacks = await Feedback.findAll({ where: { clientId } });
          return res.status(200).json({ success: true, feedbacks });
        } catch (error) {
          console.error('Error fetching feedbacks by client ID:', error);
          return res.status(500).json({ success: false, message: 'Failed to fetch feedbacks', error: error.message });
        }
      }
  
    static async deleteFeedback(req, res) {
      try {
        const feedback = await Feedback.findByPk(req.params.id);
  
        if (!feedback) {
          return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
  
        await feedback.destroy();
  
        return res.status(204).send();
      } catch (error) {
        console.error('Error deleting feedback:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete feedback', error: error.message });
      }
    }
  }
  
  module.exports = feedbackController;
  
'use strict';

const Ticket = require('../models/TicketModel');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const NotificationController = require('./notificationController');
class TicketController {
  static async createTicket(req, res) {
    const { jobId, complaint } = req.body;

    try {
      // Validate request data
      if (!jobId || !complaint) {
        return res.status(400).json({ success: false, message: 'Job ID and complaint are required' });
      }

      // Check if the job exists
      const job = await Job.findByPk(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      // Create a new ticket
      const newTicket = await Ticket.create({
        jobId,
        complaint,
        markAsRead: false,
        actionByAdmin: 'pending',
        actionByClient: 'pending'
      });
      console.log("Sending support ticket Notification");
      await NotificationController.sendTicketNotification(job.jobId);
      return res.status(201).json({ success: true, ticket: newTicket });
    } catch (error) {
      console.error('Error creating ticket:', error);
      return res.status(500).json({ success: false, message: 'Failed to create ticket', error: error.message });
    }
  }


  static async getAllTickets(req, res) {
    try {
      // Fetch all tickets with job and user details
      const tickets = await Ticket.findAll({
        include: [
          {
            model: Job,
            attributes: ['title', 'description', 'clientId'], // Include clientId to join with User
            include: [
              {
                model: User,
                attributes: ['userName'], // Fetch the client's name
                as: 'client' // Alias for the client relationship
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        paranoid: false
      });

      // Calculate ticket statistics
      const raisedTickets = tickets.length;
      const resolvedTickets = tickets.filter(ticket =>
        ticket.actionByAdmin === 'resolved' && ticket.actionByClient === 'resolved'
      ).length;
      const unresolvedTickets = raisedTickets - resolvedTickets;

      // Format the tickets to include client names
      const formattedTickets = tickets.map(ticket => ({
        ...ticket,
        clientName: ticket['Job.client.userName'] // Access the nested client name
      }));

      return res.status(200).json({
        success: true,
        tickets: formattedTickets,
        raisedTickets,
        resolvedTickets,
        unresolvedTickets
      });
    } catch (error) {
      console.error('Error retrieving all tickets:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve tickets',
        error: error.message
      });
    }
  }


  static async getClientTickets(req, res) {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ success: false, message: 'Client ID is required' });
    }

    try {
      const tickets = await Ticket.findAll({
        include: [
          {
            model: Job,
            attributes: ['title', 'description'],
            where: { clientId }
          }
        ],
        raw: true
      });

      return res.status(200).json({ success: true, tickets });
    } catch (error) {
      console.error('Error retrieving tickets for client:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve tickets', error: error.message });
    }
  }
  static async markResolvedByAdmin(req, res) {
    const { ticketId } = req.params;

    try {

      const ticket = await Ticket.findByPk(ticketId);

      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }


      ticket.actionByAdmin = 'resolved';
      await ticket.save();
      await NotificationController.sendResolveTicketNotificationToClient(ticket.ticketId);
      return res.status(200).json({ success: true, message: 'Ticket marked as resolved by admin', ticket });
    } catch (error) {
      console.error('Error marking ticket as resolved by admin:', error);
      return res.status(500).json({ success: false, message: 'Failed to mark ticket as resolved by admin', error: error.message });
    }
  }

  // Mark a ticket as resolved by client
  static async markResolvedByClient(req, res) {
    const { ticketId } = req.params;

    try {
      // Find the ticket
      const ticket = await Ticket.findByPk(ticketId);

      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }



      ticket.actionByClient = 'resolved';
      await ticket.save();
      await NotificationController.sendResolveTicketNotificationToAdmin(ticket.ticketId);
      return res.status(200).json({ success: true, message: 'Ticket marked as resolved by client', ticket });
    } catch (error) {
      console.error('Error marking ticket as resolved by client:', error);
      return res.status(500).json({ success: false, message: 'Failed to mark ticket as resolved by client', error: error.message });
    }
  }
  static async editTicket(req, res) {
    const { ticketId } = req.params; // Get ticketId from request parameters
    const { complaint, actionByAdmin, actionByClient } = req.body; // Get new complaint and status from request body

    try {
      // Validate input data
      if (!ticketId) {
        return res.status(400).json({ success: false, message: 'Ticket ID is required' });
      }

      // Find the ticket by ID
      const ticket = await Ticket.findByPk(ticketId);

      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }

      // Update ticket details
      if (complaint) {
        ticket.complaint = complaint; // Update complaint if provided
      }

      if (actionByAdmin) {
        ticket.actionByAdmin = actionByAdmin; // Update admin action if provided
      }

      if (actionByClient) {
        ticket.actionByClient = actionByClient; // Update client action if provided
      }
      await NotificationController.sendEditTicketNotification(ticket.ticketId);
      await ticket.save(); // Save updated ticket

      return res.status(200).json({ success: true, message: 'Ticket updated successfully', ticket });
    } catch (error) {
      console.error('Error editing ticket:', error);
      return res.status(500).json({ success: false, message: 'Failed to edit ticket', error: error.message });
    }
  }

  static async deleteTicket(req, res) {
    const { ticketId } = req.params;

    try {
      const ticket = await Ticket.findByPk(ticketId);

      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }
      // Delete the ticket

      await NotificationController.sendDeleteTicketNotification(ticket.ticketId);
      await ticket.destroy();
      return res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete ticket', error: error.message });
    }
  }
}

module.exports = TicketController;

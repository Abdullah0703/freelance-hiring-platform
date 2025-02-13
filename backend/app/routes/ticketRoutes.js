const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController'); // Adjust the path as needed

// Route to get all tickets (admin only)
router.get('/', TicketController.getAllTickets);

// Route to get tickets by client ID
router.get('/:clientId', TicketController.getClientTickets);

// Route to create a new ticket
router.post('/', TicketController.createTicket);

// Route to mark a ticket as resolved by admin
router.patch('/:ticketId/resolvebyAdmin', TicketController.markResolvedByAdmin);

// Route to mark a ticket as resolved by client
router.patch('/:ticketId/resolvebyClient', TicketController.markResolvedByClient);
router.patch('/:ticketId/edit', TicketController.editTicket);
router.delete('/:ticketId', TicketController.deleteTicket);

module.exports = router;

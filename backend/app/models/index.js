// models/index.js
const sequelize = require('../config/database');
const User = require('./userModel');
const Job = require('./jobModel');
const Notifications = require('./notificationModel');
const JobAssignment = require('./jobAssignmentModel');
const Ticket = require('./TicketModel');


module.exports = {
    sequelize,
    User,
    Job,
    Notifications,
    JobAssignment,
    Ticket
};
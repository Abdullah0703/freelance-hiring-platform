// models/index.js
const sequelize = require('../../config/dbConfig');
const User = require('./userModel');
const Job = require('./jobModel');
const Notifications = require('./notificationModel');
const JobAssignment = require('./jobAssignmentModel');
const Ticket = require('./TicketModel');
const WorkLog = require('./workLogModel');

// Add all associations here:
Job.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
User.hasMany(Job, { foreignKey: 'clientId', as: 'postings' });

WorkLog.belongsTo(User, { foreignKey: 'billerId', allowNull: false });
User.hasMany(WorkLog, { foreignKey: 'billerId' });

WorkLog.belongsTo(Job, { foreignKey: 'jobId', allowNull: false });
Job.hasMany(WorkLog, { foreignKey: 'jobId' });

Job.belongsToMany(User, { through: JobAssignment, foreignKey: 'jobId', as: 'billers' });
User.belongsToMany(Job, { through: JobAssignment, foreignKey: 'billerId', as: 'assignedJobs' });

JobAssignment.belongsTo(Job, { foreignKey: 'jobId' });
JobAssignment.belongsTo(User, { foreignKey: 'billerId' });

// If you have beforeCreate hooks, you can add them here as well:
Job.beforeCreate(async (job) => {
  const user = await User.findByPk(job.clientId);
  if (!user || user.role !== 'CLIENT') {
    throw new Error('Only clients can create jobs');
  }
});

WorkLog.beforeCreate(async (workLog) => {
  const user = await User.findByPk(workLog.billerId);
  if (!user || user.role !== 'BILLER') {
    throw new Error('Only Billers add workLogs');
  }
});

Job.hasMany(Ticket, { foreignKey: 'jobId' });
Ticket.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = {
    sequelize,
    User,
    Job,
    Notifications,
    JobAssignment,
    Ticket,
    WorkLog
};
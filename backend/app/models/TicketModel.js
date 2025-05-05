'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const Job = require('./jobModel');

const Ticket = db.define('Ticket', {
  ticketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: 'jobId',
    }
  },
  complaint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  markAsRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
  actionByAdmin: {
    type: DataTypes.ENUM,
    values: ['pending', 'resolved'],
    defaultValue: 'pending',
  },
  actionByClient: {
    type: DataTypes.ENUM,
    values: ['pending', 'resolved'],
    defaultValue: 'pending',
  }
}, {
  timestamps: true, 
  paranoid: true
});

// REMOVE these lines from here:
// Job.hasMany(Ticket, { foreignKey: 'jobId' });
// Ticket.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = Ticket;

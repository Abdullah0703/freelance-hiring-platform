'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');

const Notifications = db.define('Notification', {
  notificationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM,
    values: [
      'JOB_POSTED', 
      'AWAITING_CONFIRMATION', 
      'INITIAL_MEETING_SCHEDULED', 
      'SEARCHING_CANDIDATE',
      'INTERVIEW_SCHEDULED',
      'FINALIZED',
      'ABORTED',
      'COMPLETED',
      'JOB_DELETED',
      "TICKET"
    ],
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  jobAssignmentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  deletedAt: { 
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  paranoid: true
});

module.exports = Notifications;

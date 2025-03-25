'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const User = require('./userModel');
const Job = require('./jobModel');
const JobAssignment = require('./jobAssignmentModel');

const Notifications = db.define('Notification', {
  notificationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(50),
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
    allowNull: false,
    references: {
      model: User,
      key: 'userId'
    }
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Job,
      key: 'jobId'
    }
  },
  jobAssignmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: JobAssignment,
      key: 'jobAssignmentId'
    }
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

// Associations
Notifications.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notifications.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Notifications.belongsTo(JobAssignment, { foreignKey: 'jobAssignmentId', as: 'jobAssignment' });

module.exports = Notifications;

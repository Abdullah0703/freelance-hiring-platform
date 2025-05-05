'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');

const JobAssignment = db.define('JobAssignment', {
  jobAssignmentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  jobId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Jobs', // Use string to avoid circular dependency
      key: 'jobId'
    },
  },
  billerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // Use string to avoid circular dependency
      key: 'userId'
    }
    // Remove validation here, handle in hooks or controller
  },
}, {
  timestamps: true
});

// Remove all association code from here

module.exports = JobAssignment;

'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const User = require('./userModel');
const Job = require('./jobModel');

const Feedback = db.define('Feedback', {
  feedbackId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  feedbackText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true
});

Feedback.belongsTo(User, { as: 'Client', foreignKey: 'clientId' });
User.hasMany(Feedback, { as: 'ClientFeedbacks', foreignKey: 'clientId' });

Feedback.belongsTo(User, { as: 'Biller', foreignKey: 'billerId' });
User.hasMany(Feedback, { as: 'BillerFeedbacks', foreignKey: 'billerId' });

Feedback.belongsTo(Job, { foreignKey: 'jobId' });
Job.hasMany(Feedback, { foreignKey: 'jobId' });

module.exports = Feedback;

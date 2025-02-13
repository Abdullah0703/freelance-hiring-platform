'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const User = require('./userModel');

const Job = db.define('Job', {
  jobId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meetingTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  duration: {
    type: DataTypes.ENUM,
    values: ['TEMPORARY', 'PERMANENT']
  },
  status: {
    type: DataTypes.ENUM,
    values: ['AWAITING_CONFIRMATION', 'INITIAL_MEETING_SCHEDULED', 'SEARCHING_CANDIDATE',
      'INTERVIEW_SCHEDULED', 'FINALIZED', 'ABORTED', 'COMPLETED'],
    defaultValue: "AWAITING_CONFIRMATION",
  },
  paymentTerms: {
    type: DataTypes.ENUM,
    values: ['HOURLY', 'FIXED_PRICE']
  },
  recommendedProfiles: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      notEmpty: true
    }
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false, 
    validate: {
      notEmpty: true,
      isDecimal: true 
    }
  }
}, {
  timestamps: true,
  paranoid: true
});

Job.belongsTo(User, { foreignKey: 'clientId', as: 'client' })
User.hasMany(Job, { foreignKey: 'clientId', as: 'postings' });

Job.beforeCreate(async (job) => {
  console.log("user: ", job);
  const user = await User.findByPk(job.clientId);
  if (!user || user.role !== 'CLIENT') {
    console.log("clientId: ", user)
    throw new Error('Only clients can create jobs');
  }
});


module.exports = Job;
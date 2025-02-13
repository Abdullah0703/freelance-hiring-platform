'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const User = require('./userModel');
const Job = require('./jobModel');

const WorkLog = db.define('WorkLog', {
  workLogId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  taskDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: true,
      notEmpty: true
    }
  },
  hoursLog: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: true
});

WorkLog.belongsTo(User, { foreignKey: 'billerId', allowNull: false })
User.hasMany(WorkLog, { foreignKey: 'billerId' })

WorkLog.belongsTo(Job, { foreignKey: 'jobId', allowNull: false })
Job.hasMany(WorkLog, { foreignKey: 'jobId' })

WorkLog.beforeCreate(async (workLog) => {
  const user = await User.findByPk(workLog.billerId);
  console.log("user: ", user)
  console.log("user: ", user)
  if (!user || user.role !== 'BILLER') {
    throw new Error('Only Billers add workLogs');
  }
});


module.exports = WorkLog;
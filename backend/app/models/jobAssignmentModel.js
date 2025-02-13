'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const User = require('./userModel');
const Job = require('./jobModel'); 

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
      model: Job,
      key : 'jobId'
    },
  },
  billerId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, 
      key : 'userId'
    },
    validate: {
      async isBiller(value) {
        const user = await User.findByPk(value);
        const isBiller = user && user.role === 'BILLER';
        if (!isBiller) {
          throw new Error('Only billers can be assigned jobs');
        }
      },
    },
  },
}, {
  timestamps: true
});

Job.belongsToMany(User, { through: JobAssignment, foreignKey: 'jobId', as: 'billers' })
User.belongsToMany(Job, { through: JobAssignment, foreignKey: 'billerId', as: 'assignedJobs' })

JobAssignment.belongsTo(Job, { foreignKey: 'jobId' });  
JobAssignment.belongsTo(User, { foreignKey: 'billerId' });

module.exports = JobAssignment;

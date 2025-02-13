// settingsModel.js

'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const Branch = require('./branchModel');

const Settings = db.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stampName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  logoName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'settings'
});

Settings.belongsTo(Branch, { foreignKey: 'branchId' });

module.exports = Settings;

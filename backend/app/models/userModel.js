'use strict';

const { DataTypes } = require('sequelize');
const db = require('../../config/dbConfig');
const bcrypt = require('bcrypt');

const User = db.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      async isUniqueIfNotDeleted(value) {
        const existingUser = await User.findOne({
          where: {
            userName: value
          }
        });
        if (existingUser && existingUser.userId !== this.userId) {
          throw new Error('user name must be unique');
        }
      },
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    set(value) {
      // Hashing the password before storing it
      const hashedPassword = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hashedPassword);
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      // isPhoneNumber(value) {
      //   if (!/^[0-9]{11}$|^\+92[0-9]{10}$/.test(value)) {
      //     throw new Error(
      //       'Please provide a valid phone number or leave it empty.\nPhone number should be 11 digits without spaces or special characters, or 13 digits if starting with +.'
      //     );
      //   }
      // },
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.ENUM,
    values: ['ADMIN', 'BILLER', 'CLIENT']
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      customValidator(value) {
        console.log("value: ", value, "role: ", this.role)
        if (value == null && this.role == 'BILLER') {
          throw new Error("Billers must have skills!");
        }
      },
    }
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true 
  }
}, {
  timestamps: true,
  paranoid: true
});

module.exports = User;

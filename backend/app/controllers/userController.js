'use strict';

const User = require('../models/userModel');
// const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const db = require('../../config/dbConfig');
const JobsAssigned=require('../models/jobAssignmentModel')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Job = require('../models/jobModel')
const UserMongoose = require('../models/userMongooseModel');

const chatController = require('../controllers/chatController')



const storeProfilePicture = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = 'uploads/profile';
    console.log("Profile function working")
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
  }
});


const uploadProfilePicture = multer({
  storage: storeProfilePicture,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('profile');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only (JPEG/JPG/PNG)');
  }
}

class UserController {
  static async createUser(userData) {
    try {

      if (!userData.password) {
        throw new Error('Password cannot be empty');
      }

      // Hash the password
      // const hashedPassword = await bcrypt.hash(userData.password, 10);
      // userData.password = hashedPassword;

      // Create the user in MySQL database
      const user = await User.create(userData);

      // // Create user in MongoDB
      // const mongoUser = new UserMongoose({
      //   _id: user.userId,
      //   email: user.email,
      //   username: user.userName,
      //   name: user.fname
      //   // Add other fields as needed
      // });
      // // await mongoUser.save();

      // // Fetch all existing user IDs
      // const existingUsers = await User.findAll({
      //   attributes: ['userId']
      // });

      // // Add each existing user as a contact for the new user
      // for (const existingUser of existingUsers) {
      //   // Skip adding the new user as a contact for themselves
      //   if (existingUser.userId !== user.userId) {
      //     await chatController.addContacts({ userId: existingUser.userId, contactId: user.userId });
      //     await chatController.addContacts({ userId: user.userId, contactId: existingUser.userId });
      //   }
      // }



      return user;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const errorMessage = error.errors[0].message; // Access the first error message
        console.error('Error creating user:', errorMessage);
        throw new Error('Email address already exists. Please choose a different email.');
      } else {
        console.error('Error creating user:', error);
        throw error;
      }
    }
  }

  static async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('User not found.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Incorrect password.');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();

      return res.status(200).json({ success: true, users });
    } catch (error) {
      console.error('Error retrieving users:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
    }
  }

  static async getAllAdmins(req, res) {
    try {
      const clients = await User.findAll({
        where: {
          role: "ADMIN"
        },
      });

      return res.status(200).json({ success: true, clients });
    } catch (error) {
      console.error('Error retrieving users:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve clients', error: error.message });
    }
  }

  static async getAllClients(req, res) {
    try {
        const clients = await User.findAll({
            where: {
                role: "CLIENT"
            },
        });

        for (const client of clients) {
            const clientId = client.userId;

            const totalPostedJobsCount = await Job.count({
                where: { clientId }
            });

            const activeJobsCount = await JobsAssigned.count({
              include: [{
                  model: Job,
                  where: {
                      clientId
                  },
                  attributes: []
              }],
              distinct: true,
              col: 'jobId' 
          });

            client.setDataValue('totalPostedJobsCount', totalPostedJobsCount);
            client.setDataValue('activeJobsCount', activeJobsCount);
        }

        return res.status(200).json({ success: true, clients });
    } catch (error) {
        console.error('Error retrieving clients:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve clients', error: error.message });
    }
}

  
  static async getAllBillers(req, res) {
    try {
      const billers = await User.findAll({
        where: {
          role: "BILLER"
        },
      });

      return res.status(200).json({ success: true, billers });
    } catch (error) {
      console.error('Error retrieving users:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve billers', error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error('Error retrieving user:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve user', error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { userName, address, email, skills, password, phoneNumber, role } = req.body;
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // let hashedPassword;
      // if (password) {
      //   hashedPassword = await bcrypt.hash(password, 10);
      // }

      await user.update({ userName, address, email, skills, password, phoneNumber, role });

      return res.status(200).json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      await user.destroy();

      return res.status(200).json({ success: true, message: 'User soft deleted successfully' });
    } catch (error) {
      console.error('Error soft deleting user:', error);
      return res.status(500).json({ success: false, message: 'Failed to soft delete User', error: error.message });
    }
  }

  static async uploadProfilePictureUser(req, res) {
    try {
      uploadProfilePicture(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ success: false, message: err });
        } else {
          const userId = req.params.id; // Get userId from route parameter
          const profilePicture = req.file ? req.file.filename : null;

          const user = await User.findByPk(userId);
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          // Update profile picture for existing user
          if (user.profilePicture) {
            // Delete existing profile picture if it exists
            fs.unlink(`./uploads/profile/${user.profilePicture}`, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
              }
            });
            await user.update({ profilePicture });

          } else {

            await user.update({ profilePicture });
          }

          return res.status(201).json({ success: true, message: 'Profile picture added successfully', user });
        }
      });
    } catch (error) {
      console.error('Error adding profile picture:', error);
      return res.status(500).json({ success: false, message: 'Failed to add profile picture', error: error.message });
    }
  }
}

module.exports = UserController;
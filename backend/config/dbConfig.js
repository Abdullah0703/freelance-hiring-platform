'use strict';
require('dotenv').config();

const { Sequelize } = require('sequelize');
const winston = require('winston');
const fs = require('fs');


const logFileName = 'sequelize.log';
const meetingTime = new Date('2024-08-22T09:00:00Z').toLocaleTimeString('en-GB', { hour12: false });
// Create the log file if it doesn't exist
if (!fs.existsSync(logFileName)) {
  fs.writeFileSync(logFileName, '', 'utf-8');
}

// Create a logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: logFileName })
  ]
});
// console.log('DB_USER:', process.env.DB_USER, 'DB_PASS:', process.env.DB_PASS, 'DB_NAME:', process.env.DB_NAME);
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST||'localhost',
  port: process.env.DB_PORT||3306,
  username: process.env.DB_USER||'root',
  password: process.env.DB_PASS||'root',
  database: process.env.DB_NAME||'sysartx',
  // logging: (msg) => logger.info(msg)
  logging: console.log
  // logging: (...msg) => console.log(msg)
});

// (async () => {
//   try {
//     await sequelize.sync({ force: false });
//     // await sequelize.sync({ alter: true });
//     console.log('Tables available successfully');
//     const Job = require('../app/models/jobModel');
//     const User = require('../app/models/userModel');
//     // await User.bulkCreate([
//     //   {
//     //     userName: 'Admin',
//     //     address: 'Admin Home',
//     //     email: 'admin@gmail.com',
//     //     password: 'admin',
//     //     phoneNumber: '03232011204',
//     //     role: 'ADMIN',
//     //     skills: '',
//     //   },
//     //   {
//     //     userName: 'Biller',
//     //     address: 'biller Home',
//     //     email: 'biller@gmail.com',
//     //     password: 'biller',
//     //     phoneNumber: '03232011204',
//     //     role: 'BILLER',
//     //     skills: 'Java',
//     //   },
//     //   {
//     //     userName: 'Biller2',
//     //     address: 'biller2 Home',
//     //     email: 'biller2@gmail.com',
//     //     password: 'biller2',
//     //     phoneNumber: '03232011204',
//     //     role: 'BILLER',
//     //     skills: 'MERN',
//     //   },
//     //   {
//     //     userName: 'Client',
//     //     address: 'client Home',
//     //     email: 'client@gmail.com',
//     //     password: 'client',
//     //     phoneNumber: '03232011204',
//     //     role: 'CLIENT',
//     //     skills: 'Java',
//     //   },
//     //   {
//     //     userName: 'Client2',
//     //     address: 'client2 Home',
//     //     email: 'client2@gmail.com',
//     //     password: 'client2',
//     //     phoneNumber: '03232011204',
//     //     role: 'CLIENT',
//     //     skills: 'MERN',
//     //   },
//     // ]);
//     // await Job.bulkCreate([
//     //   {
//     //     jobId:1,
//     //     title: "Frontend Developer",
//     //     description: "Developing user-facing features using React.js",
//     //     skills: "JavaScript, React.js, HTML, CSS",
//     //     meetingLink: "https://example.com/meet1",
//     //     // meetingTime:meetingTime,
//     //     duration: "TEMPORARY",
//     //     status: "AWAITING_CONFIRMATION",
//     //     paymentTerms: "HOURLY",
//     //     startDate: "2024-07-29",
//     //     clientId: 4  
//     //   },
//     //   {
//     //     jobId:2,
//     //     title: "Backend Developer",
//     //     description: "Building and maintaining server-side logic",
//     //     skills: "Node.js, Express, MongoDB",
//     //     meetingLink: "https://example.com/meet2",
//     //     meetingTime:meetingTime,
//     //     duration: "PERMANENT",
//     //     status: "SEARCHING_CANDIDATE",
//     //     paymentTerms: "FIXED_PRICE",
//     //     startDate: "2024-07-29",
//     //     clientId: 4  
//     //   },
//     //   {
//     //     jobId:3,
//     //     title: "Full Stack Developer",
//     //     description: "Developing both client and server software",
//     //     skills: "JavaScript, React.js, Node.js",
//     //     meetingLink: "https://example.com/meet3",
//     //     meetingTime:meetingTime,
//     //     duration: "TEMPORARY",
//     //     status: "INITIAL_MEETING_SCHEDULED",
//     //     paymentTerms: "HOURLY",
//     //     startDate: "2024-07-29",
//     //     clientId: 5  
//     //   },
//     //   {
//     //     jobId:4,
//     //     title: "DevOps Engineer",
//     //     description: "Managing infrastructure and deployments",
//     //     skills: "AWS, Docker, Kubernetes",
//     //     meetingLink: "https://example.com/meet4",
//     //     meetingTime:meetingTime,
//     //     duration: "PERMANENT",
//     //     status: "FINALIZED",
//     //     paymentTerms: "FIXED_PRICE",
//     //     startDate: "2024-07-29",
//     //     clientId: 5  
//     //   },
//     //   {
//     //     jobId:5,
//     //     title: "Data Scientist",
//     //     description: "Analyzing complex data to provide business insights",
//     //     skills: "Python, Machine Learning, Data Analysis",
//     //     meetingLink: "https://example.com/meet5",
//     //     meetingTime:meetingTime,
//     //     duration: "TEMPORARY",
//     //     status: "INTERVIEW_SCHEDULED",
//     //     paymentTerms: "HOURLY",
//     //     startDate: "2024-07-29",
//     //     clientId: 5  
//     //   }
//     // ]);
//     // const JobAssignment = require('../app/models/jobAssignmentModel');
//     // JobAssignment.bulkCreate([
//     //   {
//     //     jobAssignmentId: 1,
//     //     jobId: 1,
//     //     billerId: 2
//     //   },
//     //   {
//     //     jobAssignmentId: 2,
//     //     jobId: 2,
//     //     billerId: 3
//     //   },
//     //   {
//     //     jobAssignmentId: 3,
//     //     jobId: 3,
//     //     billerId: 2
//     //   },
//     //   {
//     //     jobAssignmentId: 4,
//     //     jobId: 4,
//     //     billerId: 2
//     //   },
//     //   {
//     //     jobAssignmentId: 5,
//     //     jobId: 4,
//     //     billerId: 3
//     //   },
//     // ]);
//     console.log("done")
//   } catch (err) {
//     console.error('Error creating tables:', err);
//   }
// })();

module.exports = sequelize;

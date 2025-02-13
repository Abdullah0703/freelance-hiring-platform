'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// Models
require('./app/models/jobAssignmentModel');
require('./app/models/jobModel');
require('./app/models/userModel');
require('./app/models/workLogModel');
require('./app/models/feedbackModel');

//Routes
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
// const { connectToDatabase } = require('./config/mongodbConfig');
const chatRoutes = require('./app/routes/chatRoutes');
const feedbackRoutes = require('./app/routes/feedbackRoutes.js');
const jobRoutes = require('./app/routes/jobRoutes');
const jobAssignmentRoutes = require('./app/routes/jobAssignmentRoutes');
const workLogRoutes = require('./app/routes/workLogRoutes');
const TicketRoutes = require('./app/routes/ticketRoutes.js');
const notificationRoutes = require('./app/routes/notificationRoutes.js');
const dashboardRoutes= require('./app/routes/dashboardRoutes.js')


const logRequests = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
};


const app = express();
const corsOptions = {
  origin: [process.env.URL_FRONTEND, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Set the correct origin of your frontend
  credentials: true,
};

app.use(logRequests);

app.use(cors(corsOptions));
app.use(express.json());


// Serve static files from the 'uploads' directory
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads', 'profile')));

// Set up routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use("/chat", chatRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/job", jobRoutes);
app.use("/jobAssignment", jobAssignmentRoutes);
app.use("/workLog", workLogRoutes);
app.use("/Ticket",TicketRoutes)
app.use("/api",notificationRoutes)
app.use("/dashboard", dashboardRoutes);


const PORT_BACKEND = process.env.PORT_BACKEND;
app.listen(PORT_BACKEND, () => {
  console.log(`Server is running on ${process.env.URL_BACKEND}`);
  console.log(`Database Name: ${process.env.DB_NAME}`);
});
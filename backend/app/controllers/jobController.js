// Job Controller
'use strict';
const { model } = require('mongoose');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const JobAssignment = require('../models/jobAssignmentModel');
const db = require('../../config/dbConfig');
const { Op } = require('sequelize');
const NotificationController = require('./notificationController');
const { SendEmailAsync, SendEmail } = require('../../sendEmail');
const { jobPostDeleted, newProposal, jobPostUpdated, billerRecommendedNotification, jobAssignmentNotification } = require('../../emailTemplates');
const { Console } = require('winston/lib/winston/transports');
class JobController {
    static async createJob(req, res) {
        try {
            const { title, description, skills, duration, paymentTerms, startDate, clientId, budget } = req.body;
            const job = await Job.create({
                title,
                description,
                skills,
                duration,
                paymentTerms,
                startDate,
                clientId,
                budget
            });
            // await NotificationController.notifyAdminOnJobOperation(job.jobId,'CREATE')
            console.log("before running job id: ", job.jobId);
            await NotificationController.notifyAdminOnJobOperation(job.jobId, 'CREATE')
                .catch(error => console.error('Error notifying admin:', error));

                const admins = await User.findAll({
                    where: { role: 'ADMIN' },
                    attributes: ['email', 'userName']  // Fetch both email and userName
                });
                // Extract admin emails and names
                const adminDetails = admins.map(admin => ({ email: admin.email, name: admin.userName }));
                console.log('Fetched all the admins:', adminDetails);

            for (const admins of adminDetails) {
                const recipientEmail = admins.email;
                const subject = 'Job ';
                const body = newProposal(
                    job.title,
                    job.description,
                    admins.name,
                    job.budget
                );
                console.log("sending this email to admin: ", body)
                await SendEmailAsync(recipientEmail, subject, body);
            }
            return res.status(201).json({ success: true, job });
        } catch (error) {
            console.error('Error creating job:', error);
            return res.status(500).json({ success: false, message: 'Failed to create job', error: error.message });
        }
    }

    // static async updateJob(req, res) {
    //     try {
    //         const { title, description, status, meetingLink, meetingTime, skills, duration, paymentTerms, startDate, recommendedProfiles, budget } = req.body;
    //         const job = await Job.findByPk(req.params.id);

    //         if (!job) {
    //             return res.status(404).json({ success: false, message: 'Job not found' });
    //         }

    //         // Update job details
    //         await job.update({
    //             title: title,
    //             description: description,
    //             skills: skills,
    //             status: status,
    //             meetingLink: meetingLink,
    //             meetingTime: meetingTime,
    //             duration: duration,
    //             paymentTerms: paymentTerms,
    //             startDate: startDate,
    //             budget: budget,
    //             recommendedProfiles: recommendedProfiles
    //         });
    //         const { adminDetails } = await this.fetchAdminsAndClientEmail(job.clientId);
    //         console.log('admin details fetched from update job function: ',adminDetails)
    //         // Notify users based on job status
    //         if (status === 'COMPLETED' || status === 'ABORTED') {
    //             console.log("1 done");
    //             await NotificationController.notifyJobStatusChange(job.jobId);
    //             // Send email to the admin regarding job completed or aborted
    //             for (const admin of adminDetails) {
    //                 const recipientEmail = admin.email;
    //                 const subject = 'Job Status Update';
    //                 const body = jobPostUpdated(
    //                     job.title,
    //                     job.description,
    //                     admin.name,
    //                     job.status,
    //                     new Date()
    //                 );
    //                 console.log("sending this email to admin: ", body)
    //                 await SendEmailAsync(recipientEmail, subject, body);
    //             }
    //         } else if (status === 'INTERVIEW_SCHEDULED') {
    //             console.log("2 done");
    //             await NotificationController.notifyClientAndBillersOnStatusChange(job.jobId);
    //             // Converting recommendedProfiles from string to array if necessary
    //             let profileIds = [];
    //             if (typeof recommendedProfiles === 'string') {
    //                 try {
    //                     profileIds = JSON.parse(recommendedProfiles);
    //                 } catch (error) {
    //                     console.error('Error parsing recommendedProfiles:', error);
    //                     return res.status(400).json({ success: false, message: 'Invalid format for recommendedProfiles' });
    //                 }
    //             } else if (Array.isArray(recommendedProfiles)) {
    //                 profileIds = recommendedProfiles;
    //             }

    //             // Checking if there are recommended profiles
    //             if (profileIds.length > 0) {
    //                 const billers = await User.findAll({
    //                     where: {
    //                         userId: profileIds,
    //                         role: 'BILLER'
    //                     },
    //                     attributes: ['userId', 'userName', 'email']
    //                 });
    //                 // Send separate emails to each biller
    //                 console.log("Billers here: ", billers);
    //                 for (const biller of billers) {
    //                     const recipientEmail = biller.email;
    //                     const subject = 'New Job Recommendation Proposal';
    //                     const body = billerRecommendedNotification(
    //                         job.title,
    //                         job.description,
    //                         biller.userName,
    //                         new Date()
    //                     );

    //                     console.log("Sending email to biller:", recipientEmail);
    //                     await SendEmailAsync(recipientEmail, subject, body);
    //                 }
    //                 const { clientDetails } = await this.fetchAdminsAndClientEmail(job.clientId)
    //                 const recipientEmail = clientDetails.email;
    //                 const subject = 'Job Post Updated';
    //                 const body = jobPostUpdated(
    //                     job.title,
    //                     job.description,
    //                     clientDetails.name,
    //                     new Date()
    //                 );
    //                 console.log('sending email to client that is:', body);
    //                 await SendEmailAsync(recipientEmail, subject, body);
    //                 // Update the job with the new recommended profiles
    //                 await job.update({ recommendedProfiles: JSON.stringify(profileIds) });
    //             } else {
    //                 // If no recommended profiles, send a regular status update email
    //                 const { clientDetails } = await this.fetchAdminsAndClientEmail(job.clientId)
    //                 const recipientEmail = clientDetails.email;
    //                 const subject = 'Job Status Update';
    //                 const body = jobPostUpdated(
    //                     job.title,
    //                     job.description,
    //                     clientDetails.name,
    //                     job.status,
    //                     new Date()
    //                 );
    //                 await SendEmailAsync(recipientEmail, subject, body);
    //             }
    //         }
    //         else if (status === 'FINALIZED') {
    //             console.log("3 done");
    //             await NotificationController.notifyFinailizedBillers(job.jobId);
    //             const recipientEmail = 'zack8001@gmail.com';
    //             const subject = 'Job Status Update';
    //             const body = jobPostUpdated(
    //                 job.title,
    //                 job.description,
    //                 'Abdullah',
    //                 job.status,
    //                 new Date()
    //             );
    //             await SendEmailAsync(recipientEmail, subject, body);
    //         } else if (status === 'INITIAL_MEETING_SCHEDULED') {
    //             console.log("4 done");
    //             await NotificationController.notifyClientMeetAdmin(job.jobId);
    //             const recipientEmail = 'zack8001@gmail.com';
    //             const subject = 'Job Status Update';
    //             const body = jobPostUpdated(
    //                 job.title,
    //                 job.description,
    //                 'Abdullah',
    //                 job.status,
    //                 new Date()
    //             );
    //             await SendEmailAsync(recipientEmail, subject, body);
    //         }
    //         return res.status(200).json({ success: true, message: 'Job details updated successfully', job });
    //     } catch (error) {
    //         console.error('Error updating job details:', error);
    //         return res.status(500).json({ success: false, message: 'Failed to update job details', error: error.message });
    //     }
    // }
    static async updateJob(req, res) {
        try {
            const {
                title, description, status, meetingLink, meetingTime, skills, duration, paymentTerms, startDate, recommendedProfiles, budget
            } = req.body;
            const job = await Job.findByPk(req.params.id);

            if (!job) {
                return res.status(404).json({ success: false, message: 'Job not found' });
            }

            // Update job details
            await job.update({
                title, description, skills, status, meetingLink, meetingTime, duration,
                paymentTerms, startDate, budget, recommendedProfiles
            });

            // Fetch all admin users
            const admins = await User.findAll({
                where: { role: 'ADMIN' },
                attributes: ['email', 'userName']  // Fetch both email and userName
            });
            // Extract admin emails and names
            const adminDetails = admins.map(admin => ({ email: admin.email, name: admin.userName }));
            console.log('Fetched all the admins:', adminDetails);

            // Fetch client details based on job.clientId
            const client = await User.findOne({
                where: { userId: job.clientId },
                attributes: ['email', 'userName']  // Fetch both email and userName
            });
            const clientDetails = client ? { email: client.email, name: client.userName } : null;
            console.log('Fetched the client:', clientDetails);

            // Fetch billers assigned to this job from JobAssignment table
            const assignedBillers = await JobAssignment.findAll({
                where: { jobId: req.params.id },
                attributes: ['billerId']
            });
            // Extract the biller IDs
            const billerIds = assignedBillers.map(assignment => assignment.billerId);
            // Fetch the billers' details from the User model
            const billers = await User.findAll({
                where: {
                    userId: billerIds,
                    role: 'BILLER'
                },
                attributes: ['userId', 'userName', 'email']
            });

            console.log('Assigned Billers:', billers);
            // Notify users based on job status
            if (status === 'COMPLETED' || status === 'ABORTED') {
                console.log("1 done");
                await NotificationController.notifyJobStatusChange(job.jobId);
                // Send email to the admin regarding job completed or aborted
                for (const admin of adminDetails) {
                    const recipientEmail = admin.email;
                    const subject = 'Job Status Update';
                    const body = jobPostUpdated(
                        job.title,
                        job.description,
                        admin.name,
                        job.status,
                        new Date()
                    );
                    console.log("Sending this email to admin if job is completed or aborted:", body);
                    await SendEmailAsync(recipientEmail, subject, body);
                }
                // Send email to the assigned billers regarding job completed or aborted
                for (const biller of billers) {
                    const recipientEmail = biller.email;
                    const subject = `Job ${job.status}`;
                    const body = jobPostUpdated(
                        job.title,
                        job.description,
                        biller.userName,
                        job.status,
                        new Date()
                    );
                    console.log("Sending email to assigned biller:", recipientEmail);
                    await SendEmailAsync(recipientEmail, subject, body);
                }
            } else if (status === 'INTERVIEW_SCHEDULED') {
                console.log("2 done");
                await NotificationController.notifyClientAndBillersOnStatusChange(job.jobId);

                // Converting recommendedProfiles from string to array if necessary
                let profileIds = [];
                if (typeof recommendedProfiles === 'string') {
                    try {
                        profileIds = JSON.parse(recommendedProfiles);
                    } catch (error) {
                        console.error('Error parsing recommendedProfiles:', error);
                        return res.status(400).json({ success: false, message: 'Invalid format for recommendedProfiles' });
                    }
                } else if (Array.isArray(recommendedProfiles)) {
                    profileIds = recommendedProfiles;
                }

                // Checking if there are recommended profiles
                if (profileIds.length > 0) {
                    const billers = await User.findAll({
                        where: {
                            userId: profileIds,
                            role: 'BILLER'
                        },
                        attributes: ['userId', 'userName', 'email']
                    });
                    // Send separate emails to each biller
                    console.log("Billers here:", billers);
                    for (const biller of billers) {
                        const recipientEmail = biller.email;
                        const subject = 'New Job Recommendation Proposal';
                        const body = billerRecommendedNotification(
                            job.title,
                            job.description,
                            biller.userName,
                            new Date()
                        );
                        console.log("Sending email to biller:", recipientEmail);
                        await SendEmailAsync(recipientEmail, subject, body);
                    }

                    if (clientDetails) {
                        const recipientEmail = clientDetails.email;
                        const subject = 'Billers For Job Recommended';
                        const body = jobPostUpdated(
                            job.title,
                            job.description,
                            clientDetails.name,
                            new Date()
                        );
                        console.log('Sending email to client that billers are recommended:', body);
                        await SendEmailAsync(recipientEmail, subject, body);
                    }

                    // Update the job with the new recommended profiles
                    await job.update({ recommendedProfiles: JSON.stringify(profileIds) });
                } else {
                    // If no recommended profiles, send a regular status update email
                    if (clientDetails) {
                        const recipientEmail = clientDetails.email;
                        const subject = 'Job Status Update';
                        const body = jobPostUpdated(
                            job.title,
                            job.description,
                            clientDetails.name,
                            job.status,
                            new Date()
                        );
                        await SendEmailAsync(recipientEmail, subject, body);
                    }
                }
            }
            else if (status === 'FINALIZED') {
                console.log("3 done");
                await NotificationController.notifyFinailizedBillers(job.jobId);
                // Notify the admin about job finalized
                for (const admin of adminDetails) {
                    const recipientEmail = admin.email;
                    const subject = 'Job Status Finalized';
                    const body = jobPostUpdated(
                        job.title,
                        job.description,
                        admin.name,
                        job.status,
                        new Date()
                    );
                    console.log("Sending email to admin about job finalized:", body);
                    await SendEmailAsync(recipientEmail, subject, body);
                }

                // Notify the assigned billers about job finalized
                for (const biller of billers) {
                    const recipientEmail = biller.email;
                    const subject = 'Job Assignment';
                    const body = jobAssignmentNotification(
                        job.title,
                        job.description,
                        biller.userName,
                        job.paymentTerms,
                        new Date()
                    );
                    console.log("Sending email to assigned biller about job finalized:", body);
                    await SendEmailAsync(recipientEmail, subject, body);
                }
            } else if (status === 'INITIAL_MEETING_SCHEDULED') {
                console.log("4 done");
                await NotificationController.notifyClientMeetAdmin(job.jobId);
                const recipientEmail = clientDetails.email;
                const subject = 'Job Status Update';
                const body = jobPostUpdated(
                    job.title,
                    job.description,
                    clientDetails.name,
                    job.status,
                    new Date()
                );
                console.log("sent email to client to meet admin: ",body)
                await SendEmailAsync(recipientEmail, subject, body);
            }
            return res.status(200).json({ success: true, message: 'Job details updated successfully', job });
        } catch (error) {
            console.error('Error updating job details:', error);
            return res.status(500).json({ success: false, message: 'Failed to update job details', error: error.message });
        }
    }


    static async getAllJobs(req, res) {
        try {
            const jobs = await Job.findAll({
                include: {
                    model: User,
                    as: 'billers',
                    through: { attributes: [] }
                }
            });
            return res.status(200).json({ success: true, jobs });
        } catch (error) {
            console.error('Error retrieving all jobs:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve all jobs', error: error.message });
        }
    }

    static async getJobsOfClient(req, res) {
        try {
            const jobs = await Job.findAll({
                where: {
                    clientId: req.params.id
                }, include: {
                    model: User,
                    as: 'billers',
                    through: { attributes: [] }
                }
            });
            return res.status(200).json({ success: true, jobs });
        } catch (error) {
            console.error('Error retrieving all jobs:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve all jobs', error: error.message });
        }
    }

    static async getJobsOfBiller(req, res) {
        try {
            const billerId = parseInt(req.params.id);
            // Fetch jobs assigned to the biller
            const jobs = await Job.findAll({
                include: {
                    model: User,
                    as: 'billers',
                    where: { userId: billerId },
                    attributes: []
                },
            });
            // if (!jobs.length) {
            //     return res.status(404).json({ success: false, message: 'No jobs found for this biller' });
            // }
            if (!jobs.length) {
                console.log("No jobs found for biller in biller dashboard thing")
                return res.status(200).json({ success: true, message: 'No jobs found for this biller', jobs: [], clients: [] });
            }

            // Separate jobs into completed and in-progress
            const completedJobs = jobs.filter(job => job.status === 'COMPLETED');
            const jobsInProgress = jobs.filter(job => job.status !== 'COMPLETED');
            // Extract client IDs from the jobs
            const clientIds = [...new Set(jobs.map(job => job.clientId))];
            // Fetch client details
            const clients = await User.findAll({
                where: { userId: clientIds },
                attributes: ['userId', 'userName', 'email', 'phoneNumber', 'address'] // Adjust attributes as needed
            });
            // Return the jobs and clients
            return res.status(200).json({
                success: true,
                jobs,
                completedJobs,
                jobsInProgress,
                clients
            });
        } catch (error) {
            console.error('Error retrieving jobs and clients:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve jobs and clients', error: error.message });
        }
    }

    static async getBillersOfJob(req, res) {
        try {
            const billers = await User.findAll({
                include: {
                    model: Job,
                    as: 'assignedJobs',
                    where: { jobId: req.params.id },
                    attributes: []
                },
            });


            return res.status(200).json({ success: true, billers });
        } catch (error) {
            console.error('Error retrieving all jobs:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve all jobs', error: error.message });
        }
    }


    static async getJobById(req, res) {
        try {
            const jobId = req.params.id;
            const job = await Job.findByPk(jobId);

            if (!job) {
                return res.status(404).json({ success: false, message: 'Job not found' });
            }

            return res.status(200).json({ success: true, job });
        } catch (error) {
            console.error('Error retrieving job by ID:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve job by ID', error: error.message });
        }
    }

    static async deleteJob(req, res) {
        try {
            const jobId = req.params.id;
            const job = await Job.findByPk(jobId);

            if (!job) {
                return res.status(404).json({ success: false, message: 'Job not found' });
            }
            //generate notification
            await NotificationController.notifyAdminOnJobOperation(job.jobId, 'DELETE');
            //send email
            // Extract admin emails and names
            const adminDetails = admins.map(admin => ({ email: admin.email, name: admin.userName }));
            console.log('Fetched all the admins:', adminDetails);

            for (const admin of adminDetails) {
                const recipientEmail = admin.email;
                const subject = 'Job Status Update';
                const body = jobPostUpdated(
                    job.title,
                    job.description,
                    admin.name,
                    job.status,
                    new Date()
                );
                console.log("Sending this email to admin if job deleted:", body);
                await SendEmailAsync(recipientEmail, subject, body);
            }
            await job.destroy();
            return res.status(200).json({ success: true, message: 'Job deleted successfully' });
        } catch (error) {
            console.error('Error deleting job:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete job', error: error.message });
        }
    }

    static async testing(req, res) {
        try {
            const { jobId, clientId, billerId } = req.body;
            const job = await Job.findByPk(jobId);
            const client = await Job.findByPk(clientId);
            const biller = await Job.findByPk(billerId);

            if (!job || !client || !biller) {
                return res.status(404).json({ success: false, message: 'entity not found' });
            }

            const clientKaiBiller = await job.getClient();

            return res.status(200).json({ success: true, clientKaiBiller });
        } catch (error) {
            console.error('Error deleting job:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete job', error: error.message });
        }
    }
    //new function added here to recommend billers to job
    // static async recommendBillersToJob(req, res) {
    //     try {
    //         const { jobId, billerIds } = req.body;

    //         // Find the job by ID
    //         const job = await Job.findByPk(jobId);
    //         if (!job) {
    //             return res.status(404).json({ success: false, message: 'Job not found' });
    //         }

    //         // Find the existing recommended profiles
    //         let recommendedProfiles = job.recommendedProfiles ? JSON.parse(job.recommendedProfiles) : [];

    //         // Add new billers to the recommended profiles
    //         billerIds.forEach(billerId => {
    //             if (!recommendedProfiles.includes(billerId)) {
    //                 recommendedProfiles.push(billerId);
    //             }
    //         });
    //         // Update the job with the new recommended profiles
    //         await job.update({ recommendedProfiles: JSON.stringify(recommendedProfiles) });
    //         return res.status(200).json({ success: true, message: 'Billers recommended successfully', recommendedProfiles });
    //     } catch (error) {
    //         console.error('Error recommending billers to job:', error);
    //         return res.status(500).json({ success: false, message: 'Failed to recommend billers to job', error: error.message });
    //     }
    // }
    static async recommendBillersToJob(req, res) {
        try {
            const { jobId, billerIds } = req.body;
            // Find the job by ID
            const job = await Job.findByPk(jobId);
            if (!job) {
                return res.status(404).json({ success: false, message: 'Job not found' });
            }
            // Fetch the billers' names
            const billers = await User.findAll({
                where: {
                    id: billerIds,
                    role: 'BILLER'
                },
                attributes: ['userId', 'userName']
            });
            // Map biller names
            const billerNames = billers.map(biller => biller.userName).join(', ');
            console.log("Biller names in recommend billers function: ", billerNames)
            // Find the existing recommended profiles
            let recommendedProfiles = job.recommendedProfiles ? JSON.parse(job.recommendedProfiles) : [];
            // Add new billers to the recommended profiles
            billerIds.forEach(billerId => {
                if (!recommendedProfiles.includes(billerId)) {
                    recommendedProfiles.push(billerId);
                }
            });
            // Prepare the email
            const recipientEmail = 'zack8001@gmail.com';
            const subject = 'New Job Recommendation Proposal';
            const body = billerRecommendedNotification(
                job.title,
                job.description,
                billerNames,
                new Date()
            );
            // Update the job with the new recommended profiles
            await job.update({ recommendedProfiles: JSON.stringify(recommendedProfiles) });
            // Send the email
            await SendEmailAsync(recipientEmail, subject, body);
            return res.status(200).json({ success: true, message: 'Billers recommended successfully', recommendedProfiles });
        } catch (error) {
            console.error('Error recommending billers to job:', error);
            return res.status(500).json({ success: false, message: 'Failed to recommend billers to job', error: error.message });
        }
    }

    // Function to fetch all admins and the client's email
    static async fetchAdminsAndClientEmail(clientId) {
        try {
            // Fetch all admin users
            const admins = await User.findAll({
                where: { role: 'ADMIN' },
                attributes: ['email', 'userName']  // Fetch both email and userName
            });

            // Extract admin emails and names
            const adminDetails = admins.map(admin => ({ email: admin.email, name: admin.userName }));
            console.log("Fetched all the admins from the fetch admin and client function: ", adminDetails);

            // Fetch client email and name based on job.clientId
            const client = await User.findOne({
                where: { userId: clientId },
                attributes: ['email', 'userName']  // Fetch both email and userName
            });

            console.log("Fetched the client from the fetch admin and client function: ", client);

            // Extract client details
            const clientDetails = client ? { email: client.email, name: client.userName } : null;

            return { adminDetails, clientDetails };
        } catch (error) {
            console.error('Error fetching admins or client email:', error);
            throw new Error('Failed to fetch admins or client email');
        }
    };

}



module.exports = JobController;
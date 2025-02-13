const path = require('path');
const fs = require('fs');

const logoPath = path.join(__dirname, '..', 'frontend', 'public', 'logo.png');
// Check if the logo file exists
if (!fs.existsSync(logoPath)) {
    console.error('Logo file does not exist:', logoPath);
} else {
    console.log('Logo file exists:', logoPath);
}
const Logo = {
    filename: 'logo.png',
    path: logoPath,
    cid: 'logo@drbillerz.ca'
};

function formatLocalDateTime(dateObject) {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
    };

    const formattedDate = dateObject.toLocaleDateString(undefined, options);
    return formattedDate;
}

//done
const emailVerificationTemplate = (link) => {
    return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background: url('path/to/your-background-image.jpg') no-repeat center center/cover;
          }
  
          .container {
              width: 80%;
              margin: 0 auto;
              padding: 2rem;
              background-color: rgba(255, 255, 255, 0.9);
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
  
          .logo {
              max-width: 150px;
          }
  
          .email-header {
              background-color: #6a994e;
              color: white;
              padding: 2rem 0;
              text-align: center;
          }
  
          .email-content {
              padding: 2rem;
          }
  
          .btn-verify {
              background-color: #4CAF50;
              color: white !important;
              text-decoration: none !important;
              padding: 1.5rem 3rem;
              border-radius: 30px;
              display: inline-block;
              margin-top: 2rem;
              font-weight: bold;
              transition: background-color 0.3s ease;
          }
  
          .btn-verify:hover {
              background-color: #45a049;
              color:#FFFFFF
          }
  
          .footer {
              margin-top: 2rem;
              color: #333;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <div class="email-header">
              <img src="cid:${logo.cid}" alt="Logo" class="logo">
              <h1>Email Verification</h1>
          </div>
          <div class="email-content">
              <h2>Dear User,</h2>
              <p>Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>
              <a href="${link}" class="btn-verify">Verify Email</a>
              <p>If you did not create an account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
          <p>&copy; 2024 Butterpply. All rights reserved.</p>
          </div>
      </div>
  </body>
  
  </html>`;
};
//job post deleted
const jobPostDeleted = (jobTitle, projectDescription, name, date) => {
    const DateObject = date instanceof Date ? date : new Date(date);
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Post Deleted Successfully</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
    
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 2rem;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                max-width: 300px;
            }
    
            .email-header {
                background-color: #9d0208;
                color: white;
                padding: 2rem 0;
                text-align: center;
            }
    
            .notification-details {
                padding: 2rem;
            }
    
            .notification-summary {
                margin-top: 1.5rem;
                padding: 1rem;
                background-color: #f8f8f8;
                border-radius: 5px;
            }
    
            .footer {
                margin-top: 2rem;
                color: #333;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="email-header">
                <img src="cid:${Logo.cid}" alt="Logo" class="logo">
                <h1>Job Post No Longer Available</h1>
            </div>
            <div class="notification-details">
                <h2>Dear ${name},</h2>
                <p>:</p>
                <div class="notification-summary">
                    <h3>Notification Summary</h3>
                    <p><strong>Job Title:</strong> ${jobTitle}</p>
                    <p><strong>Project Description:</strong> ${projectDescription}</p>
                    <p><strong>Job Date:</strong> ${formatLocalDateTime(
        DateObject
    )}</p>
                </div>
                <p>If you have any questions or need further assistance, feel free to <a href="mailto:support@drbillerz.ca">contact us</a>.</p>
            </div>
            <div class="footer">
            <p>&copy; 2024 DrBillerz. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>
    `;
};
//job post updated 
const jobPostUpdated = (jobTitle, projectDescription, name, updateDetails, date) => {
    const DateObject = date instanceof Date ? date : new Date(date);

    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Post Updated</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
    
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 2rem;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                max-width: 300px;
            }
    
            .email-header {
                background-color: #007bff;
                color: white;
                padding: 2rem 0;
                text-align: center;
            }
    
            .notification-details {
                padding: 2rem;
            }
    
            .notification-summary {
                margin-top: 1.5rem;
                padding: 1rem;
                background-color: #f8f8f8;
                border-radius: 5px;
            }
    
            .footer {
                margin-top: 2rem;
                color: #333;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="email-header">
                <img src="cid:${Logo.cid}" alt="Logo" class="logo">
                <h1>Job Post Updated</h1>
            </div>
            <div class="notification-details">
                <h2>Dear ${name},</h2>
                <p>We wanted to inform you that the job post titled "<strong>${jobTitle}</strong>" has been updated with the following details:</p>
                <div class="notification-summary">
                    <h3>Notification Summary</h3>
                    <p><strong>Job Title:</strong> ${jobTitle}</p>
                    <p><strong>Project Description:</strong> ${projectDescription}</p>
                    <p><strong>Updated Details:</strong>The job status has been changed to ${updateDetails}</p>
                    <p><strong>Job Date:</strong> ${formatLocalDateTime(DateObject)}</p>
                </div>
                <p>If you have any questions or need further assistance, feel free to <a href="mailto:support@drbillerz.ca">contact us</a>.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 DrBillerz. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>
    `;
};
//new job
const newProposal = (proposal_title, proposal_description, buyer_name, proposal_amount) => {
    const date = new Date();
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Job Proposal</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
    
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 2rem;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                max-width: 300px;
            }
    
            .email-header {
                background-color: #023e8a;
                color: white;
                padding: 2rem 0;
                text-align: center;
            }
    
            .proposal-details {
                padding: 2rem;
            }
    
            .proposal-summary {
                margin-top: 1.5rem;
                padding: 1rem;
                background-color: #f8f8f8;
                border-radius: 5px;
            }
    
            .btn-accept,
            .btn-reject {
                text-decoration: none;
                padding: 1.5rem 3rem;
                border-radius: 30px;
                display: inline-block;
                margin-top: 2rem;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }
    
            .btn-accept {
                background-color: #28a745;
                color: white;
                margin-right: 1rem;
            }
    
            .btn-reject {
                background-color: #dc3545;
                color: white;
            }
    
            .footer {
                margin-top: 2rem;
                color: #333;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="email-header">
                <img src="cid:${Logo.cid}" alt="Logo" class="logo">
                <h1>New Job Proposal</h1>
            </div>
            <div class="proposal-details">
              <h2>Dear ${buyer_name}</h2>
                <p>Congratulations! A new Job is posted. Below are the details of the proposal:</p>
                <div class="proposal-summary">
                    <h3>Proposal Summary</h3>
                    <p><strong>Proposal Title:</strong> ${proposal_title}</p>
                    <p><strong>Proposal Description:</strong> ${proposal_description}</p>
                    <p><strong>Proposal Amount:</strong> ${proposal_amount}</p>
                    <p><strong>Proposal Date:</strong> ${formatLocalDateTime(
        date
    )}</p>
                </div>
                <p>If you have any questions or need further assistance, feel free to <a href="mailto:support@butterpply.com">contact us</a>.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Butterpply. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>
    `;
};
//job assignment
const jobAssignmentNotification = (jobTitle, projectDescription, billerName, paymentTerms, jobDate) => {
    const DateObject = jobDate instanceof Date ? jobDate : new Date(jobDate);

    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Job Assignment</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
    
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 2rem;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                max-width: 300px;
            }
    
            .email-header {
                background-color: #28a745;
                color: white;
                padding: 2rem 0;
                text-align: center;
            }
    
            .notification-details {
                padding: 2rem;
            }
    
            .notification-summary {
                margin-top: 1.5rem;
                padding: 1rem;
                background-color: #f8f8f8;
                border-radius: 5px;
            }
    
            .footer {
                margin-top: 2rem;
                color: #333;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="email-header">
                <img src="cid:${Logo.cid}" alt="Logo" class="logo">
                <h1>New Job Assignment</h1>
            </div>
            <div class="notification-details">
                <h2>Dear ${billerName},</h2>
                <p>We are pleased to inform you that you have been assigned a new job titled "<strong>${jobTitle}</strong>". Here are the details of the job:</p>
                <div class="notification-summary">
                    <h3>Job Details</h3>
                    <p><strong>Job Title:</strong> ${jobTitle}</p>
                    <p><strong>Project Description:</strong> ${projectDescription}</p>
                    <p><strong>Payment Terms:</strong> ${paymentTerms}</p>
                    <p><strong>Job Date:</strong> ${formatLocalDateTime(DateObject)}</p>
                </div>
                <p>If you have any questions or need further assistance, feel free to <a href="mailto:support@drbillerz.ca">contact us</a>.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 DrBillerz. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>
    `;
};
//recommended billers
const billerRecommendedNotification = (jobTitle, projectDescription, billerName, recommendationDate) => {
    const DateObject = recommendationDate instanceof Date ? recommendationDate : new Date(recommendationDate);

    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Biller Recommendation for Job</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
    
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 2rem;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                max-width: 300px; /* Increase this value to make the logo bigger */
            }
    
            .email-header {
                background-color: #6c757d;
                color: white;
                padding: 2rem 0;
                text-align: center;
            }
    
            .recommendation-details {
                padding: 2rem;
            }
    
            .recommendation-summary {
                margin-top: 1.5rem;
                padding: 1rem;
                background-color: #f8f8f8;
                border-radius: 5px;
            }
    
            .footer {
                margin-top: 2rem;
                color: #333;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="email-header">
                <img src="cid:${Logo.cid}" alt="Logo" class="logo">
                <h1>You Have Been Recommended for a Job</h1>
            </div>
            <div class="recommendation-details">
                <h2>Dear ${billerName},</h2>
                <p>We are pleased to inform you that you have been recommended for a new Job opportunity. Here are the details:</p>
                <div class="recommendation-summary">
                    <h3>Job Details</h3>
                    <p><strong>Job Title:</strong> ${jobTitle}</p>
                    <p><strong>Project Description:</strong> ${projectDescription}</p>
                    <p><strong>Recommendation Date:</strong> ${formatLocalDateTime(DateObject)}</p>
                </div>
                <p>If you have any questions or need further assistance, feel free to <a href="mailto:support@butterpply.ca">contact us</a>.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 DrBillerz. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>
    `;
};

module.exports = {
    jobPostDeleted,
    newProposal,
    jobPostUpdated,
    jobAssignmentNotification,
    billerRecommendedNotification
}
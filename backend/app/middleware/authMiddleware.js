'use strict';

const jwtUtils = require('../utils/jwtUtils');
const Branch = require('../models/branchModel');

const authenticateUser = async (req, res, next, role) => {
  const authToken = req.header('Authorization');

  if (!authToken) {
    return res.status(401).json({ success: false, message: 'Access denied. Missing authentication token.' });
  }

  try {
    const token = authToken.split(' ')[1]; // Splitting the token
    const decodedToken = jwtUtils.verifyToken(token);

    const branch = await Branch.findOne({ where: { email: decodedToken.email } });

    if (!branch) {
      throw new Error('branch is not authorized.');
    }

    if (role === 'admin') {

      if (decodedToken.role == 'admin') {
        req.branch = decodedToken;
        console.log("branch Authenticated")
        next();
      }

      else {
        throw new Error('branch is not authorized as an admin.');
      }

    } else if (role === 'branchHead') {

      if (decodedToken.role == 'branchHead') {
        req.branch = decodedToken;
        console.log("branch Authenticated")
        next();
      }

      else {
        throw new Error('branch is not authorized as a branchHead.');
      }
    }

  } catch (error) {
    console.error(`${role} authentication error:`, error);
    return res.status(401).json({ success: false, message: `Invalid ${role} authentication.` });
  }
};

module.exports.authenticateAdmin = async (req, res, next) => {
  await authenticateUser(req, res, next, 'admin');
};

module.exports.authenticateBranchHead = async (req, res, next) => {
  await authenticateUser(req, res, next, 'branchHead');
};

module.exports.authAdminBranchHead = async (req, res, next) => {
  const authToken = req.header('Authorization');

  if (!authToken) {
    return res.status(401).json({ success: false, message: 'Access denied. Missing authentication token.' });
  }

  try {
    const token = authToken.split(' ')[1]; // Splitting the token
    const decodedToken = jwtUtils.verifyToken(token);
    const branch = await Branch.findOne({ where: { email: decodedToken.email } });

    if (!branch) {
      throw new Error('branch is not authorized.');
    }

    req.branch = decodedToken;
    next();

  } catch (error) {
    console.error('admin/branchHead authentication error:', error);
    return res.status(401).json({ success: false, message: 'Invalid admin/branchHead authentication.' });
  }
};

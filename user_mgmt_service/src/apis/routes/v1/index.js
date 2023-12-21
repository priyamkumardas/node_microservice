const express = require('express');

const router = express.Router();
const { AuthManager } = require('sarvm-utility');
const UserRouter = require('./Users');
const OtpRouter = require('./otp');
const EmployeeRouter = require('./Employee');
const OrganizationRouter = require('./Organization');
const FavouriteRouter = require('./Favourite');
const ConsumerRouter = require('./Consumer');

router.use('/favourite', AuthManager.requiresScopes(['Users', 'SYSTEM', 'ADMIN']), FavouriteRouter);
router.use('/users', OtpRouter);

router.use('/users', AuthManager.requiresScopes(['Users', 'SYSTEM', 'ADMIN']), UserRouter);

router.use('/employee', AuthManager.requiresScopes(['Users', 'SYSTEM', 'ADMIN']), EmployeeRouter);

router.use('/organization', AuthManager.requiresScopes(['Users', 'SYSTEM', 'ADMIN']), OrganizationRouter);

router.use('/consumerProfile', AuthManager.requiresScopes(['Users', 'SYSTEM', 'ADMIN']), ConsumerRouter);

module.exports = router;

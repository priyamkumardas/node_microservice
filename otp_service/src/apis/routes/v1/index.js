const express = require('express');
const { AuthManager } = require('sarvm-utility');

const router = express.Router();

const OtpRouter = require('./Otp');

//router.use('/otp', AuthManager.requiresScopes(['SYSTEM']), OtpRouter);
 router.use('/otp', OtpRouter)

module.exports = router;

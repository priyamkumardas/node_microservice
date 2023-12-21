const express = require('express');

const router = express.Router();

const AuthRouter = require('./Auth');

router.use('/', AuthRouter);

module.exports = router;

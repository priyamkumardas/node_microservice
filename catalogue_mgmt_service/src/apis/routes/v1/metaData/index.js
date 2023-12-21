const express = require('express');
// const { AuthManager } = require('sarvm-utility');
const router = express.Router();
const masterCatalogRouter = require('./matercatalog');

router.use('/mastercatalog', masterCatalogRouter);

module.exports = router;

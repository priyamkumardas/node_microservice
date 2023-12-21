const express = require('express');

const router = express.Router();

const ShopRouter = require('./Shop');
const CatalogRouter = require('./Catalog');

router.use('/shop', ShopRouter);
router.use('/catalog', CatalogRouter);

module.exports = router;

const express = require('express');
// const { AuthManager } = require('sarvm-utility');
const router = express.Router();

const categoryRouter = require('./category');
const productRouter = require('./product');
const publishRouter = require('./publish');
const catalogRoutere = require('./catalog');
const metaDataRoutere = require('./metaData/index');
const DataTree = require('./DataTree');

const retailerCatalogRouter = require('./retailerCatalog/index');

const bulkUpdateCatalog = require('./BulkUpdateProduct');

// router.use('/category',AuthManager.requiresScopes(['admin']), MasterRouter);
router.use('/catalog', catalogRoutere);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/publish', publishRouter);

router.use('/metadata', metaDataRoutere);

router.use('/retailercatalog', retailerCatalogRouter);

router.use('/bulkupdate', bulkUpdateCatalog);
router.use('/dataTree', DataTree);

module.exports = router;

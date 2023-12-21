const express = require('express');

const router = express.Router();

const ShopRouter = require('./Shop');

const WorkingHoursRouter = require('./ShopWorkingHour');

const CatalogRouter = require('./Catalog');

const StoresRouter = require('./Stores');
const RetailerMetaData = require('./MetaData');
const OrdersRouter = require('./Orders');

const RetailerRouter = require('./Retailer');

router.use('/time', WorkingHoursRouter);

router.use('/shop', ShopRouter);

router.use('/catalog', CatalogRouter);

router.use('/stores', StoresRouter);

router.use('/splash', RetailerMetaData);

router.use('/orders', OrdersRouter);

router.use('/retailers', RetailerRouter);

module.exports = router;

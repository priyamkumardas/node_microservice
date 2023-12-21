/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const ProductController = require('@root/src/apis/controllers/v1/product');
const productCategoryRouter = require('./productCategory');
const { validateAjv } = require('@root/src/common/libs/Middleware/validate-ajv');
const productSchema = require('@root/src/common/libs/Validation/Product/Schemas');
const productCatgoryController = require('@controllers/v1/ProductCategory');
const productCategorySchema = require('@root/src/common/libs/Validation/productCategory/Schemas');
const { uniqeNumber } = require('@root/src/common/libs/ShortUniqueID/shortUniqueId');
const XLSX = require('xlsx');
const multer = require('multer');
var filessystem = require('fs');
const axios = require('axios');

try {
  filessystem.mkdirSync('./uploads');
} catch (e) {
  if (e.code != 'EEXIST') throw e;
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, 'catalog' + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  },
});
const upload = multer({
  storage: storage,
});

const sanitizeString = (str) => {
  return str
    .replace(/-+/g, ' ')
    .replace(/_+/g, ' ')
    .replace(/\/+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .join('_')
    .toLowerCase();
};

function validate(req, res, next) {
  if (!req.file) {
    return res.send({
      errors: {
        message: 'file cant be empty',
      },
    });
  }
  next();
}

const getProducts = async (location, userId) => {
  log.info({ info: 'Get Products' });
  try {
    const productsArray = [];
    const dummyKeys = new Set();
    var workbook = XLSX.readFile(location);
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const worksheetData = XLSX.utils.sheet_to_json(worksheet);
      worksheetData.forEach((item, i) => {
        let {
          Category: category,
          Sub_Category: subCategory,
          Micro_Category: microCategory,
          Product_Name: name,
          Description: description,
          Place_Of_Origin: place_of_origin,
          Minimum_Order_Quantity: min_oq,
          Maximum_Order_Quantity: max_oq,
          Minimum_Price_Per_Order: min_ppo,
          Weight_Per_Piece: weight_per_piece,
          Regular_Price: rp,
          MRP: mrp,
          Selling_Price: sp,
          Return_Option: return_option,
          Veg: veg,
          Tax_Status: tax_status,
          HSN: hsn,
          Tax: tax,
          Min_Price: min_price,
          Max_Price: max_price,
          Publish: publish,
        } = item;

        let data = {
          id: uniqeNumber(),
          dummyKey: sanitizeString(name),
          name,
          description,
          status: 'ACTIVE',
          created_by: userId,
          updated_by: null,
          place_of_origin,
          min_oq,
          max_oq,
          min_ppo,
          weight_per_piece,
          rp,
          mrp,
          sp,
          return_option,
          veg: veg,
          tax_status: tax_status == 'TAXABLE' ? 'TAXABLE' : 'NON_TAXABLE',
          tax,
          hsn,
          min_price,
          max_price,
          publish,
        };
        dummyKeys.add(data.dummyKey);
        productsArray.push(data);
      });
    });
    return { productsArray, dummyKeys };
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
};

const router = express.Router();

router.use('/mapping', productCategoryRouter);

router.get('/image', async (req, res, next) => {
  log.info({ info: 'Inside presigned url' });
  try {
    const result = await ProductController.presignedUrl();
    log.info({ info: 'presigned url' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
  }
});

router.post('/eventReceiver', (req, res) => {
  try {
    const event = req.body;
    console.log('Received event:', event);
    log.info({ msg: 'Event received ' + event });
    const { Type } = req.body;

    if (Type === 'SubscriptionConfirmation') {
      log.info({ msg: 'Inside subscription confirmation' });
      // Confirm the subscription by making an HTTP GET request to the SubscribeURL
      const { SubscribeURL } = req.body;
      log.info({ SubscribeURL: SubscribeURL });
      axios
        .get(SubscribeURL)
        .then((response) => {
          log.info({ response: response });
          console.log('Subscription confirmed:', response.data);
          res.status(200).send('Subscription confirmed');
        })
        .catch((error) => {
          log.error({ msg: 'Failed to confirm subscription:', error });
          res.status(500).send('Failed to confirm subscription');
        });
    } else if (Type === 'Notification') {
      log.info({ msg: 'Inside notification' });
      const { Message } = req.body;
      console.log('Received SNS notification:', Message);

      res.status(200).send('Notification received');
    } else {
      // Handle other message types if needed
      console.log('Received unsupported SNS message type:', Type);
      res.status(400).send('Unsupported message type');
    }
  } catch (err) {
    log.error({ msg: 'Error at eventReceiver endpoint ' + err });
  }
});

router.get('/sync', async (req, res, next) => {
  log.info({ info: 'Inside sync url' });
  try {
    const { userId } = req.authPayload;
    const prodRows = null;

    // await ProductController.productSync(prodRows, userId);

    log.info({ info: 'sync url' });
    HttpResponseHandler.success(req, res, { sync: 'trigger' });
  } catch (error) {
    log.error({ error: error });
  }
});

router.get('/', async (req, res, next) => {
  log.info({ info: 'Inside product lists' });
  try {
    const query = req.query;
    const { page = 1, q, pageSize = 50 } = query;
    const filterSearch = { page, pageSize, q };
    const result = await ProductController.productLists(filterSearch);
    log.info({ info: 'product lists' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.post('/bulk', upload.single('file'), validate, async (req, res, next) => {
  log.info({ info: 'Inside Bulk Products' });
  try {
    const fileLocation = req.file.path;
    const { userId } = req.authPayload;
    const { productsArray, dummyKeys } = await getProducts(fileLocation, userId);
    const result = await ProductController.bulkInsert(productsArray, dummyKeys);
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.get('/:product_id', async (req, res, next) => {
  log.info({ info: 'Inside product by id' });
  try {
    const { product_id } = req.params;
    const result = await ProductController.productById(product_id);
    log.info({ info: 'product by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  log.info({ info: 'Inside create product' });
  try {
    const productDetail = req.body;

    validateAjv(productSchema.update_product, productDetail);
    const { userId } = req.authPayload;
    const result = await ProductController.createProduct(userId, productDetail);
    log.info({ info: 'create product' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.put('/:product_id', async (req, res, next) => {
  log.info({ info: 'Inside update product by id' });
  try {
    const productDetail = req.body;
    validateAjv(productSchema.update_product, productDetail);
    const { userId } = req.authPayload;
    const { product_id } = req.params;
    const result = await ProductController.updateProductById(userId, product_id, productDetail);
    log.info({ info: 'update product by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.delete('/:product_id', async (req, res, next) => {
  log.info({ info: 'Inside delete product by id' });
  try {
    const { product_id } = req.params;

    const result = await ProductController.deleteProductById(product_id);
    log.info({ info: 'delete product by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.put('/:product_id/mapping', async (req, res, next) => {
  log.info({ info: 'Inside insert product mapping' });
  try {
    const { category_products } = req.body;
    const { userId } = req.authPayload;
    const { product_id } = req.params;
    for await (let CategoryProduct of category_products) {
      CategoryProduct.id = uniqeNumber();
      CategoryProduct.product_id = product_id;
      CategoryProduct.created_by = userId;
      CategoryProduct.updated_by = userId;
      validateAjv(productCategorySchema.productCategory, CategoryProduct); /* Middleware Validation Schema Check */
    }
    const result = await productCatgoryController.insertProductMapping(category_products, product_id);
    log.info({ info: 'insert product mapping' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;

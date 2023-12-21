/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const productService = require('@root/src/apis/services/v1/Product');
const ProductCategoryMapping = require('@root/src/apis/services/v1/ProductCategoryMapping');
const { uniqeNumber } = require('@root/src/common/libs/ShortUniqueID/shortUniqueId');
const { INTERNAL_SERVER_ERROR, VALIDATION_ERROR } = require('../../errors/CommonError');
const { NO_PRODUCT_FOUND } = require('../../errors/ProductError');
const { amazonPresignedUrl, imageUrl } = require('../../services/v1/UploadDocuments');
const { createKey } = require('./createUniqueKey');
const moment = require('moment');
const { addProdctMappingWhileAddingProduct } = require('../../models/productCategory');
const { sanitizeString } = require('./bulkUpdateCatalog');
const productCategoryService = require('@services/v1/ProductCategoryMapping');
const { Logger: log } = require('sarvm-utility');
const syncProduct = require('@services/v1/syncProduct');
const MatereCatalogController = require('@controllers/v1/mataData/masterCatalog');
const addPartnerCatalog = require('./mataData/partnerCatalog');

const getOneProductBasedOnStatus = (item, status) => {
  log.info({ info: 'Catalog Controller :: Inside get one product based on status' });
  try {
    if (item === null || item === undefined) {
      log.warn({ warn: 'no product found' });
      throw new NO_PRODUCT_FOUND('Product not found relative to product id');
    }

    if (item.status !== status) {
      log.warn({ warn: 'no product found' });
      throw new NO_PRODUCT_FOUND('Product not found relative to product id');
    }

    return item;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const productSync = async (prodRows, userId) => {
  log.info({ info: 'Catalog Controller :: Inside Product Sync' });
  try {
    const url = await syncProduct.sync(prodRows);
    log.info({ info: `Catalog Controller :: Product Sync URL ${url}` });
    const args = {
      url,
      userId,
    };
    if (prodRows) {
      await addPartnerCatalog(args);
    } else {
      await MatereCatalogController.addCatalog(args);
    }
    return url;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const bulkInsert = async (ArrayProducts, dummyKeys) => {
  log.info({ info: 'Product Controller :: Inside bulkInsert' });
  try {
    const dummyKeysData = await productService.getProductByDummyKeys([...dummyKeys]);
    let result = [];
    if (dummyKeysData.length === dummyKeys.size) {
      log.info({ info: `Product Controller :: bulkInsert already Inserted` });
    } else if (dummyKeysData.length) {
      const filteredArr = ArrayProducts.filter(
        (obj1) => !dummyKeysData.some((obj2) => obj2.dummyKey === obj1.dummyKey),
      );
      if (filteredArr.length) {
        result = await productService.productBulkUpload(filteredArr);
      }
    } else {
      log.info({ info: `Product Controller :: bulkInsert` });
      result = await productService.productBulkUpload(ArrayProducts);
    }
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getProductWithMap = (id, map) => {
  log.info({ info: 'Catalog Controller :: Inside get product with map' });
  for (const item of map) {
    if (item.product_id == id) {
      return item;
    }
  }
  return [];
};
const productById = async (product_id) => {
  log.info({ info: 'Catalog Controller :: Inside  product by id' });
  try {
    const result = await productService.productById(product_id);
    result.max_price = parseFloat(result.max_price);
    result.min_price = parseFloat(result.min_price);
    result.mrp = parseFloat(result.mrp);
    result.tax = parseFloat(result.tax);
    result.sp = parseFloat(result.sp);
    result.max_oq = parseFloat(result.max_oq);
    result.min_ppo = parseFloat(result.min_ppo);
    result.weight_per_piece = parseFloat(result.weight_per_piece);
    result.rp = parseFloat(result.rp);
    const mappings = await productCategoryService.getProductMapping(product_id);
    result.mappings = mappings;
    const activeProduct = getOneProductBasedOnStatus(result, 'ACTIVE');
    return activeProduct;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const productLists = async (filterSearch) => {
  log.info({ info: 'Catalog Controller :: Inside product lists' });
  try {
    filterSearch = { ...filterSearch, ...getOffset(filterSearch.page, filterSearch.pageSize) };
    const { products, totalCount, count } = await productService.productLists(filterSearch);
    let productIds = [];
    if (totalCount) {
      productIds = getIdsInArray(products);
      const productMap = await ProductCategoryMapping.getAllProductMapping(productIds);
      for (const i in products) {
        let id = products[i].id;
        products[i].categoryMap = getProductWithMap(id, productMap);
      }
    }
    if (count === 0) {
      log.warn({ warn: 'no product found' });
      throw new NO_PRODUCT_FOUND('NO product available');
    }
    return { productList: products, totalCount, count };
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getOffset = (currentPage = 1, listPerPage) => {
  return { offset: (currentPage - 1) * [listPerPage], limit: parseInt(listPerPage) };
};
const getIdsInArray = (arr = []) => {
  const ids = [];
  for (const iterator of arr) {
    ids.push(iterator['id']);
  }
  return ids;
};

const createProduct = async (userId, productDetail) => {
  log.info({ info: 'Catalog Controller :: Inside create product' });
  try {
    const {
      name,
      description,
      image,
      place_of_origin,
      min_oq,
      max_oq,
      min_ppo,
      weight_per_piece,
      unit,
      rp,
      mrp,
      sp,
      return_option,
      veg,
      tax_status,
      tax,
      hsn,
      min_price,
      max_price,
      metadata,
      publish,
    } = productDetail;

    const product = {
      id: uniqeNumber(),
      dummyKey: sanitizeString(name),
      name,
      description,
      status: 'ACTIVE',
      created_by: userId,
      updated_by: null,
      image,
      place_of_origin,
      min_oq,
      max_oq,
      min_ppo,
      weight_per_piece,
      unit,
      rp,
      mrp,
      sp,
      return_option,
      veg,
      tax_status,
      tax,
      hsn,
      min_price,
      max_price,
      metadata,
      publish,
      unit,
    };
    const isProductAvailabe = await productService.getProductByName(name);
    if (isProductAvailabe && isProductAvailabe.length > 0) {
      throw new VALIDATION_ERROR('This product already exist');
    } else {
      const result = await productService.createProduct(product);
      return result;
    }
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateProductById = async (userId, product_id, productDetail) => {
  log.info({ info: 'Catalog Controller :: Inside update product by id' });
  try {
    await productById(product_id);
    const {
      name,
      description,
      image,
      place_of_origin,
      min_oq,
      max_oq,
      min_ppo,
      weight_per_piece,
      rp,
      mrp,
      sp,
      return_option,
      veg,
      tax_status,
      tax,
      hsn,
      min_price,
      max_price,
      metadata,
      publish,
      unit,
    } = productDetail;

    const product = {
      dummyKey: sanitizeString(name),
      name,
      description,
      status: 'ACTIVE',
      created_by: userId,
      updated_by: null,
      image,
      place_of_origin,
      min_oq,
      max_oq,
      min_ppo,
      weight_per_piece,
      rp,
      mrp,
      sp,
      return_option,
      veg,
      tax_status,
      tax,
      hsn,
      min_price,
      max_price,
      metadata,
      publish,
      unit,
    };

    const result = await productService.updateProductById(product_id, product);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deleteProductById = async (product_id) => {
  log.info({ info: 'Catalog Controller :: Inside delete product by id' });
  try {
    await productById(product_id);
    const result = await productService.deleteProductById(product_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const presignedUrl = async () => {
  log.info({ info: 'Catalog Controller :: Inside presigned url' });
  try {
    const key = createKey('product');
    const preSignedUrl = await amazonPresignedUrl(key);
    const url = imageUrl(key);

    const data = { preSignedUrl, url };
    return data;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  productById,
  productLists,
  createProduct,
  updateProductById,
  deleteProductById,
  presignedUrl,
  productSync,
  bulkInsert,
};

/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

// const ShopMetaData = require('@models/ShopMetaData');
const { uniqueId } = require('@root/src/common/libs/GenerateUniqueId');
const { uniqueS3Key } = require('@root/src/common/libs/JsonToS3/buildKey');
const {
  uploadRetailerDataToS3,
  getProfileJSONS3,
  getJsonUrl,
  uploadJSONtoS3,
  uploadProfileToS3,
} = require('@root/src/common/libs/JsonToS3/JsonToS3');
const ShopMetaDataService = require('./ShopMetaData');

const mongoUtil = require('../../db/mongoose');
const Shop = require('../../models/Shop');
const { OPENING_HOURS } = require('@root/src/constants/catalogProduct.js');

const { bizBaseUrl } = require('@config');

const getProduct = async (guid) => {
  log.info({ info: 'Retailer Service :: Inside get product' });
  try {
    const data = await getProfileJSONS3(`shops/${guid}`);
    const result = data ? data : null;
    return result;
  } catch (error) {
    console.log('error in get product', error);
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const uploadCatalog = async (data) => {
  log.info({ info: 'Inside upload catalog' });
  const { products, categories, user_id, shop_id } = data;

  const dataObj = { products, categories, shop_id, user_id };
  dataObj.products = products.filter((item) => item.status === 'published');

  const uniqueid = uniqueId();
  const uniqueKey = uniqueS3Key('retailer', uniqueid);

  await uploadJSONtoS3(uniqueKey, dataObj);

  const jsonURL = await getJsonUrl(uniqueKey);

  await ShopMetaDataService.addMetaData(shop_id, categories, jsonURL);
  return true;
};

const uploadV2Catalog = async (data, shop_id, guid) => {
  // const uniqueid = uniqueId();

  // const uniqueid = shop_id;
  // const uniqueKey = uniqueS3Key('retailer', uniqueid);

  const uniqueKey = uniqueS3Key('shops', guid);

  // await uploadJSONtoS3(uniqueKey, data);
  await uploadProfileToS3(uniqueKey, data);

  const jsonURL = await getJsonUrl(uniqueKey);

  let categories = data.catalog.map((item) => item.name);

  await ShopMetaDataService.addMetaData(shop_id, categories, `${jsonURL}/profile.json`);
  return true;
};

const updateProduct = async (data, retailerId, shopId) => {
  log.info({ info: 'Retailer Service :: Inside update product' });
  try {
    await Shop.findShop(shopId);
    const db = mongoUtil.getDb();
    const { products, categories } = data;

    data.user_id = retailerId;
    data.shop_id = `${shopId}`;

    const product = await getProduct(data);

    if (product === null) {
      log.warn({ warn: 'product does not exist' });
      await db.insertOne(data);
      await uploadCatalog(data, retailerId, shopId);
      return true;
    }
    const result = await db.updateOne({ shop_id: `${shopId}` }, { $set: { products, categories } });

    if (result.acknowledged) {
      await uploadCatalog(data);
      return true;
    }
    return false;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateBulkProduct = async (data, shopId) => {
  log.info({ info: 'Retailer Service :: Inside update bullk product' });
  try {
    await Shop.findShop(shopId);
    const db = mongoUtil.getDb();
    const { products, categories } = data;

    data.shop_id = `${shopId}`;

    const product = await getProduct(data);

    if (product === null) {
      log.warn({ warn: 'product does not exist' });
      await db.insertOne(data);
      await uploadCatalog(data);
      return true;
    }
    const result = await db.updateOne({ shop_id: `${shopId}` }, { $set: { products, categories } });

    if (result.acknowledged) {
      await uploadCatalog(data);
      return { success: true, message: 'Product updated successfully' };
    }
    return false;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const uploadCatalogProducts = async (catalog, shop, retailer) => {
  log.info({ info: 'Retailer Service :: Inside upload catalog products' });
  //data, retailerId, shopId, shop, retailer
  //why there is shop array
  try {
    let guid = shop.guid;
    let shopId = shop.shop_id;
    let data = shopData(catalog, shop, retailer);
    await uploadV2Catalog(data, shopId, guid);
    return true;
  } catch (error) {
    console.log(error);
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const shopData = (catalog, shop, retailer, basicInformation) => {
  shop = {
    id: shop.id,
    name: shop.shop_name,
    location: {
      address: `${shop.shop_number}${shop.locality ? `, ${shop.locality}` : ''}${
        shop.street ? `, ${shop.street}` : ''
      }${shop.landmark ? `, ${shop.landmark}` : ''}${shop.region ? `, ${shop.region}` : ''}${
        shop.city ? `, ${shop.city}` : ''
      }${shop.state ? `, ${shop.state}` : ''}`,
      pincode: shop.pincode,
      lat: shop.latitude,
      lon: shop.longitude,
    },
    openingHours: OPENING_HOURS,
    orders: '',
    rating: 'New User',
    profileUrl: `${bizBaseUrl}/shops/${shop.guid}`,
    minOrderValue: '',
  };
  retailer = {
    name: retailer.retailerData.userName,
    id: retailer._id,
    location: {
      address: retailer.retailerData.address,
      pincode: '',
      type: '',
      lat: '',
      lon: '',
    },
    tagline: '',
    about: '',
    mobileNumber: retailer.phone,
    profileImageUrl: '',
  };

  const data = {
    catalog: catalog,
    shop: shop,
    retailer: retailer,
    basicInformation: basicInformation,
  };

  return data;
};
module.exports = {
  getProduct,
  updateBulkProduct,
  // createProduct,
  uploadCatalogProducts,
  updateProduct,
  shopData,
};

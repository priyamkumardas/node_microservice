/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */

const Database = require('@root/src/apis/db/mongoose');
const mongoose = require('mongoose');
const MasterCatalog = require('@root/src/apis/MetaDataModels/catalog');
const RetailerCatalog = require('@root/src/apis/models/catalog');
const { INTERNAL_SERVER_ERROR } = require('../../../errors/CommonError');
const axios = require('axios');
const { loadBalancer, system_token } = require('@root/src/config');
const { Logger: log } = require('sarvm-utility');
const masterCatalogService = require('@services/v1/metaDataService/masterCatalog');

const getMatalog = async () => {
  try {
    const result = await masterCatalogService.getMasterCatalog();
    return result;
  } catch (error) {}
};
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
// const retailerCatalog = async (args) => {
//   let masterCat = args.master_catalog;
//   let retailerCat = args.retailer_catalog;
//   let newData = [];
//   let { categories, shop_id, user_id } = "";
//   for (const items of retailerCat) {
//     let response = await axios.get(items.url);
//     let products = response.data;
//     user_id = products.user_id
//     categories = products.categories
//     shop_id = products.shop_id
//     for (const item of products.products) {
//       item.id = await createProductMapFromCatalog(sanitizeString(item.name), masterCat)
//       newData.push(item);
//     }
//   }
//   return { products: newData, categories, shop_id, user_id };
// }
// const createProductMapFromCatalog = async (name, masterCat) => {
//   for (const items of masterCat) {
//     let response = await axios.get(items.url);
//     response = response.data;
//     for (const i in response) {
//       let subcats = response[i].subCategories;
//       for (const subCate of subcats) {
//         for (const microCat of subCate.microCategoris) {
//           for (const product of microCat.products) {
//             if (sanitizeString(product.name) == name) {
//               return product.product_id
//             }
//           }
//         }
//       }
//     }
//   }

// }

const readMasterCatalog = async (master_catalog) => {
  let masterCat = master_catalog;
  let response = '';
  for (const items of masterCat) {
    response = await axios.get(items.url);
  }
  return response.data;
};
const readRetailerCatalogs = async (retailer_catalog) => {
  let catalogData = [];
  for (const items of retailer_catalog) {
    const { shop_id, url } = items;
    const data = axios.get(url);
    catalogData.push({ shop_id, data });
  }
  const x = catalogData.map((item) => item.data);
  let newData = await Promise.all(x);
  newData = newData.map((item) => item.data);

  for (let i = 0; i < newData.length; i++) {
    catalogData[i].catalog = newData[i];
    delete catalogData[i].data;
  }
  return catalogData;
};
const createProductMapFromCatalog = async (masterCat) => {
  const map = {}; // new Map()
  const err = [];
  for (const i in masterCat) {
    let subcats = masterCat[i].subCategories;
    for (const subCate of subcats) {
      for (const microCat of subCate.microCategoris) {
        for (const product of microCat.products) {
          if (!map[sanitizeString(product.name)]) {
            map[sanitizeString(product.name)] = product.product_id;
          } else if (map[sanitizeString(product.name)] && map[sanitizeString(product.name)] !== product.product_id) {
            err.push({
              name: product.name,
              sanitizedName: sanitizeString(product.name),
            });
          }
        }
      }
    }
  }

  return { map, err };
};
const updateProductId = (product, map, err, shop_id) => {
  // for each product in retailer catalog
  const { name, id } = product;

  const updatedId = map[sanitizeString(name)];
  if (updatedId) {
    product.id = updatedId;
  } else {
    err.push({ shop_id, name });
  }
  return;
};
const updateRetailerCatalog = async () => {
  log.info({ info: 'Catalog Service :: Inside update retailer catalog' });
  let [master_catalog, retailer_catalog] = await Promise.all([
    masterCatalogService.getMasterCatalog(),
    masterCatalogService.getRetailerCatalog(),
  ]); // master catalog promis
  let masterCatalogData = await readMasterCatalog(master_catalog);
  let retailersCatalogData = await readRetailerCatalogs(retailer_catalog);

  let { map, err } = await createProductMapFromCatalog(masterCatalogData);

  let prodErr = [];
  let result = '';
  for (const items of retailersCatalogData) {
    let { categories, products, shop_id, user_id } = items.catalog;
    for (const product of products) {
      updateProductId(product, map, prodErr, shop_id);
      result = await masterCatalogService.uploadCatalog(items.catalog, shop_id);
    }
  }
  return result;
};

module.exports = {
  updateRetailerCatalog,
  getMatalog,
};

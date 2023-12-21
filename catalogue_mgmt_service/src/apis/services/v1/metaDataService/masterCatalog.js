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

const getMasterCatalog = async () => {
  log.info({ info: 'Catalog Service :: Inside get master catalog' });
  try {
    const result = await MasterCatalog.find({ active: true });
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const addMasterCatalog = async (args) => {
  log.info({ info: 'Catalog Service :: Inside add master catalog' });
  try {
    const session = mongoose.connection.startSession();

    try {
      (await session).startTransaction();
      let response = '';
      const activeMasterCatalog = await MasterCatalog.findOneAndUpdate({ active: true }, { active: false });
      if (activeMasterCatalog) {
        const { version } = activeMasterCatalog;
        const addMaterCatalog = {
          ...args,
          version: version + 1,
        };
        response = await MasterCatalog.create(addMaterCatalog);
      } else {
        response = await MasterCatalog.create(args);
      }

      (await session).commitTransaction();
      return response;
    } catch (error) {
      (await session).abortTransaction();
    } finally {
      (await session).endSession();
    }
    return result;
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
};
const getCatalogByShopId = async () => {
  try {
    log.info({ info: 'catalog services :: inside getCatalogByShopId' });
    const config = {
      method: 'get',
      url: `${loadBalancer}/rms/apis/v1/catalog`,
      headers: {
        app_name: 'retailerApp',
        app_version_code: '101',
        Authorization: `Bearer ${system_token}`,
      },
    };
    let result = await axios(config);
    result = result.data;
    return result.data;
  } catch (error) {
    log.error({ error: error });
    return error;
  }
};
const getRetailerCatalog = async () => {
  try {
    const result = await getCatalogByShopId();
    log.info({ info: result });
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const uploadRetailerUpdatedCatalog = async (args, shop_id) => {
  try {
    var data = args;
    var config = {
      method: 'post',
      url: `${loadBalancer}/rms/apis/v1/catalog/${shop_id}`,
      headers: {
        Authorization: `Bearer ${system_token}`,
      },
      data: data,
    };

    let result = await axios(config);
    result = result.data;
    return result.data;
  } catch (error) {
    log.error({ error: error });
    return error;
  }
};
const uploadCatalog = async (args, shop_id) => {
  try {
    let result = await uploadRetailerUpdatedCatalog(args, shop_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  getMasterCatalog,
  addMasterCatalog,
  getRetailerCatalog,
  uploadCatalog,
};

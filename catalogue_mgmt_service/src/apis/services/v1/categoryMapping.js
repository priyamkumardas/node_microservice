/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
const categoryMapping = require('@models/catagoryMapping');
const { INTERNAL_SERVER_ERROR } = require('../../errors/CommonError');
const { Logger: log } = require('sarvm-utility');

const getAllMapping = async () => {
  try {
    const result = await categoryMapping.getAllMapping();
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const getCategoryMapping = async (category_id) => {
  try {
    const result = await categoryMapping.getCategoryMapping(category_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const addCategoryMapping = async (args) => {
  try {
    const result = await categoryMapping.addCategoryMapping(args);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const addBulkMapping = async (args) => {
  log.info({ info: 'Catalog Service: Inside add bulk mapping' });
  try {
    const result = await categoryMapping.bulkInsertMapping(args);
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
  getCategoryMapping,
  addCategoryMapping,
  getAllMapping,
  addBulkMapping,
};

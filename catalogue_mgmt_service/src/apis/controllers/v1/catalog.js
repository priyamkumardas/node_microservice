/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const CatalogService = require('@root/src/apis/services/v1/catalog');
const { uniqeNumber } = require('@root/src/common/libs/ShortUniqueID/shortUniqueId');
const { INTERNAL_SERVER_ERROR } = require('../../errors/CommonError');
const { amazonPresignedUrl, imageUrl } = require('../../services/v1/UploadDocuments');
const { createKey } = require('./createUniqueKey');
const moment = require('moment');
const { NO_CATALOG_FOUND } = require('../../errors/CatalogError');
const { sanitizeString } = require('./bulkUpdateCatalog');
const { Logger: log } = require('sarvm-utility');
const { info } = require('@root/src/common/libs/Logger');

const getOnecatalogBasedOnStatus = (item, status) => {
  log.info({ info: 'Catalog Controller :: Inside get one catalog based on status' });
  try {
    if (item === null || item === undefined) {
      log.warn({ warn: 'catalog not found' });
      throw new NO_CATALOG_FOUND('catalog not found relative to product id');
    }

    if (item.status !== status) {
      log.warn({ warn: 'catalog not found' });
      throw new NO_CATALOG_FOUND('catalog not found relative to product id');
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
const getAllcatalogBasedOnStatus = (categories, status) => {
  log.info({ info: 'Catalog Controller :: Inside get all catalogbased on status' });
  const filteredCategories = categories.filter((item) => item.status === status);
  return filteredCategories;
};

const catalogById = async (catalog_id) => {
  log.info({ info: 'Catalog Controller :: Inside catalog by id' });
  try {
    const result = await CatalogService.catalogById(catalog_id);
    const activecatalog = getOnecatalogBasedOnStatus(result, 'ACTIVE');
    return activecatalog;
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

const catalogList = async (filterSearch) => {
  log.info({ info: 'Catalog Controller :: Inside catalog list' });
  try {
    filterSearch = { ...filterSearch, ...getOffset(filterSearch.page, filterSearch.pageSize) };
    const { catalog, totalCount, count } = await CatalogService.catalogList(filterSearch);
    const activeCatalog = getAllcatalogBasedOnStatus(catalog, 'ACTIVE');
    if (activeCatalog.legth === 0) {
      log.warn({ warn: 'No catalog found' });
      throw new NO_CATALOG_FOUND('catalog not available');
    }
    return { catalogList: activeCatalog, totalCount, count };
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const addCatalog = async (userId, args) => {
  log.info({ info: 'Catalog Controller :: Inside add catalog' });
  try {
    const { name, image, description, region, tax_status } = args;
    const catalog = {
      id: uniqeNumber(),
      dummyKey: sanitizeString(name),
      name,
      image,
      region,
      description,
      tax_status,
      status: 'ACTIVE',
      created_by: userId,
      updated_by: userId,
    };
    const result = await CatalogService.createCatalog(catalog);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateCatalogById = async (userId, catalog_id, args) => {
  log.info({ info: 'Catalog Controller :: Inside update catalog by id' });
  try {
    await catalogById(catalog_id);
    const { name, image, description, region, tax_status } = args;
    const time = moment().unix();

    const catalog = {
      name,
      image,
      region,
      description,
      tax_status,
      created_by: userId,
      updated_by: userId,
    };

    const result = await CatalogService.updatecatalogById(catalog_id, catalog);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deleteCatalogById = async (catalog_id) => {
  log.info({ info: 'Catalog Controller :: Inside delete catalog by id' });
  try {
    await catalogById(catalog_id);
    const result = await CatalogService.deletecatalogById(catalog_id);
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
    const key = createKey('catalog');
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
  addCatalog,
  catalogList,
  catalogById,
  updateCatalogById,
  deleteCatalogById,
  presignedUrl,
};

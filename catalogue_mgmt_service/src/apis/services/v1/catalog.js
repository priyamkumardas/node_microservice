/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */

const Catalog = require('@models/catalog');
const { INTERNAL_SERVER_ERROR } = require('../../errors/CommonError');
const { Logger: log } = require('sarvm-utility');

const catalogById = async (catalog_id) => {
  log.info({ info: 'Catalog Service :: Inside catalog by id' });
  try {
    const result = await Catalog.getCatalogById(catalog_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const catalogList = async (filterSearch) => {
  log.info({ info: 'Catalog Service :: Inside catalog list' });
  try {
    const result = await Catalog.catalogList(filterSearch);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const createCatalog = async (catalog) => {
  log.info({ info: 'Catalog Service :: Inside create catalog' });
  try {
    const result = await Catalog.addCatalog(catalog);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const addBulkCatalog = async (catalogs) => {
  log.info({ info: 'Catalog Service: Inside add bulk catalog' });
  try {
    const result = await Catalog.addBulkCatalog(catalogs);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updatecatalogById = async (catalog_id, catalog) => {
  log.info({ info: 'Catalog Service :: Inside update catalog by id' });
  try {
    const result = await Catalog.updateCatalog(catalog_id, catalog);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const catalogByDummykeys = async (dummyKeys) => {
  try {
    const result = await Catalog.catalogByDummyKeys(dummyKeys);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deletecatalogById = async (catalog_id) => {
  log.info({ info: 'Catalog Service :: Inside delete catalog by id' });
  try {
    const result = await Catalog.deleteCatalogById(catalog_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const catalogByIdDummyId = async (dummyId) => {
  try {
    if (dummyId) {
      const result = await Catalog.catalogByIdDummyId(dummyId);
      if (result) {
        if (result.length >= 1) {
          const { catalog_id } = result[0];
          return catalog_id;
        }
        return null;
      }
      return null;
    }
    return null;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  catalogById,
  catalogList,
  createCatalog,
  updatecatalogById,
  deletecatalogById,
  catalogByIdDummyId,
  addBulkCatalog,
  catalogByDummykeys,
};

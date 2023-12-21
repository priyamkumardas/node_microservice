/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const CategoryService = require('@root/src/apis/services/v1/Category');
const CategoryMapping = require('@services/v1/categoryMapping');
const { uniqeNumber } = require('@root/src/common/libs/ShortUniqueID/shortUniqueId');
const { NO_CATEGORY_FOUND } = require('../../errors/CategoryError');
const { INTERNAL_SERVER_ERROR } = require('../../errors/CommonError');
const { amazonPresignedUrl, imageUrl } = require('../../services/v1/UploadDocuments');
const { createKey } = require('./createUniqueKey');
const moment = require('moment');
const { catalogById } = require('./catalog');
const { sanitizeString } = require('./bulkUpdateCatalog');
const { Logger: log } = require('sarvm-utility');

const getOneCategoryBasedOnStatus = (item, status) => {
  log.info({ info: 'Catalog Controller :: Inside get one category based on status' });
  try {
    if (item === null || item === undefined) {
      log.warn({ warn: 'no category found' });
      throw new NO_CATEGORY_FOUND('category not found relative to product id');
    }

    if (item.status !== status) {
      log.warn({ warn: 'no category found' });
      throw new NO_CATEGORY_FOUND('category not found relative to product id');
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
const getAllCategoryBasedOnStatus = (categories, status) => {
  log.info({ info: 'Catalog Controller :: Inside get all category based on sttatus' });
  const filteredCategories = categories.filter((item) => item.status === status);
  return filteredCategories;
};

const categoryById = async (category_id) => {
  log.info({ info: 'Catalog Controller :: Inside category by id' });
  try {
    const result = await CategoryService.categoryById(category_id);
    const activeCategory = getOneCategoryBasedOnStatus(result, 'ACTIVE');
    return activeCategory;
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

const categoryLists = async (filterSearch) => {
  log.info({ info: 'Catalog Controller :: Inside category lists' });
  try {
    filterSearch = { ...filterSearch, ...getOffset(filterSearch.page, filterSearch.pageSize) };
    const { categories, totalCount, count } = await CategoryService.categoryLists(filterSearch);
    const activeCategories = getAllCategoryBasedOnStatus(categories, 'ACTIVE');
    if (activeCategories.legth === 0) {
      throw new NO_CATEGORY_FOUND('category not available');
    }
    return { categoryList: activeCategories, totalCount, count };
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const createCategory = async (userId, args) => {
  log.info({ info: 'Catalog Controller :: Inside create category' });
  try {
    const { name, image, description, tax_status, tax_slab, region } = args;
    const category = {
      id: uniqeNumber(),
      dummyKey: sanitizeString(`${name}`),
      name,
      image,
      region,
      description,
      tax_slab,
      status: 'ACTIVE',
      tax_status,
      created_by: userId,
      updated_by: userId,
    };
    const result = await CategoryService.createCategory(category);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateCategoryById = async (userId, category_id, args) => {
  log.info({ info: 'Catalog Controller :: Inside update category by id' });
  try {
    const { name, image, description, tax_status, tax_slab, region } = args;

    const time = moment().unix();

    const category = {
      name,
      image,
      region,
      description,
      tax_slab,
      tax_status,
      updated_by: userId,
    };

    const result = await CategoryService.updateCategoryById(category_id, category);

    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deleteCategoryById = async (category_id) => {
  log.info({ info: 'Catalog Controller :: Inside delete category by id' });
  try {
    await categoryById(category_id);
    const result = await CategoryService.deleteCategoryById(category_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const createMapping = async (category_id, categories) => {
  log.info({ info: 'Catalog Controller :: Inside create mapping' });
  try {
    for (const i in categories) {
      categories[i].id = uniqeNumber();
      categories[i].category_id = category_id;
    }
    const result = await CategoryService.createCategoryMapping(category_id, categories);
    return result;
  } catch (error) {
    console.log(error);
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
    const key = createKey('category');
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

const getDataTree = async () => {
  log.info({ info: 'Catalog Controller :: Inside get data tree' });
  try {
    const result = await CategoryService.getDataTree();
    return result;
  } catch (error) {
    console.log(error);
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  categoryById,
  categoryLists,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  presignedUrl,
  getDataTree,
  createMapping,
};

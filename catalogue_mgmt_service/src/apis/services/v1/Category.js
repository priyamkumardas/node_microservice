/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */

const Category = require('@models/category');
const catagoryMapping = require('@models/catagoryMapping');
const { INTERNAL_SERVER_ERROR } = require('../../errors/CommonError');
const { Logger: log } = require('sarvm-utility');

const categoryById = async (category_id) => {
  log.info({ info: 'Catalog Service :: Inside category by id' });
  try {
    const result = await Category.getCategoryById(category_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const categoryByDummyKeys = async (dummyKeys) => {
  try {
    const result = await Category.categorysByDummyKeys(dummyKeys);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const categoryLists = async (filterSearch) => {
  log.info({ info: 'Catalog Service :: Inside category lists' });
  try {
    const result = await Category.getCategories(filterSearch);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const createCategory = async (category) => {
  log.info({ info: 'Catalog Service :: Inside create category' });
  try {
    const result = await Category.addCategory(category);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const updateCategoryById = async (category_id, category) => {
  log.info({ info: 'Catalog Service :: Inside update category by id' });
  try {
    const result = await Category.updateCategory(category_id, category);
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
  log.info({ info: 'Catalog Service :: Inside delete category by id' });
  try {
    const result = await Category.deleteCategoryById(category_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const createCategoryMapping = async (category_id, args) => {
  log.info({ info: 'Catalog Service :: Inside create category mapping' });
  try {
    const result = await catagoryMapping.updateCategoryMapping(category_id, args);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const categeriesByCatalogID = async (catalog_id) => {
  log.info({ info: 'Catalog Service :: Inside categories by catalog id' });
  try {
    const result = await Category.categoriesByCatalogId(catalog_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const categeriesByParentID = async (parent_id) => {
  log.info({ info: 'Catalog Service :: Inside categories by parent id' });
  try {
    const result = await Category.categoriesByParentId(parent_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateCatalogIdByCategoryIds = async (catalogCategoryMapping) => {
  try {
    const result = await Category.updateCategoryByCategoryIdAndCatalogId(catalogCategoryMapping);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateMicroCategoryIdByCategoryIds = async (categoryMicroCategoryMapping) => {
  try {
    const result = await Category.updateCategoryMicroCategoryMapping(categoryMicroCategoryMapping);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const categeriesByDummyId = async (dummyKey) => {
  try {
    if (dummyKey) {
      const result = await Category.categeriesByDummyId(dummyKey);
      if (result) {
        if (result.length >= 1) {
          const { category_id } = result[0];
          return category_id;
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

const getDataTree = async (dummyKey) => {
  log.info({ info: 'Catalog Service :: Inside get data tree' });
  try {
    let url = 'https://uat-static.sarvm.ai/catalogue_tree/data.json';
    const result = url;
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
  categoryById,
  categoryLists,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  categeriesByCatalogID,
  categeriesByParentID,
  categeriesByDummyId,
  categoryByDummyKeys,
  updateCatalogIdByCategoryIds,
  updateMicroCategoryIdByCategoryIds,
  createCategoryMapping,
  getDataTree,
};

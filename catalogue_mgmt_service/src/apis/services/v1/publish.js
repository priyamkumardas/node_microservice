const Category = require('@models/category');
const { INTERNAL_SERVER_ERROR } = require('../../errors/CommonError');

const categories = async () => {
  try {
    const categoryList = await Category.category();
    return categoryList;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const subCategory = async (parent_id) => {
  try {
    const categoryList = await Category.subCategory(parent_id);
    return categoryList;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = { categories, subCategory };

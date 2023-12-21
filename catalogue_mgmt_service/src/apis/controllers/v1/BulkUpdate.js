const CatalogService = require('@root/src/apis/services/v1/catalog');
const CategoryService = require('@root/src/apis/services/v1/Category');
const categoryMapping = require('@root/src/apis/services/v1/categoryMapping');
const productMapping = require('@root/src/apis/services/v1/ProductCategoryMapping');
const productService = require('@root/src/apis/services/v1/Product');

const { loadCategoryData } = require('./bulkUpdateCatalog');
const { INTERNAL_SERVER_ERROR } = require('../../errors');
const { Logger: log } = require('sarvm-utility');

const bulkUpdate = async (fileLocation) => {
  log.info({ info: 'Catalog Controller :: Inside bulk update' });
  try {
    const data = await loadCategoryData(fileLocation);
    const { catalog, category, product, categoryMappingArray, categoryProduct } = data;

    // ---- === Catalog bulk insertion
    try {
      await CatalogService.addBulkCatalog(catalog);
    } catch (error) {
      log.error({ error: error });
    }

    // ----- ===== Category bulk insert
    try {
      await CategoryService.createCategory(category);
    } catch (error) {
      log.error({ error: error });
    }

    // ---- ==== Product bulk insert
    try {
      await productService.productBulkUpload(product);
    } catch (error) {
      log.error({ error: error });
    }

    // ----- ===== Category Map bulk insert
    try {
      await categoryMapping.addBulkMapping(categoryMappingArray);
    } catch (error) {
      log.error({ error: error });
    }

    // --- === Product Map bulk insert
    try {
      await productMapping.addBulkProductMap(categoryProduct);
    } catch (error) {
      log.error({ error: error });
    }

    return {
      lengths: {
        catalog: `total ${catalog.length} catalog inserted.`,
        category: `total ${category.length} category inserted.`,
        product: `total ${product.length} product inserted.`,
        categoryMappingArray: `total ${categoryMappingArray.length} categoryMappingArray inserted.`,
        categoryProduct: `total ${categoryProduct.length} categoryProduct inserted.`,
      },
      msg: 'All data uploaded successfully',
    };
  } catch (error) {
    log.error({ error: error });
    throw new INTERNAL_SERVER_ERROR(error);
  }
};

module.exports = { bulkUpdate };

const retailerCatalogUpdate = require('@services/v1/metaDataService/retailerCatalogUpdate');
const { Logger: log } = require('sarvm-utility');

const updateRetailerCatalog = async () => {
  log.info({ info: 'Catalog Controller :: Inside update retailer catalog' });
  try {
    const result = await retailerCatalogUpdate.updateRetailerCatalog();
    return result;
  } catch (error) {
    log.error({ error: error });
    return error;
  }
};

module.exports = { updateRetailerCatalog };

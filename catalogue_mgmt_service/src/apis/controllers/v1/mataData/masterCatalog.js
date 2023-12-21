const { uniqeNumber } = require('@root/src/common/libs/ShortUniqueID/shortUniqueId');
const masterCatalogService = require('@services/v1/metaDataService/masterCatalog');
const moment = require('moment');
const axios = require('axios');
const { Logger: log } = require('sarvm-utility');

const addCatalog = async (args) => {
  log.info({ info: 'Catalog Controller :: Inside add catalog' });
  try {
    const { url, userId } = args;
    const time = moment().unix();
    const addCatalog = {
      id: uniqeNumber(),
      url,
      active: true,
      created_by: userId,
      updated_by: userId,
      created_at: time,
      updated_at: time,
    };

    const result = await masterCatalogService.addMasterCatalog(addCatalog);
    return result;
  } catch (error) {}
};
const getMasterCatalog = async () => {
  log.info({ info: 'Catalog Controller :: Inside get master catalog' });
  try {
    const result = await masterCatalogService.getMasterCatalog();
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = { addCatalog, getMasterCatalog };

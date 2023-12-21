/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */

const MasterCatalog = require('@root/src/apis/MetaDataModels/catalog');
const { INTERNAL_SERVER_ERROR } = require('../../../errors/CommonError');

const getMasterCatalog = async () => {
  try {
    const result = await MasterCatalog.getMetaCatalog();
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
};

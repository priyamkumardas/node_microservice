const LanguageMetaDataService = require('@services/v1/metaDataService/languageMetaDataService');

const addLanguageMetaData = async () => {
  try {
    const result = await LanguageMetaDataService.addLanguageMetaData();
    return result;
  } catch (error) {}
};

const getLanguageMetaData = async () => {
  try {
    const result = await LanguageMetaDataService.getLanguageMetaData();
    return result;
  } catch (error) {}
};

module.exports = { addLanguageMetaData, getLanguageMetaData };

const express = require('express');

const router = express.Router();

const { HttpResponseHandler } = require('sarvm-utility');
const LanguageMetDataController = require('@controllers/v1/mataData/languageMetaDataController');
router.get('/', async (req, res, next) => {
  try {
    const result = await LanguageMetDataController.getLanguageMetaData();
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { url } = req.body;
    const { userId } = req.authPayload;
    const args = {
      url,
      userId,
    };
    const result = await LanguageMetDataController.addLanguageMetaData(args);

    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

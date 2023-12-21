/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const express = require('express');
// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const bulkUpdate = require('@controllers/v1/BulkUpdate');
const multer = require('multer');
var filessystem = require('fs');

try {
  filessystem.mkdirSync('./uploads');
} catch (e) {
  if (e.code != 'EEXIST') throw e;
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, 'catalog' + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  },
});
const upload = multer({
  //multer settings
  storage: storage,
});

function validate(req, res, next) {
  if (!req.file) {
    return res.send({
      errors: {
        message: 'file cant be empty',
      },
    });
  }
  next();
}

const router = express.Router();

router.post('/', upload.single('file'), validate, async (req, res, next) => {
  log.info({ info: 'Inside bulk update' });
  try {
    const fileLocation = req.file.path;
    const result = await bulkUpdate.bulkUpdate(fileLocation);
    log.info({ info: 'bulk update' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;

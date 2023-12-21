const joi = require('joi');
const HttpResponseHandler = require('../HttpResponseHandler');
const validation = (schema, property) => {


    return (req, res, next) => {

        const { error } = schema.validate(req.body);
        const valid = error == null;

        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            HttpResponseHandler.error(req, res, message, 422);
        }
    }
}
module.exports = validation;
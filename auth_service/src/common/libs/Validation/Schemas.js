const joi = require('joi');

const userSchema = joi.object({
  fullName: joi.string().alphanum().min(3).max(25).trim(true).required(),
  email: joi.string().email().trim(true).required(),
  mobile: joi
    .string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  city: joi.string().alphanum().max(25).trim(true).required(),
});

module.exports = { userSchema };

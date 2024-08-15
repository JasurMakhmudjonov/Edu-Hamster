const Joi = require("joi");

const updateUserSchema = Joi.object({
  fullname: Joi.string(),
  username: Joi.string(),
  password: Joi.string(),
  profileImge: Joi.string(),
});

const updateUserSchemaByAdmin = Joi.object({
  fullname: Joi.string(),
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  referralcode: Joi.string(),
  totalCoins: Joi.number(),
  level: Joi.number(),
  points: Joi.number(),
  isAdmin: Joi.boolean(),
});

module.exports = { updateUserSchema, updateUserSchemaByAdmin };

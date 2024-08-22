const Joi = require("joi");

const createEICSchema = Joi.object({
  name: Joi.string().required(),
});

const updateEICSchema = Joi.object({
  name: Joi.string(),
});


module.exports = {
  createEICSchema,
  updateEICSchema,
};

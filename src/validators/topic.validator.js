const Joi = require("joi");

const createTopicSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.string().required(),
});

const updateTopicSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  categoryId: Joi.string(),
});

module.exports = {
  createTopicSchema,
  updateTopicSchema,
 };

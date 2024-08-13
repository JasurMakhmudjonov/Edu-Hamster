const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  rewardCoins: Joi.number().required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  rewardCoins: Joi.number(),
});

module.exports = { createTaskSchema, updateTaskSchema };

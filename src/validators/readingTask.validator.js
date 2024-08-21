const Joi = require("joi");

const createReadingTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  content: Joi.string().required(),
  timeLimit: Joi.number().required(),
  rewardCoins: Joi.number().required(),
  topicId: Joi.string().uuid().required(),
});
const updateReadingTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  content: Joi.string(),
  timeLimit: Joi.number(),
  rewardCoins: Joi.number(),
  topicId: Joi.string().uuid(),
});

module.exports = { createReadingTaskSchema, updateReadingTaskSchema };

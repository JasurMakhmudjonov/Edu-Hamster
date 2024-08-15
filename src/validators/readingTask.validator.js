const Joi = require("joi");

const createReadingTaskSchema = Joi.object({
  taskId: Joi.string().uuid().required(),
  content: Joi.string().required(),
  duration: Joi.number().min(1).required(),
});
const updateReadingTaskSchema = Joi.object({
  taskId: Joi.string().uuid(),
  content: Joi.string(),
  duration: Joi.number().min(1),
});

module.exports = { createReadingTaskSchema, updateReadingTaskSchema };

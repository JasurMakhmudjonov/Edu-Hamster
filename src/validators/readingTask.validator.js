const Joi = require("joi");

const createReadingTaskSchema = Joi.object({
  taskId: Joi.string().uuid().required(),
  content: Joi.string().required(),
  duration: Joi.number().min(1).required(),
  status: Joi.string()
    .valid("PENDING", "COMPLETED", "FAILED")
    .default("PENDING"),
});

const updateReadingTaskSchema = Joi.object({
  taskId: Joi.string().uuid(),
  content: Joi.string(),
  duration: Joi.number().min(1),
  status: Joi.string().valid("PENDING", "COMPLETED", "FAILED"),
});

module.exports = { createReadingTaskSchema, updateReadingTaskSchema };

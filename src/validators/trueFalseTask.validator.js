const Joi = require('joi');

const createTFTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  questions: Joi.array().items(Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
  })).required(),
  correctAnswers: Joi.array().items(Joi.boolean()).required(),
  timeLimit: Joi.number().integer().min(0).required(),
  rewardCoins: Joi.number().integer().min(0).required(),
  topicId: Joi.string().required()
});

const updateTFTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(null),
  questions: Joi.array().items(Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
  })).optional(),
  correctAnswers: Joi.array().items(Joi.boolean()).optional(),
  timeLimit: Joi.number().integer().min(0).optional(),
  rewardCoins: Joi.number().integer().min(0).optional(),
  topicId: Joi.string().guid({ version: ['uuidv4'] }).optional()
});

module.exports = {
  createTFTaskSchema,
  updateTFTaskSchema
};

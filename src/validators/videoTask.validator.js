const Joi = require("joi");

const createVideoTaskSchema = Joi.object({
  title: Joi.string().required().min(3).max(64),
  description: Joi.string().optional().max(1000),
  videoUrl: Joi.string().uri().required(),
  videoDuration: Joi.number().integer().positive().min(0).required(),
  rewardCoins: Joi.number().integer().positive().min(0).required(),
  topicId: Joi.string().uuid().required(),
});

const updateVideoTaskSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().optional().allow(null, "").max(1000),
  videoUrl: Joi.string().uri().optional(),
  videoDuration: Joi.number().integer().positive().optional(),
  rewardCoins: Joi.number().integer().positive().optional(),
  topicId: Joi.string().uuid().optional(),
});

module.exports = {
  createVideoTaskSchema,
  updateVideoTaskSchema,
};

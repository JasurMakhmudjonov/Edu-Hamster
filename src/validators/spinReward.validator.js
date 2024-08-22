const Joi = require("joi");

const createSpinRewardSchema = Joi.object({
  rewardCoins: Joi.number().min(0).required(),
});

const updateSpinRewardSchema = Joi.object({
  rewardCoins: Joi.number().min(0),
});

module.exports = {
  createSpinRewardSchema,
  updateSpinRewardSchema,
};
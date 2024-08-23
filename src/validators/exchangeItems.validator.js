const Joi = require("joi");

const createExchangeItemSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  coinPrice: Joi.number().required(),
  categoryId: Joi.string().required(),
});

const updateExchangeItemSchema = Joi.object({
  title: Joi.string().min(3),
  description: Joi.string().min(5),
  coinPrice: Joi.number(),
  categoryId: Joi.string(),
});



module.exports = {
  createExchangeItemSchema,
  updateExchangeItemSchema,
};

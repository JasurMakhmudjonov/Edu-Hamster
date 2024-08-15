const Joi = require("joi");

const createTopicCategorySchema = Joi.object({
  name: Joi.string().required().max(30).min(5),
});


const updateTopicCategorySchema = Joi.object({
    name: Joi.string().max(30).min(5),
  });

module.exports = {
    createTopicCategorySchema,
    updateTopicCategorySchema,
};

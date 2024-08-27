const Joi = require("joi");

const createQuizSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  rewardCoins: Joi.number().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        options: Joi.array().items(Joi.string().required()).min(2).required(),
      }).required()
    )
    .min(1)
    .required(),
  correctAnswers: Joi.array()
    .items(Joi.number().integer().min(0).required())
    .required(),
  timeLimit: Joi.number().integer().min(1).required(),
  topicId: Joi.string().uuid().required(),
});

const updateQuizSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  rewardCoins: Joi.number(),
  questions: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        options: Joi.array().items(Joi.string().required()).min(2).required(),
      }).required()
    )
    .min(1),
  correctAnswers: Joi.array().items(Joi.number().integer().min(0).required()),
  timeLimit: Joi.number().integer().min(1),
  topicId: Joi.string(),
});

const submitQuizSchema = Joi.object({
  userAnswers: Joi.array()
    .items(Joi.number().integer().min(0).required())
    .required(),
});

module.exports = {
  createQuizSchema,
  updateQuizSchema,
  submitQuizSchema,
};

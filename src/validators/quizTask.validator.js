const Joi = require("joi");

const createQuizSchema = Joi.object({
  taskId: Joi.string().uuid().required(),
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
    .length(Joi.ref("questions.length"))
    .required(),
  timeLimit: Joi.number().integer().min(1).required(),
});

const updateQuizSchema = Joi.object({
  taskId: Joi.string().uuid(),
  questions: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      options: Joi.array().items(Joi.string().required()).min(2).required(),
    }).required()
  ),
  correctAnswers: Joi.array()
    .items(Joi.number().integer().min(0).required())
    .length(Joi.ref("questions.length")),
  timeLimit: Joi.number().integer().min(1),
});

const submitQuizSchema = Joi.object({
  userAnswers: Joi.array()
    .items(Joi.number().integer().min(0).required())
    .length(Joi.ref("questions.length"))
    .required(),
});

module.exports = {
  createQuizSchema,
  updateQuizSchema,
  submitQuizSchema,
};

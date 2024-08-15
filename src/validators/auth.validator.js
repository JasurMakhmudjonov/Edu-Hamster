const Joi = require("joi");

const registerSchema = Joi.object({
  fullname: Joi.string().min(4).max(50).required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(15).required(),
});

const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().min(6).max(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(15).required(),
});

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(15).required(),
})

module.exports = { registerSchema, verifySchema, loginSchema , adminLoginSchema};

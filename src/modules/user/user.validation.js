import Joi from "joi";
// signup validation
export const signupValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][a-z0-9A-Z]{8,40}$/)
    .required(),
});
// signin validation
export const signinValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][a-z0-9A-Z]{8,40}$/)
    .required(),
});
//update validation
export const updateValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().pattern(/^[A-Z][a-z0-9A-Z]{8,40}$/),
});

export const otpValidation = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

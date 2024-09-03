import Joi from "joi"

export const userSchemaCreate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  avatar: Joi.optional()
})

export const userSchemaUpdate = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  avatar: Joi.optional()
})
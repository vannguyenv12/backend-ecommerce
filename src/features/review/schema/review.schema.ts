import Joi from "joi"

export const reviewSchemaCreate = Joi.object({
  productId: Joi.number().required(),
  rating: Joi.number().required(),
  comment: Joi.string().required(),
})

export const reviewSchemaUpdate = Joi.object({
  rating: Joi.number().required(),
  comment: Joi.string().required(),
})
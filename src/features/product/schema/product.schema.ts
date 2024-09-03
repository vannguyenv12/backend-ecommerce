import Joi from "joi"

export const productSchema = Joi.object({
  name: Joi.string().required(),
  longDescription: Joi.string().required(),
  shortDescription: Joi.string().required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().required(),
  main_image: Joi.string().required(),
  categoryId: Joi.number().integer().required(),
})
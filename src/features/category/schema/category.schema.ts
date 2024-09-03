import Joi from "joi"

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().required(),
})
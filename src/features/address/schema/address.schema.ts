import Joi from "joi"

export const addressSchema = Joi.object({
  street: Joi.string().required(),
  province: Joi.string().optional(),
  country: Joi.string().required(),
  postalCode: Joi.number().integer().required(),
})
import Joi from "joi"

export const couponSchema = Joi.object({
  code: Joi.string().required(),
  discountPrice: Joi.number().integer().required(),
  discountType: Joi.string().optional()
})

export const couponUpdateSchema = Joi.object({
  discountPrice: Joi.number().integer().required(),
  discountType: Joi.string().optional()
})
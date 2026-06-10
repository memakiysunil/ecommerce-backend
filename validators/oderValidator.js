const Joi = require('joi');

const createOrderValidation = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    addressLine: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
    country: Joi.string().required()
  }).required(),

  paymentMethod: Joi.string()
    .valid('COD', 'UPI', 'CARD')
    .required()
    .messages({
      'any.only': 'Payment method must be COD, UPI or CARD'
    })
});

module.exports = {createOrderValidation};
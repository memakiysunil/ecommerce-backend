const joi = require('joi');

const addtocartSchema =  joi.object({
    quantity: joi.number().integer().min(1).default(1)
    .messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1'
    })
});

const updatecartSchema = joi.object({
    quantity: joi.number().integer().min(1)
    .messages({
         'number.base': 'Quantity must be a number',
         'number.integer': 'Quantity must be an integer',
         'number.min': 'Quantity must be at least 1'
    })
});


module.exports = {addtocartSchema, updatecartSchema};
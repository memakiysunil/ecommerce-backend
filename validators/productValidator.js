const joi = require('joi');

const singleproductSchema = joi.object({
    name: joi.string().trim().required(),

    description: joi.string().trim().required(),

    price: joi.number().positive().required(),

    category: joi.string().trim().required(),

    brand: joi.string().trim().required(),

    stock: joi.number().integer().min(0).default(0),

    Image: joi.string().optional()
});


const createManyProductsSchema = joi.array().items(
    joi.object({
        name: joi.string().trim().required(),

        description: joi.string().trim().required(),

        price: joi.number().positive().required(),

        category: joi.string().trim().required(),

        brand: joi.string().trim().required(),

        stock: joi.number().integer().min(0).default(0),

        Image: joi.string().optional()
    })
).min(1);


const updateproductSchema = joi.object({
    name: joi.string().trim().required(),

    description: joi.string().trim().required(),

    price: joi.number().positive().required(),

    category: joi.string().trim().required(),

    brand: joi.string().trim().required(),

    stock: joi.number().integer().min(0),

    Image: joi.string().optional()
}).min(1);


const searchproductsSchema = joi.object({
    keyword: joi.string().trim(),

    category: joi.string().trim(),

    minPrice: joi.number().min(0),

    maxPrice: joi.number().min(0),

    page: joi.number().integer().min(1).default(1),

    limit: joi.number().integer().min(1).max(100).default(100)
});

module.exports = {singleproductSchema, createManyProductsSchema, updateproductSchema, searchproductsSchema};
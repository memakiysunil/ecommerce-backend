const joi = require('joi');

const signup = joi.object({
    name: joi.string().min(2).max(50).required()
    .messages({'string.empty': 'Name cannot be empty' }),

    email: joi.string().email().required()
    .messages({'string.email': 'Please enter a valid email'}),

    password: joi.string().min(6).required()
    .messages({ 'string.min': 'Password must be at least 6 characters' }),

    role: joi.string().valid('user','admin').default('user')
});

const login = joi.object({
    email: joi.string().email().required()
    .messages({
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty'
    }),

    password: joi.string().required()
    .messages({
        'any.required': 'Password is required',
        'string.empty': 'Password is required'
    })
});

const updatePassword = joi.object({
    currentPassword: joi.string().required()
    .messages({
        'any.required': 'Current password is required',
        'string.empty': 'Current password cannot be empty'
    }),

    newPassword: joi.string().min(6).required()
    .messages({
        'any.required': 'New password is required',
        'string.empty': 'New password cannot be empty',
        'string.min': 'New password must be at least 6 characters'

    })
});

module.exports = {signup, login, updatePassword};
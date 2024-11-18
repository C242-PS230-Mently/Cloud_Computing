import Joi from 'joi';
// Joi for validate user input
export const joiRegister = Joi.object({
    full_name: Joi.string().min(5).required()
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
        'string.pattern.base': 'Please enter a valid name   ', 
        'string.empty': 'Full name is required',
        'string.min': 'Full name should have at least 5 characters'
        
        
    }),
    email: Joi.string().email().required()
    .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address'
    }),
    age: Joi.number().integer().required()
    .messages({
        'number.base': 'Please enter a valid number for age',
        'any.required': 'Please enter your age'
    }) ,
    gender: Joi.string().valid('Laki Laki','Perempuan').required()
    .messages({
        'any.required': 'Gender is required'
    }) ,      
    password: Joi.string().min(6).required()
    .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should have at least 6 characters'
    }),
    confpassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({
        'any.only': 'Password and confirm password do not match',
    }),
});

export const joiLogin = Joi.object({
    email: Joi.string().email().required()
    .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address'
    }),
    password: Joi.string().min(6).required()
    .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should have at least 6 characters'
    }),
});
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
    username: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must have at least 3 characters',
        'string.max': 'Username must not exceed 50 characters'
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
});

export const joiLogin = Joi.object({
    identifier: Joi.string().required().messages({
        'string.empty': 'Email or username is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should have at least 6 characters',
    }),
});

export const editPass = Joi.object({
    password: Joi.string().min(6).required()
    .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should have at least 6 characters'
    }),
})

export const joiEdit = Joi.object({
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
    username: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must have at least 3 characters',
        'string.max': 'Username must not exceed 50 characters'
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
});

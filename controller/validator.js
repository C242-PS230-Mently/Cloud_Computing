import Joi from 'joi';
// Joi for validate user input
export const joiRegister = Joi.object({
    full_name: Joi.string().min(5).required()
    .messages({
        'string.empty': 'Full name is required',
        'string.min': 'Full name should have at least 5 characters'
        
        
    }),
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
const joi = require('joi');

const validateRequest = (schema , property = 'body') => {
    return (req, res, next) => {
        const{error, value} = schema.validate(req[property],
        {
            abortEarly: false,
            stripUnknown: true
        }
        );

        if(error){
            const errorMessage = error.details.map(d => d.message);
            const err = new Error(errorMessage.join(', '));
            err.statusCode = 400;
            return next(err);
        }
        req[property] = value;
        next();
    }
};

module.exports = validateRequest;
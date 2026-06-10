const ratlimit = require('express-rate-limit');

const globalLimite = ratlimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10000,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message:  'Too many requests, please try again after 24 hours'
        });
    }
});

const strictLimiter = ratlimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req, res) => `stric${req.user?.id}`,
    
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Only 3 requests allowed per 24 hours!'
        });
    }

});

module.exports = {globalLimite, strictLimiter};
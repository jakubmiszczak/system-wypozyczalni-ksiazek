const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                throw new Error('Authentication required');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!allowedRoles.includes(decoded.role)) {
                throw new Error('Insufficient permissions');
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ 
                error: error.message || 'Authentication failed'
            });
        }
    };
};

module.exports = auth; 
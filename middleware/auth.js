const jwt = require('jsonwebtoken');
const dbConfig = require('../config/db_config.json');

const { JWT_SECRET } = dbConfig[process.env.NODE_ENV || 'development'];


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');

module.exports = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('No token provided.');

    try {
        const decoded = jwt.verify(token, 'jwt_secret');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).send('Invalid token.');
    }
};

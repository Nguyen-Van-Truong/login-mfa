const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token không được cung cấp.' });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ.' });
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };

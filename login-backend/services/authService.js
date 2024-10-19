// login-backend\services\authService.js
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'access-secret';  
const REFRESH_TOKEN_SECRET = 'refresh-secret';

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '5s' }); 
}

function generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '50s' });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
};

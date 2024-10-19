// login-backend\controllers\mfaController.js
const { refreshTokens } = require('../config/tokens');
const { generateAccessToken, generateRefreshToken } = require('../services/authService');
const users = require('../data/users');


function handleVerifyMfa(req, res) {
    const { mfaCode, email } = req.body;
    const user = users[email];

    if (!user) {
        return res.status(400).json({ message: 'Người dùng không tồn tại.' });
    }

    if (user.mfaCode && user.mfaCode == mfaCode) {
        const accessToken = generateAccessToken({ username: email });
        const refreshToken = generateRefreshToken({ username: email });

        // Lưu refresh token vào danh sách
        refreshTokens.push(refreshToken);

        res.json({ accessToken, refreshToken });
    } else {
        res.status(401).json({ message: 'Mã MFA không hợp lệ.' });
    }
}

module.exports = { handleVerifyMfa };

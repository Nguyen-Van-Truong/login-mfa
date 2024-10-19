const { sendMfaEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');
const users = require('../data/users');

const { refreshTokens } = require('../config/tokens');
const { generateAccessToken, generateRefreshToken } = require('../services/authService');

const REFRESH_TOKEN_SECRET = 'refresh-secret';


function handleLogin(req, res) {
    const { username, password } = req.body;
    const user = users[username];

    if (user && user.password === password) {
        const mfaCode = Math.floor(100000 + Math.random() * 900000);
        users[username].mfaCode = mfaCode;

        console.log(`ma: ` + mfaCode);
        res.json({ message: 'Đăng nhập thành công. Mã MFA sẽ được gửi đến email của bạn.' });

        // Gửi email trong nền (không chờ đợi)
        setImmediate(() => sendMfaEmail(username, mfaCode, user.name));
    } else {
        res.status(401).json({ message: 'Tên người dùng hoặc mật khẩu không chính xác.' });
    }
}

function handleRegister(req, res) {
    const { email, name, password } = req.body;

    if (users[email]) {
        return res.status(400).json({ message: 'Người dùng đã tồn tại.' });
    }

    users[email] = { password, name, secret: '' };
    res.json({ message: 'Đăng ký thành công.' });
}

function handleTokenRefresh(req, res) {
    const { token } = req.body;

    console.log("Received token:", token);
    console.log("Stored refreshTokens array:", refreshTokens);

    // Kiểm tra token có trong danh sách hay không
    if (!token || !refreshTokens.includes(token)) {
        console.error("Token không tồn tại trong danh sách.");
        return res.status(403).json({ message: 'Token không hợp lệ.' });
    }

    // Kiểm tra tính hợp lệ của token
    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Lỗi xác minh JWT:", err);
            return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        console.log("Xác minh JWT thành công cho user:", user);

        const accessToken = generateAccessToken({ username: user.username });
        res.json({ accessToken });
    });
}

function handleLogout(req, res) {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.json({ message: 'Đăng xuất thành công.' });
}

module.exports = {
    handleLogin,
    handleRegister,
    handleTokenRefresh,
    handleLogout
};

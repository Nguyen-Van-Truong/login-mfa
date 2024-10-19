const users = require('../data/users');

function handleProfile(req, res) {
    const user = users[req.user.username];

    if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    res.json({ email: req.user.username, name: user.name });
}

module.exports = { handleProfile };

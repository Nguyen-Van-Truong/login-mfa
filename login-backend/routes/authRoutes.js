const express = require('express');
const { handleLogin, handleTokenRefresh, handleLogout, handleRegister } = require('../controllers/authController');

const router = express.Router();

router.post('/login', handleLogin);
router.post('/register', handleRegister);
router.post('/token', handleTokenRefresh);
router.post('/logout', handleLogout);

module.exports = router;

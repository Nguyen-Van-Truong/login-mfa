const express = require('express');
const { handleProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authenticateToken, handleProfile);

module.exports = router;

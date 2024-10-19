const express = require('express');
const { handleVerifyMfa } = require('../controllers/mfaController');

const router = express.Router();

router.post('/verify-mfa', handleVerifyMfa);

module.exports = router;

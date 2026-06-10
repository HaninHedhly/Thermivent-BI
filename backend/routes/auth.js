const express = require('express');
const router = express.Router();
const { login, getMe, updateMe } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', proteger, getMe);
router.put('/me', proteger, updateMe);

module.exports = router;
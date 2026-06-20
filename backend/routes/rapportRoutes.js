const express = require('express');
const router  = express.Router();
const { proteger } = require('../middleware/auth');
const {
  getRapports,
  getRapportByType,
} = require('../controllers/rapportController');

router.get('/', proteger, getRapports);


module.exports = router; 
const express = require('express');
const router  = express.Router();
const { proteger } = require('../middleware/auth');
const {
  getDashboards,
  getDashboardByType,
} = require('../controllers/dashboardController');

router.get('/:type', proteger, getDashboardByType);


module.exports = router; 
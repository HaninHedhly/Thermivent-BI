const express = require('express');
const router  = express.Router();
const { proteger } = require('../middleware/auth');
const {
  getDashboards,
  getDashboardByType,
} = require('../controllers/dashboardController');

// GET  /api/dashboards         → tous les dashboards autorisés
// GET  /api/dashboards/:type   → un dashboard par type (Ventes, Achats, Stock, Production)

router.get('/',      proteger, getDashboards);
router.get('/:type', proteger, getDashboardByType);


module.exports = router; 
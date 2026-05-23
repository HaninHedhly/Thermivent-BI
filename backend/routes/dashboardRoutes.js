const express = require('express');
const router  = express.Router();
const { proteger } = require('../middleware/auth');
const {
  getDashboards,
  getDashboardByType,
  updateDashboard,
} = require('../controllers/dashboardController');

// GET  /api/dashboards         → tous les dashboards autorisés
// GET  /api/dashboards/:type   → un dashboard par type (Ventes, Achats, Stock, Production)
// PUT  /api/dashboards/:type   → modifier un dashboard (Admin)
router.get('/',      proteger, getDashboards);
router.get('/:type', proteger, getDashboardByType);
router.put('/:type', proteger, updateDashboard);

module.exports = router;
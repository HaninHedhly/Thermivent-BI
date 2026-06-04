const express = require('express');
const router  = express.Router();
const { proteger } = require('../middleware/auth');
const {
  getRapports,
  getRapportByType,
  updateRapport,
} = require('../controllers/rapportController');

// GET  /api/rapports         → tous les rapports autorisés
// GET  /api/rapports/:type   → un rapport par type
// PUT  /api/rapports/:type   → modifier un rapport (Admin)
router.get('/',      proteger, getRapports);
router.get('/:type', proteger, getRapportByType);
router.put('/:type', proteger, updateRapport);

module.exports = router;
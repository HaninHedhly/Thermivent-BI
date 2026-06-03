const express = require('express');
const router  = express.Router();
const { proteger } = require('../middleware/auth');
const {
  getRapports,
  getRapportByType,
} = require('../controllers/rapportController');

// GET  /api/rapports         → tous les rapports autorisés
// GET  /api/rapports/:type   → un rapport par type
router.get('/',      proteger, getRapports);
router.get('/:type', proteger, getRapportByType);


module.exports = router; 
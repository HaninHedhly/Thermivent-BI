const Dashboard = require('../models/Dashboard');

// GET /api/dashboards/:type
// Retourne un dashboard par type (ex: Ventes)
exports.getDashboardByType = async (req, res) => {
  try {
    const { type } = req.params;
    const user = req.user;
    const access = user.access || {};
    const isAdmin = user.role === 'Admin';

    // Vérifier l'accès
    const accessMap = {
      Ventes:     isAdmin || access.ventes,
      Achats:     isAdmin || access.achats,
      Stock:      isAdmin || access.stocks,
      Production: isAdmin || access.production,
    };
 
    if (!accessMap[type]) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const dashboard = await Dashboard.findOne({ type });

    if (!dashboard) {
      return res.status(404).json({ success: false, message: 'Dashboard introuvable' });
    }

    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error('getDashboardByType error:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

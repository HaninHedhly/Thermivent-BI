const Dashboard = require('../models/Dashboard');

// GET /api/dashboards
// Retourne tous les dashboards (filtrés par accès utilisateur)
exports.getDashboards = async (req, res) => {
  try {
    const user = req.user;
    const access = user.access || {};
    const isAdmin = user.role === 'Admin';

    // Construire la liste des types autorisés
    const typesAutorises = [];
    if (isAdmin || access.ventes)     typesAutorises.push('Ventes');
    if (isAdmin || access.achats)     typesAutorises.push('Achats');
    if (isAdmin || access.stocks)     typesAutorises.push('Stock');
    if (isAdmin || access.production) typesAutorises.push('Production');

    const dashboards = await Dashboard.find({ type: { $in: typesAutorises } });

    res.json({ success: true, data: dashboards });
  } catch (err) {
    console.error('getDashboards error:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

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

// PUT /api/dashboards/:type  (Admin seulement)
// Modifier le lien Power BI d'un dashboard
exports.updateDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin seulement' });
    }

    const { type } = req.params;
    const { lienPowerBI, titre } = req.body;

    const dashboard = await Dashboard.findOneAndUpdate(
      { type },
      { lienPowerBI, titre },
      { new: true }
    );

    if (!dashboard) {
      return res.status(404).json({ success: false, message: 'Dashboard introuvable' });
    }

    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error('updateDashboard error:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
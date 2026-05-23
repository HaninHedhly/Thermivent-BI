const Rapport = require('../models/Rapport');

// GET /api/rapports
// Retourne tous les rapports autorisés pour l'utilisateur connecté
exports.getRapports = async (req, res) => {
  try {
    const user = req.user;
    const access = user.access || {};
    const isAdmin = user.role === 'Admin';

    const typesAutorises = [];
    if (isAdmin || access.ventes)     typesAutorises.push('Ventes');
    if (isAdmin || access.achats)     typesAutorises.push('Achats');
    if (isAdmin || access.stocks)     typesAutorises.push('Stock');
    if (isAdmin || access.production) typesAutorises.push('Production');

    const rapports = await Rapport.find({ type: { $in: typesAutorises } });

    // Mettre à jour dateGeneration à chaque consultation
    await Rapport.updateMany(
      { type: { $in: typesAutorises } },
      { dateGeneration: new Date() }
    );

    res.json({ success: true, data: rapports });
  } catch (err) {
    console.error('getRapports error:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// GET /api/rapports/:type
// Retourne un rapport par type
exports.getRapportByType = async (req, res) => {
  try {
    const { type } = req.params;
    const user = req.user;
    const access = user.access || {};
    const isAdmin = user.role === 'Admin';

    const accessMap = {
      Ventes:     isAdmin || access.ventes,
      Achats:     isAdmin || access.achats,
      Stock:      isAdmin || access.stocks,
      Production: isAdmin || access.production,
    };

    if (!accessMap[type]) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Mettre à jour dateGeneration à chaque consultation
    const rapport = await Rapport.findOneAndUpdate(
      { type },
      { dateGeneration: new Date() },
      { new: true }
    );

    if (!rapport) {
      return res.status(404).json({ success: false, message: 'Rapport introuvable' });
    }

    res.json({ success: true, data: rapport });
  } catch (err) {
    console.error('getRapportByType error:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// PUT /api/rapports/:type  (Admin seulement)
// Modifier le lien Power BI d'un rapport
exports.updateRapport = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin seulement' });
    }

    const { type } = req.params;
    const { lienPowerBI, titre } = req.body;

    const rapport = await Rapport.findOneAndUpdate(
      { type },
      { lienPowerBI, titre },
      { new: true }
    );

    if (!rapport) {
      return res.status(404).json({ success: false, message: 'Rapport introuvable' });
    }

    res.json({ success: true, data: rapport });
  } catch (err) {
    console.error('updateRapport error:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
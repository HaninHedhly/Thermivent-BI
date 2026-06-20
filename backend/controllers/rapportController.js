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


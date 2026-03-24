const jwt = require('jsonwebtoken');
const User = require('../models/User');

const proteger = async (req, res, next) => {
  let token;

  // Vérifier le header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - token manquant',
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - token invalide',
    });
  }
};

// Middleware vérification rôle admin
const adminSeulement = (req, res, next) => {
  if (req.user.typeUser !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé - Admin seulement',
    });
  }
  next();
};

module.exports = { proteger, adminSeulement };
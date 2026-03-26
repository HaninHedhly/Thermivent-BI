const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET tous les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    if (!req.body.motDePasse) {
      return res.status(400).json({ message: 'Le mot de passe est obligatoire' });
    }

    const data = { ...req.body };

    // Si Admin → accès total automatique (même si l'admin oublie de cocher)
    if (data.role === 'Admin') {
      data.access = { ventes: true, achats: true, stocks: true, production: true };
    }

    const newUser = new User(data);
    await newUser.save();

    const userSansMotDePasse = newUser.toObject();
    delete userSansMotDePasse.motDePasse;

    res.status(201).json(userSansMotDePasse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const data = { ...req.body };

    // Si Admin → accès total forcé
    if (data.role === 'Admin') {
      data.access = { ventes: true, achats: true, stocks: true, production: true };
    }

    // Hash le mot de passe si fourni
    if (data.motDePasse) {
      const salt = await bcrypt.genSalt(10);
      data.motDePasse = await bcrypt.hash(data.motDePasse, salt);
    } else {
      delete data.motDePasse; // ne pas écraser si non fourni
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, data, { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    // Empêcher la suppression du compte admin principal
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (user.email === 'admin@thermivent.com') {
      return res.status(403).json({ message: 'Impossible de supprimer le compte admin principal' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
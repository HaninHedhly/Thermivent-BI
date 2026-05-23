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

    // Si Admin → accès total automatique
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
    const { ancienMotDePasse, motDePasse, name, email, phone, photo, role, access } = req.body;

    const user = await User.findById(req.params.id).select('+motDePasse');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Empêcher le changement de rôle de l'admin principal
    if (user.email === 'admin@thermivent.com' && role && role !== 'Admin') {
      return res.status(403).json({ message: 'Impossible de modifier le rôle du compte admin principal' });
    }

    if (motDePasse) {
      if (!ancienMotDePasse) {
        return res.status(400).json({ message: "L'ancien mot de passe est requis." });
      }

      const estValide = await bcrypt.compare(ancienMotDePasse, user.motDePasse);
      if (!estValide) {
        return res.status(400).json({ message: "L'ancien mot de passe est incorrect." });
      }
      user.motDePasse = motDePasse;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (photo !== undefined) user.photo = photo;
    if (role) user.role = role;
    if (access) user.access = access;

    await user.save();
    const response = user.toObject();
    delete response.motDePasse;
    res.status(200).json(response);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
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
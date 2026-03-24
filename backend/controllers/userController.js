const User = require('../models/User');

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
    // motDePasse obligatoire à la création
    if (!req.body.motDePasse) {
      return res.status(400).json({ message: 'Le mot de passe est obligatoire' });
    }
    const newUser = new User(req.body);
    await newUser.save();
    // Ne pas retourner le mot de passe
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

    // Si le mot de passe est modifié, le hasher manuellement
    if (data.motDePasse) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      data.motDePasse = await bcrypt.hash(data.motDePasse, salt);
    } else {
      // Ne pas écraser le mot de passe si non fourni
      delete data.motDePasse;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
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
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
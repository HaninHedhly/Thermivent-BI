const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    // Supprimer l'ancien admin si existe (pour re-seeder proprement)
    await User.deleteOne({ email: 'admin@thermivent.com' });

    // Créer le compte admin avec le nouveau modèle fusionné
    const admin = await User.create({
      name:      'Admin Thermivent',
      email:     'admin@thermivent.com',
      phone:     '00000000',
      role:      'Admin',
      motDePasse: 'admin123',
      access: {
        ventes:     true,
        achats:     true,
        stocks:     true,
        production: true,
      },
    });

    console.log('✓ Compte admin créé avec succès !');
    console.log('──────────────────────────────────');
    console.log('  Email    : admin@thermivent.com');
    console.log('  Password : admin123');
    console.log('──────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('Erreur seed :', error.message);
    process.exit(1);
  }
};

seedAdmin();
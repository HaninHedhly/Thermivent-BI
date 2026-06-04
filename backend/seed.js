const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// On importe directement le schema sans passer par le model
// pour éviter le hook pre('save') qui hash deux fois
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connecté');

    // Supprimer l'ancien admin s'il existe
    await User.deleteOne({ email: 'leila.makni@thermivent.com' });
    console.log('✓ Ancien admin supprimé (si existait)');

    // Créer le nouvel admin
    // Le hook pre('save') va hasher motDePasse automatiquement
    // et mettre access = true sur tout car role = 'Admin'
    const admin = await User.create({
      name:       'Admin Thermivent',
      email:      'leila.makni@thermivent.com',
      phone:      '00000000',
      role:       'Admin',
      motDePasse: 'lailamakni123',
    });

    console.log('\n✅ Compte admin créé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email    : leila.makni@thermivent.com');
    console.log('  Password : leilamakni123');
    console.log('  Rôle     : Admin (accès total)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seed :', error.message);
    process.exit(1);
  }
};

seedAdmin();
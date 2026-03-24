const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  // ── Champs gestion utilisateurs (binôme) ──
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  role:  { type: String, enum: ['Admin', 'Manager', 'Employé'], default: 'Employé' },
  access: {
    ventes:     { type: Boolean, default: false },
    achats:     { type: Boolean, default: false },
    stocks:     { type: Boolean, default: false },
    production: { type: Boolean, default: false },
  },
  photo: { type: String }, // Base64

  // ── Champ authentification ──
  motDePasse: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

}, { timestamps: true });

// Hash mot de passe avant sauvegarde — compatible Mongoose 9
userSchema.pre('save', async function () {
  if (!this.isModified('motDePasse')) return;
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// Méthode vérification mot de passe
userSchema.methods.verifierMotDePasse = async function (motDePasseSaisi) {
  return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  role:  { type: String, enum: ['Admin', 'Manager', 'Employé'], default: 'Employé' },
  access: {
    ventes:     { type: Boolean, default: false },
    achats:     { type: Boolean, default: false },
    stocks:     { type: Boolean, default: false },
    production: { type: Boolean, default: false },
  },
  photo: { type: String, default: '' },

  motDePasse: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

}, { timestamps: true });

// ── Hash mot de passe avant sauvegarde (Mongoose 9 compatible) ──
userSchema.pre('save', async function () {
  if (!this.isModified('motDePasse')) return;
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// ── Si rôle Admin → accès total automatique ──
userSchema.pre('save', function () {
  if (this.role === 'Admin') {
    this.access = { ventes: true, achats: true, stocks: true, production: true };
  }
});

// ── Vérifier mot de passe ──
userSchema.methods.verifierMotDePasse = async function (motDePasseSaisi) {
  return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);
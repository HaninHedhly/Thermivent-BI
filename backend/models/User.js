const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Employé'], default: 'Employé' },
  access: {
    ventes: { type: Boolean, default: false },
    achats: { type: Boolean, default: false },
    stocks: { type: Boolean, default: false },
    production: { type: Boolean, default: false },
  },
  photo: { type: String } // Stored as Base64 for simplicity
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
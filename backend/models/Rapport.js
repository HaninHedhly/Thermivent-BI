const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Ventes', 'Achats', 'Stock', 'Production'],
    required: true,
    unique: true,
  },
  titre: {
    type: String,
    required: true,
  },
  lienPowerBI: {
    type: String,
    required: true,
  },
  dateGeneration: {
    type: Date,
    default: Date.now,
  },
  idUtilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Rapport', rapportSchema);
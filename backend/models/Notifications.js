const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'Alerte' }, // ex: Ventes, Stock, Production
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
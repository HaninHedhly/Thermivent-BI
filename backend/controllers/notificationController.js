const Notification = require('../models/Notifications');

// Envoyer une alerte (Utilisateur -> Admin)
exports.sendNotification = async (req, res) => {
  try {
    const { senderName, senderEmail, message, type } = req.body;
    const notification = await Notification.create({
      senderName,
      senderEmail,
      message,
      type
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer les notifications non lues (Pour l'Admin)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isRead: false })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marquer comme lu
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, 
      { isRead: true }, 
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
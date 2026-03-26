const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Le serveur sait déjà que ce fichier gère /api/notifications
// Donc "/" ici = http://localhost:5000/api/notifications

router.post('/', notificationController.sendNotification);
router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
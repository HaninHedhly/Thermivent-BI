const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { proteger } = require('../middleware/auth');

// Le serveur sait déjà que ce fichier gère /api/notifications
// Donc "/" ici = http://localhost:5000/api/notifications

router.post('/', notificationController.sendNotification);
router.get('/',proteger, notificationController.getNotifications);
router.delete('/:id', proteger, notificationController.deleteNotification);

module.exports = router;
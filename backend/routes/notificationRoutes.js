const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { proteger } = require('../middleware/auth');

router.post('/',notificationController.sendNotification);
router.get('/',proteger,notificationController.getNotifications);
router.put('/:id/read', proteger, notificationController.markAsRead);

module.exports = router;
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/contacts/:userId', chatController.getContacts);
router.post('/contacts', chatController.addContacts);
router.post('/message/send', chatController.sendMsg);
router.get('/message/:sender/:receiver', chatController.getMsg);
router.delete('/contacts/:contact_id', chatController.deleteContacts);
router.get('/download/:fileName', chatController.downloadFile);

module.exports = router;

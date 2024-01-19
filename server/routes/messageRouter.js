const router = require('express').Router()
const messageCtrl = require('../controllers/messageCtrl')
const auth = require('../middleware/auth')

router.post('/message',  messageCtrl.createMessage)

router.get('/conversations',  messageCtrl.getConversations)

router.get('/message/:id',  messageCtrl.getMessages)

router.delete('/message/:id',  messageCtrl.deleteMessages)

router.delete('/conversation/:id',  messageCtrl.deleteConversation)


module.exports = router
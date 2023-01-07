const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('../middlewares/user')
const {sendMessage,getMessagesOfThread} = require('../controllers/messageController')

router.route('/send/message').post(isLoggedIn,sendMessage)
router.route('/messages/:threadId').get(isLoggedIn,getMessagesOfThread)

module.exports = router
const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('../middlewares/user')
const {createThread,getThread,createGroupthread,renameGroupthread,addMembersToGroupthread,removeMembersToGroupthread} = require('../controllers/chatController')

router.route('/create/thread').post(isLoggedIn,createThread)
router.route('/threads').get(isLoggedIn,getThread)
router.route('/group/thread').post(isLoggedIn,createGroupthread)
router.route('/rename/:threadId').put(isLoggedIn,renameGroupthread)
router.route('/remove/members/:threadId').put(isLoggedIn,removeMembersToGroupthread)
router.route('/add/members/:threadId').put(isLoggedIn,addMembersToGroupthread)




module.exports = router
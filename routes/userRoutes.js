const express = require('express')
const router = express.Router()

const {signup,login,allUsers} = require('../controllers/userController')
const {isLoggedIn} = require('../middlewares/user')

router.route('/user/signup').post(signup)
router.route('/user/login').post(login)
router.route('/user/search').get(isLoggedIn,allUsers)


module.exports = router
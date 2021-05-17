let express = require('express');
let router = express.Router();
let authController = require('../controller/auth.controller')
let userValidation = require('../validate/user.validate')

router.post('/login',
    userValidation.validationLogin(),
    authController.login)

router.post('/login/admin',
    userValidation.validationLogin(),
    authController.loginAdmin)

router.post('/register', authController.register)
router.post('/refreshToken', authController.refreshToken)
router.post('/logout', authController.logout)


module.exports = router;
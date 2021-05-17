var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model')
var userController = require('../controller/user.controller')
var authMiddleware = require('../middleware/auth.middleware')



router.get('/', userController.getListUser)
router.get('/profile', authMiddleware.isAuth, userController.getUserById)
router.patch('/profile', authMiddleware.isAuth, userController.updateProfile)
router.delete('/:id', userController.deleteUserById)
router.post('/', userController.addUser)
router.patch('/:id', userController.updateUserAdmin)
router.post('/lock/:id', userController.LockUser)
router.post('/unlock/:id', userController.unLockUser)
router.post('/changepass', userController.changePass)

module.exports = router;
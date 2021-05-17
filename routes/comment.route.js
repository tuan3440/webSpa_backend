const Router = require('express').Router()
const authUser = require('../middleware/auth.middleware')
const commentController = require('../controller/comment.controller')


Router.get('/showComment', commentController.showCommment)
Router.post('/newComment', authUser.isAuth, commentController.newComment)
Router.post('/editComment', authUser.isAuth, commentController.editComment)
Router.post('/deleteComment', authUser.isAuth, commentController.deleteComment)

module.exports = Router
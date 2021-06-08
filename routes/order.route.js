var express = require('express');
var router = express.Router();
var orderModel = require('../models/order.model')
var orderController = require('../controller/order.controller')
var authMiddleware = require('../middleware/auth.middleware')


router.get('/', orderController.getListOrder)
router.get('/user', authMiddleware.isAuth, orderController.getOrderByUser)
router.put('/upadteStatus', authMiddleware.isAuth, orderController.upadteStatus)
router.delete('/:id', orderController.deleteOrderById)
router.get('/stastic', orderController.stasticOrder)
router.get('/stasticCount', orderController.stasticOrderCount)

module.exports = router;
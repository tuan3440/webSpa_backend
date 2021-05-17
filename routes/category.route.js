var express = require('express');
var router = express.Router();
var categoryModel = require('../models/category.model')
var categoryController = require('../controller/category.controller')


router.get('/', categoryController.getListCategory)
router.get('/:id', categoryController.getCategoryById)
router.delete('/:id', categoryController.deleteCategoryById)
router.delete('/', categoryController.deleteManyCategory)
router.post('/', categoryController.addCategory)
router.patch('/:id', categoryController.updateCategory)


module.exports = router;
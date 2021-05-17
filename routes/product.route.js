var express = require('express')
var router = express.Router();
var productModel = require('../models/product.model')
var productController = require('../controller/product.controller')
const multer = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image/product');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 40
  },
  fileFilter: fileFilter
});


router.get('/', productController.getListProduct)
router.get('/search', productController.searchProduct)
router.get('/:id', productController.getProductById)
router.get('/category/:categoryName', productController.getProductByCategory)
router.get('/productforcategory/:categoryId', productController.getProductByCategoryId)
router.delete('/:id', productController.deleteProductById)
router.post('/', upload.single('imgUrl'), productController.addProduct)
router.patch('/:id', upload.single('imgUrl'), productController.updateProduct)
router.post('/uploadImg', upload.single('imgUrl'), productController.uploadImg)


module.exports = router;
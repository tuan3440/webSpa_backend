var express = require('express');
var router = express.Router();
var multer = require('multer');
var controller = require('../controller/bill.controller');

var upload = multer({ dest: './public/uploads/' });
router.get('/', controller.index)

router.get('/billUser', controller.billUser);

router.post('/newBill',
  controller.newBill
);

router.put('/updateStatus/:id', controller.updateStatus);

router.delete('/deleteBill/:id',
  controller.deleteBill
);

router.post('/checkSlot',
  controller.checkSlot
);

module.exports = router;

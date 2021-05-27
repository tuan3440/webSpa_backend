var orderModel = require('../models/order.model')
var categoryModel = require('../models/category.model')
var userModel = require('../models/user.model')
var productModel = require('../models/product.model')

let controller = {}

controller.getListOrder = async (req, res) => {
    try {
        let listOrder = await orderModel.find().populate('user', 'email');
        console.log("aa", listOrder)
        res.json(listOrder);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

controller.getOrderByUser = async (req, res) => {
    try {

        let id = req.user.id;
        let order = await orderModel.find({ user: id }).populate('user', 'email');
        res.json(order);

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}

controller.upadteStatus = async (req, res) => {
    try {

        let status = req.body.status;
        let orderId = req.body._id;


        let orderUpdate = await orderModel.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true });


        if (status == 2) {
            if (req.user.id) {
                let checkUser = await userModel.findOne({ _id: req.user.id })
                checkUser.point += parseInt(orderUpdate.totalMoney) / 1000
                checkUser.save()
            }
        }

        res.json(orderUpdate)




    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


controller.deleteOrderById = async (req, res) => {

    try {
        let id = req.params.id
        let orderDelete = await orderModel.findByIdAndDelete(id)
        res.json(orderDelete);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}

controller.stasticOrder = async (req, res) => {

    try {
        let orders = await orderModel.find({status : 2}).select('createAt totalMoney');
        let data = [];
        for(let i = 1; i<=12 ; i++) {
            data.push({
                month : i,
                total : 0
            })
        }
        if (orders.length > 0) {
            await orders.map((order, index) => {
                let month = order.createAt.getMonth() + 1;
                data[month].total += order.totalMoney;
            })
        }


        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}

controller.stasticOrderCount = async (req, res) => {

    try {
        let data = []
        let productIds = []
        let orders = await orderModel.find({status:2});
        await orders.map(async (order, index) => {
              await order.listProduct.map((product, index2) => {
                   if (productIds.includes(product.product.id)) {
                       data[product.product.id] += product.amount;
                   } else {
                       productIds.push(product.product.id);
                       data[product.product.id] = product.amount;
                   }
            })
        })

        let idProductMax = 0;
        let max = 0;
        for (let key in data) {
            if (data[key] > max) {
                max = data[key];
                idProductMax = key;
            }
        }

        let t = await productModel.findById(idProductMax);
        let result = [
            t, max
        ]
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}




module.exports = controller
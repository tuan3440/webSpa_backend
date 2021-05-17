var cartModel = require('../models/cart.model')
var productModel = require('../models/product.model')
var orderModel = require('../models/order.model')
var userModel = require('../models/user.model')

const controller = {};

controller.getProductCart = async (req, res) => {

    try {
        let userId = req.user.id
        let listCartProduct = await cartModel.findOne({ user: userId }).populate('listProduct.product').populate('user', "firstName lastName address phone");
        res.json({ list: listCartProduct.listProduct, info: listCartProduct.user })
    }
    catch (err) {
        res.status(500).json(err)
    }

}

controller.updateAmount = async (req, res) => {

    try {

        let amount = req.body.amount;
        let productId = req.body.product._id
        let userId = req.user.id
        let CartProduct = await cartModel.findOne({ user: userId });

        var index1
        CartProduct.listProduct.forEach(async (elment, index) => {
            if (elment.product == productId) {
                CartProduct.listProduct[index].amount = amount;
                index1 = index
            }
        });

        CartProduct = await CartProduct.save();



        res.json(CartProduct.listProduct[index1])


    }
    catch (err) {
        res.status(500).json({ err: err })
    }

}


controller.addToCart = async (req, res) => {


    try {

        var amount = req.body.amount;
        var productId = req.body.productId
        let userId = req.user.id
        let CartProduct = await cartModel.findOne({ user: userId });

        var index1 = -1
        CartProduct.listProduct.forEach(async (elment, index) => {
            if (elment.product == productId) {
                CartProduct.listProduct[index].amount += amount;
                index1 = index
            }
        });

        if (index1 == -1) {   // chua co san pham trong gio
            let product = await productModel.findOne({ _id: productId });
            productId = product._id;
            CartProduct.listProduct.push({
                product: productId,
                amount: amount
            })
        }
        CartProduct = await CartProduct.save();
        res.json(CartProduct.listProduct)

    }
    catch (err) {
        res.status(500).json({ err: err })
    }

}



controller.deleteToCart = async (req, res) => {



    try {

        let productId = req.body.product._id
        let userId = req.user.id
        let CartProduct = await cartModel.findOne({ user: userId });

        var index1
        CartProduct.listProduct.forEach(async (elment, index) => {
            if (elment.product == productId) {
                CartProduct.listProduct.splice(index, 1);
                index1 = index;
            }
        });

        if (index1 == -1) res.status(500).json({ err: "không có sản phẩm" })

        CartProduct = await CartProduct.save();



        res.status(200).json({ "message": "success" })


    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: err })
    }

}


controller.cartPay = async (req, res) => {



    try {

        let userId = req.user.id
        let user = await userModel.findOne({ _id: userId })
        let CartProduct = await cartModel.findOne({ user: userId }).populate('listProduct.product');;

        if (CartProduct.listProduct.length == 0) res.status(500).json({ err: "giỏ hàng rỗng, không thể thanh toán" });


        let newOrder = new orderModel();
        newOrder.user = user._id;
        newOrder.userName = req.body.userName;
        newOrder.address = req.body.address;
        newOrder.phone = req.body.phone;
        newOrder.totalMoney = 0


        CartProduct.listProduct.forEach(async (element, index) => {
            newOrder.totalMoney += element.product.price * element.amount;
            newOrder.listProduct.push({
                product: {
                    id: element.product._id.toString(),
                    name: element.product.name,
                    imgUrl: element.product.imgUrl,
                    summary: element.product.summary,
                    description: element.product.description,
                    price: element.product.price
                },
                amount: element.amount
            })
        });

        CartProduct.listProduct = []

        CartProduct = await CartProduct.save();
        newOrder = await newOrder.save();




        res.json({ newOrder, CartProduct })

    }
    catch (err) {
        res.status(500).json({ err: err })
    }

}














module.exports = controller
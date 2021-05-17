var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var orderSchema= new Schema({
	user: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	userName: String,
	address: String,
	phone: String,
	totalMoney: Number,
	status: {
		type:Number,
		default: 0
	}, 
	createAt:{
		type:Date,
		default: Date.now
	},
	listProduct:[{
		product: {
			id: String,
			name: String,
			imgUrl: String,
			summary: String,
			description: String,
			price: Number
		},
		amount: Number
	}]
})

module.exports= mongoose.model('orders', orderSchema)

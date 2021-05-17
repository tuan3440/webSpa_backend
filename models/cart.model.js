var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var cartSchema= new Schema({
	user: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},

	listProduct:[{
		product: {
			type:Schema.Types.ObjectId,
			ref:'products'
		},
		amount: Number
	}]


})


cartSchema.Static={
}


module.exports= mongoose.model('carts', cartSchema)
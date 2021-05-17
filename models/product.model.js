var mongoose = require('mongoose');
var Schema = mongoose.Schema
var productSchema = new Schema({
	name: String,
	summary: {
		type: String,
		default: null
	},
	imgUrl: String,
	description: {
		type: String,
		default: null
	},
	price: Number,
	category: {
		type: Schema.Types.ObjectId,
		ref: 'categories',
		required: true
	},
	createAt: {
		type: Date,
		default: Date.now
	},
	updateAt: {
		type: Date
	}


})

productSchema.statics = {
	getListProduct() {
		return this.find().populate('category').exec()
	},

	getNewProduct() {
		return this.find().sort({ "createAt": -1 }).exec();
	}
}

module.exports = mongoose.model('products', productSchema)
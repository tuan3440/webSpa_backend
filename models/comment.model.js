var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'products'
	},
	rate: {
		type: Number,
		max: 5,
		min: 0,
		default: null
	},
	content: {
		type: String,
		trim: true
	},

	createAt: {
		type: Date,
		default: Date.now
	}

})

module.exports = mongoose.model('comments', commentSchema)
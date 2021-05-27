var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	service: {
		type: Schema.Types.ObjectId,
		ref: 'services'
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
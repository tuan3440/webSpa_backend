var mongoose = require('mongoose');
var Schema = mongoose.Schema
var userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	address: String,
	phone: String,
	avatar: {
		type: String,
		default: null
	},
	role: {
		type: Number,
		default: 1
	},
	point: {
		type: Number,
		default: 0
	},
	isBlock: {
		type: Boolean,
		default: false
	}

});




module.exports = mongoose.model('users', userSchema);
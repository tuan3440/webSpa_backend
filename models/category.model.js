let productModel = require('./product.model')

var mongoose = require('mongoose');
var Schema= mongoose.Schema
var categorySchema=new  Schema({
	name:String
})

// categorySchema.pre("deleteOne", { document: true, query: false }, async (next)=>{
// 	// await productModel.deleteMany({category: this._id})
// 	console.log(this)
//   next()
// });

module.exports= mongoose.model('categories', categorySchema)
var mongoose = require('mongoose');
var Schema = mongoose.Schema
var serviceSchema = new Schema({
    img: String,
    price:Number,
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});




module.exports = mongoose.model('services', serviceSchema);
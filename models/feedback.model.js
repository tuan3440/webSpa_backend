var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feddbackSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'services'
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

module.exports = mongoose.model('feedbacks', feddbackSchema)
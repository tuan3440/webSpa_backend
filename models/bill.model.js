var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'services'
    },
    bookHour: String,
    bookDate: Date,
    userName: String,
    phone: String,
    totalMoney: Number,
    status: {
        type: Number,
        default: 0
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    code : String

})


billSchema.Static = {
}


module.exports = mongoose.model('bills', billSchema)
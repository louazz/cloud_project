
const mongoose = require('mongoose')

const bidSchema = mongoose.Schema({
price: {
    type: Number,
    require: true
},
user:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
},
time:{
    type: Date,
    default:Date.now
},

})
module.exports=mongoose.model('bids',bidSchema)
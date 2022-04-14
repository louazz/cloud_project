
const mongoose = require('mongoose')

const auctionSchema = mongoose.Schema({
price: {
    type: Number,
    require: true
},
user:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
},
status:{
    type: Boolean,
    require: true,
    default: false
},
timer:{
    type: Date,
    require: true
},
item: { type:  mongoose.Schema.Types.ObjectId, ref: 'Item' },
bids :[{ type:  mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
winner:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
}
})
module.exports=mongoose.model('auctions',auctionSchema)
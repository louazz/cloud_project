
const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    title:{
        type:String,
        require:true,

    },
    registred:{
        type:Date,
        default:Date.now
    },
    description:{
        type:String,
        require:true,
    },
    expiration:{
        type:Date,
        require:true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    condition:{
        type:String,
        require:true,
    }
})
module.exports=mongoose.model('items',itemSchema)
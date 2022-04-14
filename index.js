
const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')


app.use(bodyParser.json())
const auctionRoute = require('./routes/auctions')
const authRoute = require('./routes/auth')


app.use('/api/auctions',auctionRoute)
app.use('/api/user',authRoute)

mongoose.connect(process.env.DB_CONNECTOR,
     {  useNewUrlParser: true, useUnifiedTopology: true }, ()=>{
    console.log('DB is connected')
})

app.listen(3000, ()=>{

    console.log('Server is running')
    
    

})
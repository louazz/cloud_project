const express =require('express')
const router = express.Router()
const checkWinner = require('../checkWinner');

const Auction = require('../models/Auction')
const Item=require ('../models/Item')
const Bid=require ('../models/Bid')
const verifyToken = require('../verifyToken')

// POST item
router.post('/items',verifyToken,async(req,res)=>{
    const { body: { item } } = req;
    console.log(item)
    const newItem = new Item(item);
    try {
        await newItem.save();
       res.status(201).json(newItem);
    } catch(error) {
        res.status(400).json({ message : error.message});
    }
})

// POST auction with an item
router.post('/',verifyToken,async(req,res)=>{
    const { body: { auction } } = req;
    try {
        Item.findOne({'_id':auction.item})
    }catch (error){
        res.status(400).json({message: "item for auctionning not found"})
    }
    const newAuction = new Auction(auction);
    try {
        await newAuction.save();

        //schedule a checkwinner process by the end of the auction
        checkWinner(newAuction._id);
       res.status(201).json(newAuction);
    } catch(error) {
        res.status(400).json({ message : error.message});
    }
})

// GET items in auction
router.get('/active', verifyToken, async (req, res)=>{
    // get all active auctions 
    const auctions= await Auction.find({
        'status': true
    })
    try {    
        // extract the items associated with these auctions
        var items=[]
          for (var auctionIndex in auctions){
             const item=await Item.find(auctions[auctionIndex].item);
             items.push(item);
          }
          res.status(201).json(items);
    } catch(error){
        res.status(400).json({ message : error.message});
    }

})

//PATCH: bid for one item
router.patch('/bid/:autionId', verifyToken, async (req, res)=>{

  console.log(req.params.autionId);
    // check auction
    try{
        const auction=  await Auction.findOne({'_id': req.params.autionId})
       
     if (auction.status== false){
       return res.status(400).json({ message : 'Auction is unavailable.'});
     }
  

    // check the bidding user
    const { body: { bid } } = req;
   if (bid.user== auction.user){
      return  res.status(400).json({ message : 'user cannot bid for an owned auction.'});
    }

    // create a bid
    const newBid = new Bid(bid);        
    await newBid.save();
    
    // add bid to auction
   const auc= await Auction.findOneAndUpdate(
            {"_id":req.params.autionId},
            {$push: {"bids": newBid}},);
    res.status(201).json(auc);
}catch(error){
    res.status(400).json({ message : error.message});
}
})


// browse sold items
router.get('/items/sold', verifyToken, async(req, res)=>{
     // get all completed auctions 
     const auctions= await Auction.find({
        'status': false
    })

    try {    
        // extract the items associated with these auctions
        var items=[]
        for (let i = 0; i < auctions.length; i++) { 
            const item=await Item.findOne({'_id':auctions[i].item.toString()});
            items.push(item);
          }
          //console.log(items)
          res.status(201).json(items);
    } catch(error){
        res.status(400).json({ message : error.message});
    }

})

// browse bidding history of a sold item
router.get('/items/sold/:itemId', verifyToken, async(req,res)=>{
    // verify item id
    try{
       await Item.findOne({'_id': req.params.itemId})
    }catch(error){
        res.status(400).json({ message : error.message});      
    }

    // search for auction associated to the item and return the bids associated to it
    try{
        const auction= await Auction.findOne({'item': req.params.itemId});
        var bids=[];
        for (var i in auction.bids){
            console.log(i)
            const bid= await Bid.findOne({'_id': auction.bids[i]});
            bids.push(bid);
        }
        res.status(201).json(bids);
    }catch(error){
        res.status(400).json({ message: error.message});
    }
})

module.exports=router
const Auction = require('./models/Auction');
const Bid= require('./models/Bid');
const schedule = require('node-schedule');


const checkWinner= async(auctionId)=>{
  //get the active auction and extract its expiration date
  const  auction= await Auction.findOne({'_id': auctionId})
  // schedule the winner nomination whenever the auction expires
  const job = schedule.scheduleJob(auction.timer,async function (){
    // get the auction after it has finished 
    const newAuction= await Auction.findOne({'_id': auctionId})
    // associate a winner to that auction ( the last user that made highest bid ) & change the status of an auction
    var highestBid=null;
    for (var bidIndex in newAuction.bids){
     var bid= await Bid.findOne(newAuction.bids[bidIndex]);
      if (bid.price > highestBid){
          highestBid=bid
      }
    }
    await Auction.findOneAndUpdate({'_id': newAuction._id}, {'price': highestBid.price,'winner': highestBid.user,'status': false});
});
}
module.exports=checkWinner
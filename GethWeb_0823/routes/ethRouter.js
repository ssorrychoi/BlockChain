var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('blockchain', { blocks: mychain.chain, title: "blockchain", selectedIdx:0});
});

router.get('/test',function(req,res,next){
  web3.eth.getBlockNumber()
  .then(number=>{
    console.log(number);
    res.json(number);
  })
});


router.get('/accountlist',function(req,res,next){
  web3.eth.getAccounts()
    .then(async accounts=>{
      let accountList = [];
      for(let i=0;i<accounts.length;i++){
        await web3.eth.getBalance(accounts[i])
          .then((balance)=>{
            accountList.push({
              WalletAddress:accounts[i],
              balance : parseInt(balance)
            })
          })
        
        
      }
      res.render('accountlist',{accounts:accountList});
    })
})


module.exports = router;

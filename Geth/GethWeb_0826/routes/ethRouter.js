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

// function getBalance(){
//   web3.eth.getBalance("0xf6cd8687b51194d541983eae81ef8e167a23e1fe",
//   function(balance){
//     console.log(balance);
//   });
// }


// function getBalance(){
//   web3.eth.getBalance("0xf6cd8687b51194d541983eae81ef8e167a23e1fe")
//     .then(balance=>{
//       console.log(balance);
//     });
// }


// async function getBalance(){
//   await web3.eth.getBalance("0xf6cd8687b51194d541983eae81ef8e167a23e1fe")
//     .then(balance=>{
//       console.log(balance);
//     });
// }


router.get('/accountlist',function(req,res,next){
  web3.eth.getAccounts()
    .then(async accounts=>{
      let accountList = [];

      for(let i=0;i<accounts.length;i++){
        // await web3.eth.getBalance(accounts[i])
        //   .then((balance)=>{
        //     accountList.push({
        //       WalletAddress:accounts[i],
        //       balance : parseInt(balance)
        //     })
        //   })
        let balance = await web3.eth.getBalance(accounts[i]);
        accountList.push({
          WalletAddress:accounts[i],
          balance : web3.utils.fromWei(balance,"ether")
        })
      }
      res.render('accountlist',{accounts:accountList});
    })
})




router.get('/createaccount', async function(req,res,next){

  web3.eth.personal.newAccount("eth")
    .then(()=>{
      res.redirect('/eth/accountlist');
    })
    .catch(()=>{
      console.log("Err : create account error");
      res.redirect('/eth/accountlist');
    });
})



module.exports = router;

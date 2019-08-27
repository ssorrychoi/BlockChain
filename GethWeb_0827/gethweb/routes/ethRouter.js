var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('blockchain', { blocks: mychain.chain, title: "blockchain", selectedIdx:0});
// });

/* url : /eth */
router.get('/', async function(req, res, next) {
  var blockNumber = await web3.eth.getBlockNumber();
  var showCount = 10;
  var blockList = [];
  
  var startNum = 0;
  var endNum = blockNumber;
  
  if (blockNumber > showCount) {
    startNum = blockNumber - showCount;
  }
  
  for(let i=startNum; i<endNum; i++) {
    let block = await web3.eth.getBlock(i);
    blockList.push(block);
  }
  
  //console.log('blockNumber : ', blockNumber);
  //console.log('blocks : ', JSON.stringify(blockList, null, 2));
  
  res.render('blockchain', {blocks: blockList, title:"blockchain", selectedIdx: startNum, txs: []});
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




router.get('/block/:idx', function (req, res, next) {
     const selectedIdx = req.params.idx;
     let blocklist = [];
     let transactionlist = [];

     web3.eth.getBlockNumber().then(async(BlockNumber) => {
          console.log("BlockNumber : ", BlockNumber);
          for (var i = 0; i <= BlockNumber; i++) {
            await   web3.eth.getBlock(i).then((Block) => {
                    //console.log("Block : ",Block);
                    blocklist.push({
                         parentHash: Block.parentHash,
                         hash: Block.hash,
                         number: Block.number,
                         nonce: Block.nonce,
                         timestamp: Block.timestamp
                    });
               }).catch((err) => {
                    console.log("getBlock err : ", err);
               });
          };

          web3.eth.getBlock(selectedIdx).then(async(Block) => {
               console.log("Block : ", Block);
               console.log("Block.transactions : ", Block.transactions);
               console.log("Block.transactions.length : ", Block.transactions.length);
               for(var i = 0; i< Block.transactions.length; i++) {
                    await web3.eth.getTransaction(String(Block.transactions[0])).then((Transaction) => {
                         console.log("Transaction : ", Transaction);
                         transactionlist.push({
                              fromAddress: Transaction.from,
                              toAddress: Transaction.to,
                              amount: Transaction.value
                         });

                    }).catch((err) => {
                         console.log("getTransaction err : ", err);
                    });
               }

               res.render('blockchain', {
                    blocks: blocklist,
                    selectedIdx: selectedIdx,
                    txs: transactionlist
               });
          }).catch((err) => {
               console.log("getBlock : ", err);
               
          });
     }).catch((err) => {
          console.log("getBlockNumber err : ", err);

     });
});



router.get('/wallet/:address', function (req, res, next) {
  const address = req.params.address;
  let transactionlist = [];

  web3.eth.getBlockNumber().then(async (BlockNumber) => {

       for (let i = 0; i <= BlockNumber; i++) {

         await web3.eth.getBlock(i).then((block) => {
                 block.transactions.forEach((el) => {
                      web3.eth.getTransaction(el).then((tx) => {
                           if(address == tx.from || address == tx.to) {
                                transactionlist.push({
                                     fromAddress: tx.from,
                                     toAddress: tx.to,
                                     blockNumber: tx.blockNumber,
                                     amount: tx.value,
                                });
                           }
                      }).catch((err) => {
                           console.log("getTransaction err : ", err);
                      });
                      console.log("transactionlist : ", transactionlist);
                 });
            }).catch((err) => {
                 console.log("getTransaction err : ", err);
            });
       };
       let balance = await web3.eth.getBalance(address);
       console.log("balance : ", balance);
       res.render('wallet', {
            address: address,
            txs: transactionlist,
            balance: balance
       });
  });
});


module.exports = router;

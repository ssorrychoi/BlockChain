---
layout: post
title: Go Ethereum_4
subtitle: 
tags: [Ethereum]
comments: true

---

20190827

## transactionbyaccount.js

- routes > transactionbyaccount.js

  ```javascript
  var Web3 = require('web3');
  var web3 = new Web3('http://localhost:8545');
  
  async function getTransactionByAccount(myaccount, startBlockNumber, endBlockNumber){
      console.log('Transaction By Account');
      console.log('Account : ', myaccount);
      console.log('Block : ', startBlockNumber, ' - ', endBlockNumber);
  
      for(let i=startBlockNumber; i<=endBlockNumber; i++){
          let block = await web3.eth.getBlock(i);
  /*         if(block.transactions.length > 0){
              console.log(block);
              break;
          } */
  
           if(block != null && block.transaction != null) {
              //for(let i = 0; i<block.transaction.length; i++){
                  block.transactions.forEach( async (el) => {
                      let tx = await web3.eth.getTransaction(el);
                      console.log(tx);
                      console.log("tx hash : ", tx.hash);
                      console.log("   nonce : ", tx.nonce);
                      console.log("   blocknumber : ", tx.blocknumber);
                      console.log("   from : ", tx.from);
                      console.log("   to : ", tx.to);
                  })
          }
      }
  }
  
  getTransactionByAccount("0xb3015912ae0ac770328768e09d008a68204629e2", 0,279 ); //0번 계정 , 트랜잭션이 있는 BlockNumber, endNumber
  ```

  



## ethRouter.js

- routes > ethRouter.js

  ```javascript
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
  ```

  
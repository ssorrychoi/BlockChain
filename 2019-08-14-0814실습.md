---
layout: post
title: 블록체인 개발 실습_1
subtitle: Javascript를 이용한 실습
tags: [블록체인]
comments: true
---

20190814

# 블록체인 개발 실습

## block.js / test.js

- `npm i --save crypto-js`

- block.js

  ```javascript
  const SHA256 = require('crypto-js/sha256');
  
  class Block{
    constructor(index,timestamp,transactions){
      this.index = index;
      this.timestamp = timestamp;
      this.prevHash = '';
      this.curHash = this.calculateHash();
      this.nonce = 0;
      this.transactions = transactions;
    }
    calculateHash(){
      return SHA256(this.prevHash+this.timestamp+this.nonce+JSON.stringify(this.transactions)).toString();
    }
    printBlock(){
      console.log(JSON.stringify(this,null,2));
    }
  }
  module.exports = Block;
  ```

- test.js

  ```javascript
  const Block = require('./block');
  
  const newBlock = new Block(0,Date.now(),'data');
  newBlock.printBlock();
  ```

- 결과값

  > Jaeseongs-MacBook-Pro:Practice1 ssorrychoi$ ***node test.js***
  >
  > {
  >
  > "index": 0,
  >
  > "timestamp": 1565795400857,
  >
  > "prevHash": "",
  >
  > "curHash": "fac6039ea8107d8e08434b7919984545216e863d59acf731752917a44673323f",
  >
  > "nonce": 0,
  >
  > "transactions": "data"
  >
  > }



## Block 2개 

- block.js

  ```javascript
  const SHA256 = require('crypto-js/sha256');
  
  class Block{
    constructor(index,timestamp,transactions){
      this.index = index;
      this.timestamp = timestamp;
      this.prevHash = prevHash;			//수정
      this.curHash = this.calculateHash();
      this.nonce = 0;
      this.transactions = transactions;
    }
    calculateHash(){
      return SHA256(this.prevHash+this.timestamp+this.nonce+JSON.stringify(this.transactions)).toString();
    }
    printBlock(){
      console.log(JSON.stringify(this,null,2));
    }
  }
  module.exports = Block;
  ```

- test.js

  ```javascript
  const Block = require('./block');
  
  const newBlock = new Block(0,Date.now(),'data','prevHash');
  newBlock.printBlock();
  
  const newBlock2 = new Block(1,Date.now(),'data2',newBlock.curHash);
  newBlock2.printBlock();
  ```

- 결과값

  > Jaeseongs-MacBook-Pro:Practice1 ssorrychoi$ ***node test.js***
  >
  > {
  >
  > "index": 0,
  >
  > "timestamp": 1565797436878,
  >
  > "prevHash": "prevHash",
  >
  > "curHash": "389c91ec3573132c4823b934777b1900ec7cc98b22e39e0458913a38f5c1c5cb",
  >
  > "nonce": 0,
  >
  > "transactions": "data"
  >
  > }
  >
  > {
  >
  > "index": 1,
  >
  > "timestamp": 1565797436883,
  >
  > "prevHash": "389c91ec3573132c4823b934777b1900ec7cc98b22e39e0458913a38f5c1c5cb",
  >
  > "curHash": "6630006f1bc52a5e4dba7ef6187da94b1fbe31e7a33eb242635b24fff35c2eab",
  >
  > "nonce": 0,
  >
  > "transactions": "data2"
  >
  > }



## transaction.js

- transaction.js

  ```javascript
  const SHA256 = require('crypto-js/sha256');
  
  class Transaction{
      constructor(fromAddress,toAddress,amount){
          this.fromAddress = fromAddress;
          this.toAddress = toAddress;
          this.amount = amount;
      }
  
      calculateHash(){
          return SHA256(this.fromAddress+this.toAddress+this.amount).toString();
      }
  
      printTransaction(){
          console.log('from   : ',this.fromAddress);
          console.log('to     : ',this.toAddress);
          console.log('amount : ',this.amount);
      }
  }
  module.exports = Transaction;
  ```

- test.js

  ```javascript
  const Block = require('./block');
  const Transaction = require('./transaction');
  
  const newTransaction = new Transaction('aaa','bbb',100);
  newTransaction.printTransaction();
  
  const newBlock = new Block(0,Date.now(),newTransaction,'prevHash');
  newBlock.printBlock();
  
  const newBlock2 = new Block(1,Date.now(),'data2',newBlock.curHash);
  newBlock2.printBlock();
  ```

- 결과값

  > Jaeseongs-MacBook-Pro:Practice1 ssorrychoi$ ***node test.js***
  >
  > from   :  aaa
  >
  > to     :  bbb
  >
  > amount :  100
  >
  > {
  >
  > "index": 0,
  >
  > "timestamp": 1565798462541,
  >
  > "prevHash": "prevHash",
  >
  > "curHash": "58fd8b7fcd7f3353b7c4164576254feb11ec25fc6d4223ee22dda4464465e16f",
  >
  > "nonce": 0,
  >
  > "transactions": {
  >
  >  "fromAddress": "aaa",
  >
  >  "toAddress": "bbb",
  >
  >  "amount": 100
  >
  > }
  >
  > }
  >
  > {
  >
  > "index": 1,
  >
  > "timestamp": 1565798462544,
  >
  > "prevHash": "58fd8b7fcd7f3353b7c4164576254feb11ec25fc6d4223ee22dda4464465e16f",
  >
  > "curHash": "1aa0024944fb277d704811534d81e01a3ce65f3499f884d706ae67f0c3c50adf",
  >
  > "nonce": 0,
  >
  > "transactions": "data2"
  >
  > }


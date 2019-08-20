---
layout: post
title: 블록체인 개발_3
subtitle: 블록체인 실습
tags: [블록체인]
comments: true
---

20190819

# 실습 Review

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
          // console.log("1 : "+SHA256('1').toString());
          // console.log("2 : "+SHA256('2').toString());
          // console.log("3 : "+SHA256('3').toString());
          return SHA256(this.prevHash+this.timestamp+this.nonce+JSON.stringify(this.transactions)).toString();
      }
  
      printBlock(){
          console.log(JSON.stringify(this,null,2));
      }
  
  }
  
  module.exports = Block;
  ```

- transaction.js

  ```javascript
  class Transaction {
    constructor(toAddress,fromAddress,amount){
      this.toAddress = toAddress;
      this.fromAddress = fromAddress;
      this.amount = amount;
    }
  
    printTransaction(){
      console.log(JSON.stringify(this,null,2));
    }
  }
  
  module.exports = Transaction;
  ```

- blockchain.js

  ```javascript
  const Block = require('./block');
  const Transaction = require('./transaction');
  
  class BlockChain{
    constructor(){
      this.chain = [new Block(0,Date.now(),[],'Genesis Block')];
    }
  
    addBlock(block){
      block.prevHash = this.getLatestBlock().curHash;
      block.curHash = block.calculateHash();
      this.chain.push(block);
    }
  
    getLatestBlock(){
      return this.chain[this.chain.length-1];
    }
  
    printAllBlockChain(){
      console.log(JSON.stringify(this,null,2));
    }
  
  }
  
  module.exports = BlockChain;
  ```

- test.js

  ```javascript
  const Block = require('./block');
  const Transaction = require('./transaction');
  const BlockChain = require('./blockchain');
  
  const tx1 = new Transaction('aaa','bbb',100);
  const tx2 = new Transaction('aaa','ccc',10);
  const tx3 = new Transaction('aaa','ddd',20);
  
  // tx1.printTransaction();
  // tx2.printTransaction();
  
  const mychain = new BlockChain();
  
  const newBlock = new Block(1,Date.now(),[tx1]);
  //console.log("newBlock curHash : ",newBlock.curHash.toString());
  //newBlock.printBlock();
  
  const newBlock2 = new Block(2,Date.now(),[tx1,tx2]);
  //console.log("newBlock2 curHash : ",newBlock2.curHash.toString());
  //newBlock2.printBlock();
  
  mychain.addBlock(newBlock);
  mychain.addBlock(newBlock2);
  
  mychain.printAllBlockChain();
  ```



## miningBlock

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
  
    //작업증명(PoW)
    miningBlock(difficulty) {
      while(this.curHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        this.nonce++;
        this.curHash = this.calculateHash();
        console.log("mining...", this.nonce, "...", this.curHash);
      }
    }
  }
  
  module.exports = Block;
  ```

- test2.js

  ```javascript
  const Block = require('./block');
  const Transaction = require('./transaction');
  const BlockChain = require('./blockchain');
  
  const tx1 = new Transaction('aaa','bbb',100);
  const tx2 = new Transaction('aaa','ccc',10);
  const tx3 = new Transaction('aaa','ddd',20);
  
  const mychain = new BlockChain();
  
  const newBlock = new Block(1,Date.now(),[tx1]);
  
  const newBlock2 = new Block(2,Date.now(),[tx1,tx2]);
  
  mychain.addBlock(newBlock);
  mychain.addBlock(newBlock2);
  
  mychain.printBlockChain();
  
  ```

- blockchain.js

  ```javascript
  const Block = require('./block');
  const Transaction = require('./transaction');
  
  class BlockChain{
    constructor(){
      this.difficulty=2;
      this.chain = [new Block(0,Date.now(),[],'Genesis Block')];
    }
  
    addBlock(block){
      block.prevHash = this.getLatestBlock().curHash;
      //block.curHash = block.miningBlock(2);
      block.miningBlock(this.difficulty);
      this.chain.push(block);
    }
  
    getLatestBlock(){
      return this.chain[this.chain.length-1];
    }
  
    printBlockChain(){
      console.log(JSON.stringify(this,null,2));
    }
  
    isChainValid(){
      for(let i=1;i<this.chain.length;i++){
        const curBlock = this.chain[i];
        const prevBlock = this.chain[i-1];
  
        //블록 내부 해시값 검증
        if(curBlock.curHash !== curBlock.calculateHash()){
          console.log('Err 1 : chain['+i+']');
          return false;
        }
  
        //이전 블록 해시값 검증
        if(curBlock.prevHash !== prevBlock.curHash){
          console.log('Err 2 : chain['+i+']');
          return false;
        }
      }
      return true;
    }
  }
  
  module.exports = BlockChain;
  ```

- transaction.js

  ```javascript
  class Transaction {
    constructor(toAddress,fromAddress,amount){
      this.toAddress = toAddress;
      this.fromAddress = fromAddress;
      this.amount = amount;
    }
  
    printTransaction(){
      console.log(JSON.stringify(this,null,2));
    }
  }
  
  module.exports = Transaction;
  ```

- 결과값

  >BLOCKCHAIN : Practice2 ssorrychoi$ **node test2.js**
  >
  >mining... 1 ... 4f876bff63fb69c2620d4d56dbc746a838da6849e3aa09112f974cf9936f28e2
  >
  >mining... 2 ... 60362f6320905f08aebc02fb588e112d9e11d71768a6cbd963fcbaa213556b5b
  >
  >mining... 3 ... 2c7a5446124dae84b535dca46e67849346062a7aea9fe36a82553cf171784297
  >
  >mining... 4 ... f6ebb895394e582e7ee1122aafcd5415caa71d72fd8dced46e3d036b1a9fb3ab
  >
  >mining... 5 ... 1732dfe7b4c27e5456ba680b69c42415cca4532ba9ec66e0bc3bcc36f26a6eee
  >
  >mining... 6 ... 022899f65d98157c6500b6951aa3a3e2874033d50907c45c32f018c5d5113652
  >
  >mining... 7 ... 00860c3470575e5b364dc150c7641ca97af535540ca6efb9bc02352856b5a3d3
  >
  >mining... 1 ... 63dc92c32ee8d8da6ad87fe767090747177c8f34a24abe0a9d5c57bdee5137f9
  >
  >mining... 2 ... 23d851b6be1ec905a0e228eb7997ea93a4cf400ac912dbfe3e3a6913a0391234
  >
  >mining... 3 ... 4b397fd00eedab96a423ac81376661784aa1051c409359b48c5727ae0aaf6e8a
  >
  >mining... 4 ... f8f0b33066ba343a7e27640f3368feb92521e664a904effadd4799ff02594c6e
  >
  >mining... 5 ... d65605dc6a5c8e022fccb1c3dd718cd789f82fbb4ad7b5d757ce9db49f69e632
  >
  >mining... 6 ... a6428460ddcd676dcfd140568d9ba1840803a9a53bfc5d1b2852fa505da46cd0
  >
  >mining... 7 ... 9aefa078c5cc4f1221636fb86d48e396aad3be92ac8e021df89144e314b9657b
  >
  >mining... 8 ... d9576ca3bca1c6d3ec2157b7d3e14e26c0d527d3f467af43a7f9923f70fe81c3
  >
  >mining... 9 ... 00ab16a0de6fb3d971c8041a1ddd05d5495be9364508074359fe0216252663be
  >
  >{
  >
  >  "difficulty": 2,
  >
  >  "chain": [
  >
  >​    {
  >
  >​      "index": 0,
  >
  >​      "timestamp": 1566181295182,
  >
  >​      "prevHash": "",
  >
  >​      "curHash": "76beda7ba26a271caee7c22428230276163afd6771c760deeb78471d21c33542",
  >
  >​      "nonce": 0,
  >
  >​      "transactions": []
  >
  >​    },
  >
  >​    {
  >
  >​      "index": 1,
  >
  >​      "timestamp": 1566181295184,
  >
  >​      "prevHash": "76beda7ba26a271caee7c22428230276163afd6771c760deeb78471d21c33542",
  >
  >​      "curHash": "00860c3470575e5b364dc150c7641ca97af535540ca6efb9bc02352856b5a3d3",
  >
  >​      "nonce": 7,
  >
  >​      "transactions": [
  >
  >​        {
  >
  >​          "toAddress": "aaa",
  >
  >​          "fromAddress": "bbb",
  >
  >​          "amount": 100
  >
  >​        }
  >
  >​      ]
  >
  >​    },
  >
  >​    {
  >
  >​      "index": 2,
  >
  >​      "timestamp": 1566181295185,
  >
  >​      "prevHash": "00860c3470575e5b364dc150c7641ca97af535540ca6efb9bc02352856b5a3d3",
  >
  >​      "curHash": "00ab16a0de6fb3d971c8041a1ddd05d5495be9364508074359fe0216252663be",
  >
  >​      "nonce": 9,
  >
  >​      "transactions": [
  >
  >​        {
  >
  >​          "toAddress": "aaa",
  >
  >​          "fromAddress": "bbb",
  >
  >​          "amount": 100
  >
  >​        },
  >
  >​        {
  >
  >​          "toAddress": "aaa",
  >
  >​          "fromAddress": "ccc",
  >
  >​          "amount": 10
  >
  >​        }
  >
  >​      ]
  >
  >​    }
  >
  >  ]
  >
  >}



## 타원곡선 알고리즘

- `npm i --save elliptic`

- https://www.npmjs.com/package/elliptic

- keygenerator.js

  ```javascript
  //https://www.npmjs.com/package/elliptic
  
  var EC = require('elliptic').ec;
  
  // Create and initialize EC context
  // (better do it once and reuse it)
  var ec = new EC('secp256k1');
  
  // Generate keys
  var key = ec.genKeyPair();
  
  console.log('PrivateKey = ',key.getPrivate('hex'));  //216bit
  console.log('PublicKey = ',key.getPublic('hex'));   //512bit
  ```

- `node keygenerator.js`

- 결과값

  > PrivateKey =  11e06d09e9d5d20f92fecd5a76f4e26e87b05f9ff4cef659d5de5e1dc298e41a
  >
  > PublicKey =  04185e6bb395b4a1d7c354db12a7ded3ca757b9223d615c65f5b3bd8b3633a7d9bdd0c9ef4d265ac510ce770b99dfe0b0516ec16e91055a6ca0b5486812e0559c5

- test2.js

  ```javascript
  var EC = require('elliptic').ec;
  var ec = new EC('secp256k1');
  
  const Block = require('./block');
  const Transaction = require('./transaction');
  const BlockChain = require('./blockchain');
  
  //privateKey를 가져온다. PrivateKey와 PublicKey는 1:1관계이므로 하나만 가져오면 됨.
  const userKeyStr1 = '11e06d09e9d5d20f92fecd5a76f4e26e87b05f9ff4cef659d5de5e1dc298e41a';
  const userKeyStr2 = 'f1e2aa67d0a9ea89ef262a1e33a92173501f9bad968e91a4ae0bc601af4f2975';
  
  const privKey1 = ec.keyFromPrivate(userKeyStr1);
  const privKey2 = ec.keyFromPrivate(userKeyStr2);
  
  const wallet1 = privKey1.getPublic('hex');
  const wallet2 = privKey2.getPublic('hex');
  
  const tx1 = new Transaction(wallet1,wallet2,100);
  const signTx1 = tx1.signTransaction(privKey1);
  
  const tx2 = new Transaction(wallet1,wallet2,10);
  const signTx2 = tx2.signTransaction(privKey1);
  
  const tx3 = new Transaction(wallet2,wallet1,20);
  const signTx3 = tx3.signTransaction(privKey2);
  
  const mychain = new BlockChain();
  
  const newBlock = new Block(1,Date.now(),[tx1]);
  console.log(newBlock.hasValidTransactions());
  
  const newBlock2 = new Block(2,Date.now(),[tx1,tx2]);
  console.log(newBlock2.hasValidTransactions());
  
  
  mychain.addBlock(newBlock);
  mychain.addBlock(newBlock2);
  
  mychain.printBlockChain();
  
  ```

- transaction.js

  ```javascript
  var EC = require('elliptic').ec;
  var ec = new EC('secp256k1');
  const SHA256 = require('crypto-js/sha256');
  
  class Transaction {
      constructor(fromAddress,toAddress,amount){
          this.toAddress = toAddress;
          this.fromAddress = fromAddress;
          this.amount = amount;
          this.signature = undefined;
      }
      
      printTransaction(){
          console.log(JSON.stringify(this,null,2));
      }
      isValid(){
          // signature가 있는지 검사
          if(!this.signature || this.signature.length===0){
              console.log('Warn : No signature');
              return false;
          }
  
          //정상적으로 sign 되었는지 검사
          const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
          return publicKey.verify(this.calculateHash(),this.signature);
  
      }
  
      calculateHash(){
          return SHA256(this.fromAddress+this.toAddress+this.amount).toString();
      }
  
      signTransaction(privKey){
          if(privKey.getPublic('hex') !== this.fromAddress){
              console.log('Err : No permission');
              return false;
          }
          const hashTx = this.calculateHash();
          const sig = privKey.sign(hashTx,'base64');
          this.signature = sig.toDER('hex');
          return true;
      }
  }
  
  module.exports = Transaction;
  ```

  
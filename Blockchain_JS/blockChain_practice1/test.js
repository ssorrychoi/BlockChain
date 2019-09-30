const Block = require('./block');
const Transaction = require('./transaction');
const BlockChain = require('./blockchain');

let mychain = new BlockChain();
//mychain.printAllBlockchain();
console.log("*******************************");

const newTransaction = new Transaction('aaa','bbb',100);
//newTransaction.printTransaction();

const newBlock = new Block(0,Date.now(),newTransaction,'prevHash');
//newBlock.printBlock();

const newBlock2 = new Block(1,Date.now(),'data2',newBlock.curHash);
//newBlock2.printBlock();

mychain.addBlock(newBlock);
mychain.addBlock(newBlock2);

mychain.printAllBlockchain();
console.log("validation : ",mychain.isChainValid());
console.log("-----------");

mychain.chain[1].nonce=100;
console.log("validation : ",mychain.isChainValid());
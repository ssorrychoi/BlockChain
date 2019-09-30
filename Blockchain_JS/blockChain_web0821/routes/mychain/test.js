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
console.log("isChainValid : "+mychain.isChainValid());

mychain.chain[1].transactions[0].toAddress="fff";
console.log("isChainValid : "+mychain.isChainValid());

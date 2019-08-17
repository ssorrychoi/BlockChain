const Block = require('./block');
const Transaction = require('./transaction');

const newTransaction = new Transaction('aaa','bbb',100);
newTransaction.printTransaction();

const newBlock = new Block(0,Date.now(),newTransaction,'prevHash');
newBlock.printBlock();

const newBlock2 = new Block(1,Date.now(),'data2',newBlock.curHash);
newBlock2.printBlock();
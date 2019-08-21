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

// const tx1 = new Transaction('aaa','bbb',100);
// const tx2 = new Transaction('aaa','ccc',10);
// const tx3 = new Transaction('aaa','ddd',20);

const tx1 = new Transaction(wallet1,wallet2,100);
const signTx1 = tx1.signTransaction(privKey1);

const tx2 = new Transaction(wallet1,wallet2,10);
const signTx2 = tx2.signTransaction(privKey1);

const tx3 = new Transaction(wallet2,wallet1,20);
const signTx3 = tx3.signTransaction(privKey2);

// console.log(tx1.isValid());
// console.log(tx2.isValid());
// console.log(tx3.isValid());

const mychain = new BlockChain();

const newBlock = new Block(1,Date.now(),[tx1]);
console.log(newBlock.hasValidTransactions());

const newBlock2 = new Block(2,Date.now(),[tx1,tx2]);
console.log(newBlock2.hasValidTransactions());


mychain.addBlock(newBlock);
mychain.addBlock(newBlock2);

mychain.printBlockChain();

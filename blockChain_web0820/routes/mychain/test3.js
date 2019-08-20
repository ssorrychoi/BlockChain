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

const mychain = new BlockChain();
// const tx1 = new Transaction('aaa','bbb',100);
// const tx2 = new Transaction('aaa','ccc',10);
// const tx3 = new Transaction('aaa','ddd',20);

const tx1 = new Transaction(wallet1,wallet2,100);
const signTx1 = tx1.signTransaction(privKey1);

/* Test2와 다른부분 */
mychain.addTransaction(tx1);

const tx2 = new Transaction(wallet1,wallet2,10);
const signTx2 = tx2.signTransaction(privKey1);

/* Test2와 다른부분 */
mychain.addTransaction(tx2);

/* Test2와 다른부분 */
mychain.minePendingTransaction(wallet1);

const tx3 = new Transaction(wallet2,wallet1,20);
const signTx3 = tx3.signTransaction(privKey2);

mychain.addTransaction(tx2);

mychain.minePendingTransaction(wallet1);

mychain.printBlockChain();

console.log('wallet1 : ',mychain.getBalance(wallet1));
console.log('wallet2 : ',mychain.getBalance(wallet2));

console.log(">> ***********************************wallet1 txs***********************************");
console.log(JSON.stringify(mychain.getAllTransactionOfWallet(wallet1),null,2));

console.log(">> ***********************************wallet2 txs***********************************");
console.log(JSON.stringify(mychain.getAllTransactionOfWallet(wallet2),null,2));

// const mychain = new BlockChain();

// const newBlock = new Block(1,Date.now(),[tx1]);
// console.log(newBlock.hasValidTransactions());

// const tx3 = new Transaction(wallet2,wallet1,20);
// const signTx3 = tx3.signTransaction(privKey2);


// const newBlock2 = new Block(2,Date.now(),[tx1,tx2]);
// console.log(newBlock2.hasValidTransactions());


// mychain.addBlock(newBlock);
// mychain.addBlock(newBlock2);

// mychain.printBlockChain();

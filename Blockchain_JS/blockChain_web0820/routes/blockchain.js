var express = require('express');
var router = express.Router();

var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

const Block = require('./mychain/block');
const Transaction = require('./mychain/transaction');
const BlockChain = require('./mychain/blockchain');

//privateKey를 가져온다. PrivateKey와 PublicKey는 1:1관계이므로 하나만 가져오면 됨.
const userKeyStr1 = '11e06d09e9d5d20f92fecd5a76f4e26e87b05f9ff4cef659d5de5e1dc298e41a';
const userKeyStr2 = 'f1e2aa67d0a9ea89ef262a1e33a92173501f9bad968e91a4ae0bc601af4f2975';

const privKey1 = ec.keyFromPrivate(userKeyStr1);
const privKey2 = ec.keyFromPrivate(userKeyStr2);

const wallet1 = privKey1.getPublic('hex');
const wallet2 = privKey2.getPublic('hex');

const mychain = new BlockChain();

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




/* GET BlockChain page. */
/* URL : /blockchain */
router.get('/', function(req, res, next) {
  res.render('blockchain', { blocks: mychain.chain, title: "blockchain", selectedIdx:0});
});

router.get('/block/:idx',function(req,res,next){
  const selectedIdx = req.params.idx;

  res.render('blockchain', {title : "Blockchain info",blocks : mychain.chain, selectedIdx:selectedIdx,txs : mychain.chain[selectedIdx].transactions});
});

router.get('/createtx',function(req,res,next){
  res.render('createtx',{wallet : wallet1});
})

router.post('/createtx',function(req,res,next){
  const fromAddress = req.body.fromAddress;
  const toAddress = req.body.toAddress;
  const amount = req.body.amount;

  console.log('fromAddress : ',fromAddress);
  console.log('toAddress   : ',toAddress);
  console.log('amount      : ',amount);

  const tx = new Transaction(fromAddress,toAddress,amount);
  tx.signTransaction(privKey1);

  mychain.addTransaction(tx);

  console.log(mychain.pendingTransactions);
  res.redirect('/blockchain/pendingtransaction');
})

router.get('/pendingtransaction',function(req,res,next){
  let txs = mychain.pendingTransactions;
  res.render('pendingtransaction',{txs:txs});
})

router.get('/miningblock',function(req,res,next){

  console.log('mining...');
  mychain.minePendingTransaction(wallet1);
  console.log('minded...******************');

  res.redirect('/blockchain');
})


module.exports = router;

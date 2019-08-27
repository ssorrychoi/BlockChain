var express = require('express');
var router = express.Router();

var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

const Block = require('./mychain/block');
const Transaction = require('./mychain/transaction');
const BlockChain = require('./mychain/blockchain');

//privateKey를 가져온다. PrivateKey와 PublicKey는 1:1관계이므로 하나만 가져오면 됨.
const userKeyStr1 = 'f3e52665f9b9f5b07fba6de46349f80fdfc80508de8e291cdc44813ed55e3df6';
const userKeyStr2 = '88ea5e3b0d8660cb13ab517dbac34f7f12d50cd160db58220b4f8154b4493659';

const privKey1 = ec.keyFromPrivate(userKeyStr1);
const privKey2 = ec.keyFromPrivate(userKeyStr2);

const wallet1 = privKey1.getPublic('hex');
const wallet2 = privKey2.getPublic('hex');

const mychain = new BlockChain();
mychain.loadKeyStore();

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
  const amount = parseInt(req.body.amount);

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

router.get('/setting',function(req,res,next){
  
  res.render('setting');
})

router.post('/setting',function(req,res,next){
  const difficulty = parseInt(req.body.difficulty);
  const reward = parseInt(req.body.reward);

  console.log("********************************************************************");
  console.log("difficulty   : ",difficulty);
  console.log("miningReward : ",reward);

  mychain.difficulty=difficulty;
  mychain.miningReward=reward;
  console.log(wallet2);
  res.redirect('/blockchain');
})

router.get('/wallet/:idx',function(req,res,next){
  const selectedIdx = req.params.idx;
  const balance = mychain.getBalance(selectedIdx);
  const txs = mychain.getAllTransactionOfWallet(selectedIdx);
  res.render('wallet',{
    address:selectedIdx,
    balance,
    txs
  });
})

router.get('/createaccount',function(req,res,next){
  const newKey = ec.genKeyPair();
  const newAccount = {
    "PrivKey" : newKey.getPrivate('hex'),
    "PublicKey" : newKey.getPublic('hex'),
    "WalletAddress" : newKey.getPublic('hex')
  }

  mychain.accounts.push(newAccount);

  res.redirect('/blockchain/accountlist');

})

router.get('/accountlist',function(req,res,next){
  let accountList = mychain.accounts.map((el)=>{
    el.balance = mychain.getBalance(el.WalletAddress);
    return el;
  })
  console.log(accountList);

  res.render('accountlist',{accounts:accountList});
})


module.exports = router;

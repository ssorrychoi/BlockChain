---
layout: post
title: 블록체인 개발_4
subtitle: 실습(blockChain_web)
tags: [블록체인]
comments: true
---

20190820

# BlockChain + Web 연동

## express module 설치

- `express --ejs Practice3_web`
- `cd Practice3_web`
- `npm i --save crypto-js`
- `npm i --save elliptic`
- `npm i --save ejs-locals`
- `npm i -g nodemon`
- `npm i`



- app.js

  ```javascript
  ...
  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  var ejsLocals = require('ejs-locals');	//추가
  
  var app = express();
  
  // view engine setup
  app.engine('ejs',ejsLocals);	//추가
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  ...
  ```

- layout 폴더를 views폴더 안에 생성

  - header.ejs
  - head.ejs
  - layout.ejs
  - footer.ejs      4개파일 추가

- Views > blockchain.ejs

  ```ejs
  <% layout('layout/layout')%>
  <div class="container">
    <h1>BlockChain</h1>
  </div>
  
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h4>Block 1</h4>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <span>Hash</span>
            <div>123456</div>
          </li>
          <li class="list-group-item">
            <span>PrevHash</span>
            <div>123456</div>
          </li>
          <li class="list-group-item">
            <span>Nonce</span>
            <div>123456</div>
          </li>
          <li class="list-group-item">
            <span>Timestamp</span>
            <div>123456</div>
          </li>
          <li class="list-group-item">
            <span>Transactions</span>
            <div>123456</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Block 1</h4>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <span>Hash</span>
            <div>123456</div>
          </li>
          <li class="list-group-item">
            <span>PrevHash</span>
            <div>123456</div>
          </li>
          <li class="list-group-item">
            <span>Nonce</span>
            <div>123456</div>
          </li>
          <li class="list-group-item">
            <span>Timestamp</span>
            <div>123456</div>
          </li>
          <li class="list-group-item">
            <span>Transactions</span>
            <div>123456</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  ```

- Routes > blockchain.js

  ```javascript
  var express = require('express');
  var router = express.Router();
  
  /* GET BlockChain page. */
  /* URL : /blockchain */
  router.get('/', function(req, res, next) {
    res.render('blockchain', { title: 'Express' });
  });
  
  module.exports = router;
  ```

- public > stylesheets > style.css

  ```css
  .card {
    width: 18rem;
    display: inline-block;
    margin: 0 10px 0 0;
   }
  ```

- Routes > mychain 폴더 생성

- Routes > blockchain.js

  ```javascript
  //routes > mychain > test3.js 내용을 복붙
  
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
  
  mychain.addTransaction(tx1);
  
  const tx2 = new Transaction(wallet1,wallet2,10);
  const signTx2 = tx2.signTransaction(privKey1);
  
  mychain.addTransaction(tx2);
  
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
    res.render('blockchain', { blocks: mychain.chain, title: "blockchain" });
  });
  
  module.exports = router;
  ```

- views > blockchain.ejs

  ```ejs
  <% layout('layout/layout')%>
  <div class="container">
    <h1>BlockChain</h1>
  </div>
  
  <div class="container" style="overflow-x : scroll; white-space: nowrap">
    <%
    for(var i=0;i<blocks.length;i++){
      %>
    <div class="card">
      <div class="card-header">
        <h4>Block <%= blocks[i].index%></h4>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <span>Hash</span>
            <div><%= blocks[i].curHash%></div>
          </li>
          <li class="list-group-item">
            <span>PrevHash</span>
            <div><%= blocks[i].prevHash%></div>
          </li>
          <li class="list-group-item">
            <span>Nonce</span>
            <div><%= blocks[i].nonce%></div>
          </li>
          <li class="list-group-item">
            <span>Timestamp</span>
            <div><%= blocks[i].timestamp%></div>
          </li>
          <li class="list-group-item">
            <span>Transactions</span>
            <div>toAddress : <%= blocks[i].transactions.toAddress%></div>
            <div>fromAddress : <%= blocks[i].transactions.fromAddress%></div>
            <div>amount : <%= blocks[i].transactions.amount%></div>
  
          </li>
        </ul>
      </div>
    </div>
    <br>
    <%
   		 }
    %>
  </div>
  ```

  



## 특정 트랜잭션 블록

- routes > blockchain.js

  ```javascript
  /* GET home page. */
  /* url : /blockchain */
  router.get('/', function(req, res, next) {
    res.render('blockchain', {blocks: mychain.chain, title:"blockchain", selectedIdx: 0});
  });
  
  router.get('/block/:idx', function(req, res, next) {
    const selectedIdx = req.params.idx;
  
    res.render('blockchain',
               {title: "Blockchain info"
                , blocks: mychain.chain
                , selectedIdx : selectedIdx
                , txs : mychain.chain[selectedIdx].transactions}
              )
  });
  
  router.get('/createtx', function (req, res, next) {
    res.render('createtx', {wallet : wallet1});
  })
  
  router.post('/createtx', function (req, res, next) {
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
  
    console.log('fromAddress : ', fromAddress);
    console.log('toAddress : ', toAddress);
    console.log('amount : ', amount);
  
    const tx = new Transaction(fromAddress, toAddress, amount);
    tx.signTransaction(privKey1);
    mychain.addTransaction(tx);
  
    console.log(mychain.pendingTransactions);
    res.redirect('/pendingtransaction');
  })
  
  module.exports = router;
  
  ```

- views > Blockchain.ejs

  ```ejs
  <div class="container">
  
    <% if(selectedIdx > 0) { %>
    <h1>Transaction List (Block <%=selectedIdx%>)</h1>
  
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>From</th>
          <th>To</th>
          <th>Amount</th>
          <th>Valid?</th>
        </tr>
      </thead>
      <tbody>
        <tr> 
          <td>0</td>
          <td><%=txs[0].fromAddress%></td>
          <td><%=txs[0].toAddress%></td>
          <td><%=txs[0].amount%></td>
          <td><span>✓</span></td>
        </tr>
      </tbody>
    </table>
    <% } %>
  </div>
  ```



## Transaction 생성

- Routes > blockchain.js

  ```javascript
  ...
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
    ...
  ```

- views > createtx.ejs

  ```ejs
  <% layout('layout/layout')%>
  <div class="container">
    <h1>Create Transaction</h1>
  
    <form action="/blockchain/createtx" method="post">
      <div class="form-group">
        <label for="fromAddress">From Address</label>
        <input type="text" class="form-control" id="fromAddress" name="fromAddress" value="<%=wallet%>" readonly>
      </div>
      <div class="form-group">
        <label for="fromAddress">To Address</label>
        <input type="text" class="form-control" id="toAddress" name="toAddress" value="">
      </div>
      <div class="form-group">
        <label for="fromAddress">Amount</label>
        <input type="text" class="form-control" id="amount" name="amount" value="">
      </div>
      <button type="submit" class="btn btn-primary">Transit</button>
    </form>
  </div>
  ```

- views > blockchain.ejs

  ```ejs
  <div class="container">
    <%
    if(selectedIdx > 0){
      %>
    <h1>Transaction List</h1> (Block <%=selectedIdx %>)</h1>
  <table class="table table-hover table-striped">
    <thead>
      <th>#</th>
      <th class="text-truncate" style="max-width:150px">From</th>
      <th class="text-truncate" style="max-width:150px">To</th>
      <th>Amount</th>
      <th>Valid?</th>
    </thead>
    <tbody>
      <% 
      txs.forEach(function(el,idx){
        %>
      <tr>
        <td>0</td>
        <td class="text-truncate" style="max-width:150px"><%=el.fromAddress%></td>
        <td class="text-truncate" style="max-width:150px"><%=el.toAddress%></td>
        <td><%=el.amount%></td>
        <td></td>
      </tr>
      <%
      });
      %>
  
    </tbody>
  </table>
  <%
  }
    %>
  </div> 
  ```
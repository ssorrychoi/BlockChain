20190821

## Difficulty / miningReward 설정하기

- Setting page로 넘어가는 버튼 만들기

- views > layout > header.ejs

  ```ejs
  ...
  <div>
    <a href="/blockchain/pendingtransaction"class="btn btn-outline-light">Pending TX</a>
    <a href="/blockchain/setting"class="btn btn-outline-light">Settings</a>
    <a href="/blockchain/createtx" class="btn btn-outline-light">Create TX</a>
  </div>
  ...
  ```

- 우선 setting page를 만들기

- views > setting.ejs

  ```ejs
  <% layout('layout/layout')%>
  <div class="container">
    <h1>Settings</h1>
  
    <form action="/blockchain/setting" method="post">
      <div class="form-group">
        <label for="fromAddress">블록체인 난이도 설정 (Difficulty)</label>
        <input type="text" class="form-control" id="difficulty" name="difficulty" value="">
      </div>
      <div class="form-group">
        <label for="fromAddress">블록체인 보상 설정 (Reward)</label>
        <input type="text" class="form-control" id="reward" name="reward" value="">
      </div>
      <button type="submit" class="btn btn-primary">적용</button>
    </form>
  
  </div>
  ```

- routes > blockchain.js

  ```javascript
  ...
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
    res.redirect('/blockchain');
  })
  ...
  ```



## Wallet 페이지

- views > wallet.ejs

  ```ejs
  <% layout('layout/layout')%>
  <div class="container">
    <h1>Wallet</h1>
    <h3>Address : </h3>
    <%=address%>
    <h3>Balance : </h3>
    <%=balance%>
  </div>
  
  <div class="container">
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
        })
          %>
      </tbody>
    </table>
  </div>
  ```

- routes > blockchain.js

  ```javascript
  ...
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
  ...
  ```

- blockchain.ejs에서 Block을 누르면 Transaction List가 나오는데 이걸 눌렀을때 Wallet Page로 연결하기

- blockchain.ejs

  ```ejs
  <tbody>
    <% 
    txs.forEach(function(el,idx){
      %>
    <tr>
      <td>0</td>
      <td class="text-truncate" style="max-width:150px"><a href="../wallet/<%=el.fromAddress%>"><%=el.fromAddress%></a></td>
      <td class="text-truncate" style="max-width:150px"><a href="../wallet/<%=el.toAddress%>"><%=el.toAddress%></a></td>
      <td><%=el.amount%></td>
      <td></td>
    </tr>
    <%
    });
    %>
  
  </tbody>
  ```



## 계정 생성

- header.ejs

  ```ejs
  ...
  <div>
    <a href="/blockchain/accountlist"class="btn btn-outline-light">AccountList</a>
    <a href="/blockchain/pendingtransaction"class="btn btn-outline-light">Pending TX</a>
    <a href="/blockchain/setting"class="btn btn-outline-light">Settings</a>
    <a href="/blockchain/createtx" class="btn btn-outline-light">Create TX</a>
  </div>
  ...
  ```

- views > accountlist.ejs

  ```ejs
  <% layout('layout/layout')%>
  <div class="container">
    <h1>Account List</h1>
    <% if(accounts != undefined) { %>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Address</th>
          <th>Balance</th>
          <th>Function</th>
        </tr>
      </thead>
      <tbody>
        <% accounts.forEach( function (el, idx) { %>
        <tr> 
          <td><%=idx%></td>
          <td class="text-truncate" style="max-width: 150px;"><%=el.WalletAddress%></td>
          <td class="text-truncate" style="max-width: 150px;"><%=el.balance%></td>
          <td><a href="/blockchain/wallet/<%=el.WalletAddress%>" class="btn btn-dark">상세 보기</a></td>
        </tr>
        <% }) %>
      </tbody>
    </table>
    <% } %>
    <a href="/blockchain/createaccount" class="btn btn-primary">계정 생성</a>
  </div>
  ```

- Blockchain.js

  ```javascript
  ...
  router.get('/accountlist',function(req,res,next){
    let accountList = mychain.accounts.map((el)=>{
      el.balance = mychain.getBalance(el.WalletAddress);
      return el;
    })
    console.log(accountList);
    res.render('accountlist',{accounts:accountList});
  })
  ...
  ```

- Blockchain.js

  ```javascript
  ...
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
  ...
  ```

- 계정 생성 버튼을 누를때마다 계정이 생성됨

  > [ { PrivKey:
  >
  > ​     '1828f9104d539c08bcde9d9095d975ab783bf0fae24f4436c33cf8a5c69582b6',
  >
  > ​    PublicKey:
  >
  > '042bcee9dd2069c2c44c812afbdbd65a6956b09d8a72cde9f49f819bfe993076b0ed66a2a81a9e4dee6e20
  >
  > 226a68cfdf86db99b4c0cea653745ffcb8a8b22288c8',
  >
  > ​    WalletAddress:
  >
  > ​     
  >
  > '042bcee9dd2069c2c44c812afbdbd65a6956b09d8a72cde9f49f819bfe993076b0ed66a2a81a9e4dee6e20
  >
  > 226a68cfdf86db99b4c0cea653745ffcb8a8b22288c8',
  >
  > ​    balance: 0 },
  >
  >   { PrivKey:
  >
  > ​     'abe00a286d40ad3a1715cea8c49868ddb7894fa4b4dec82ace82954277b3c571',
  >
  > ​    PublicKey:
  >
  > '04bf6b65809f4d8581fcfe30e0c60d38d858a49914792bb17f5ff3182a9eaed65b1776ceb359cce36afd0566f
  >
  > bc0f427d8bed87405eed09cc68fde9d949f87bd2e',
  >
  > ​    WalletAddress:
  >
  > ​     
  >
  > '04bf6b65809f4d8581fcfe30e0c60d38d858a49914792bb17f5ff3182a9eaed65b1776ceb359cce36afd0566f
  >
  > bc0f427d8bed87405eed09cc68fde9d949f87bd2e',
  >
  > ​    balance: 0 },
  >
  >   ...



-> 계정이 원래 하드코딩 해놓은 2개의 계정이 안보임



## 기존의 계정 보이기

- routes > blockchain.js

  ```javascript
  ...
  const mychain = new BlockChain();
  mychain.loadKeyStore();
  ...
  ```

- Routes > blockchain.js

  ```javascript
  ...
  //privateKey를 가져온다. PrivateKey와 PublicKey는 1:1관계이므로 하나만 가져오면 됨.
  const userKeyStr1 = 'f3e52665f9b9f5b07fba6de46349f80fdfc80508de8e291cdc44813ed55e3df6';
  const userKeyStr2 = '88ea5e3b0d8660cb13ab517dbac34f7f12d50cd160db58220b4f8154b4493659';
  ...
  ```

  

## 


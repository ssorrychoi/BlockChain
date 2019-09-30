## ethRouter.js

- accountList

  ```javascript
  router.get('/accountlist',function(req,res,next){
    web3.eth.getAccounts()
      .then(async accounts=>{
        let accountList = [];
  
        for(let i=0;i<accounts.length;i++){
          let balance = await web3.eth.getBalance(accounts[i]);
          accountList.push({
            WalletAddress:accounts[i],
            balance : web3.utils.fromWei(balance,"ether")	//ether단위로 변환
          })
        }
        res.render('accountlist',{accounts:accountList});
      })
  })
  ```

- createAccount

  ```javascript
  router.get('/createaccount', async function(req,res,next){
    web3.eth.personal.newAccount("eth")
      .then(()=>{
        res.redirect('/eth/accountlist');
      })
      .catch(()=>{
        console.log("Err : create account error");
        res.redirect('/eth/accountlist');
      });
  })
  ```



## keyextract.js

- 새로 생성

  ```javascript
  var Web3 = require('web3');
  var web3 = new Web3('http://localhost:8545');
  
  //chaindata > keystore > coinbase => 0번째 address
  const keystore = {
      "address":"9add686bc075735225a53fe9412c21fc28a4d6c1",
      "crypto":{
          "cipher":"aes-128-ctr",
          "ciphertext":"c7e713f42ab3d4051bbdeb3cadff5ac6e2848219abe87c0cfd47dcebc310442b",
          "cipherparams":{"iv":"136ec2d61274a9a45d05dd56f7057da2"},
          "kdf":"scrypt",
          "kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"c7735990f3ce0df7abbd176028844eb4255e52ce0191c71d9ea06d3a488cefe3"},
          "mac":"1ea7e817a7ff07159b72df9cdde1ef0fb3aa967eef6b3b646773a839cb93c1ae"
      },
      "id":"ad54361e-4f53-4b19-a5b7-5c1d44074a2b","version":3
  };
  const decryptAccount = web3.eth.accounts.decrypt(keystore,'1234'); //password
  console.log(decryptAccount.privateKey); //privateKey : 0xb4d359173e37931117863ade346129f8901cb15f6863adc1642667959aa4f368
  ```

  
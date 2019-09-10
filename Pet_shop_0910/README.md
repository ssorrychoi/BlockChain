---
layout: post
title: Solidity_7
subtitle: Truffle(Pet-shop),Infura,Ropsten
categories: [Solidity]
tags: [solidity,Smart contract]
comments: true

---

20190910

## Pet SHOP

- Box 종류 중의 하나

- 쇼핑몰 비슷한 React와 Ethereum의 결과물

- `truffle unbox pet-shop`

- contract > Adoption.sol

  ```javascript
  pragma solidity >=0.4.22 <0.6.0;
   
  contract Adoption {
     address[16] public adopters;
   
     function adopt(uint petId) public returns (uint) {
         require(petId >= 0 && petId <= 15);
         adopters[petId] = msg.sender;
         return petId;
     }
   
     // Retrieving the adopters
     function getAdopters() public view returns (address[16] memory) {
         return adopters;
     }
  }
  ```

✔️app.js 에 contract 연결해보기

- initWeb3

  ```javascript
  initWeb3: async function() {
    console.log('web3 is not defined..');
    // set the provider you want from Web3.providers
    App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  }
  //Web3를 연결하기 위한 기본 구조이다.
  ```

- initContract

  ```javascript
  initContract: function() {
    $.getJSON('Adoption.json', function(data) {	
      // Adoption.sol로 contract를 만들었기 때문에
      // compile 하고 migrate를 하면 Adoption.json이라는 파일이 생긴다.
      
      // test해보기
      console.log('success to load tt...',data);
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
  
      // Set the provider for our contract.
      App.contracts.Adoption.setProvider(App.web3Provider);
      return App.markAdopted();
    });
  
    return App.bindEvents();
  },
    bindEvents: function() {
      $(document).on('click', '.btn-adopt', App.handleAdopt);
    },
  ```

- markedAdopted

  ```javascript
  markAdopted: function(adopters, account) {
    // contract / UI / JS 
    // UI가 들어오면 adopt를 16개 보여주는데 실제 adopt되어있는지는 모른다.
    // DB대신 블록체인을 활용해 adopt된 정보를 가져오기
  
    var adoptionInstance;
  
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
  
      return adoptionInstance.getAdopters.call();	//Adoption.sol에 정의되어 있는 함수 불러오기
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  ```

- handleAdopt

  ```javascript
  handleAdopt: function(event) {
    event.preventDefault();
  
    var petId = parseInt($(event.target).data('id'));
  
    console.log("입양되었습니다.");
    var adoptionInstance;
  
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        alert('Adopted Successful!');
        console.log(petId);
        console.log(account);
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
  ```

  

## Infura

- https://infura.io/  => 여기서 제공하는 노드를 이용할것.

- Infura에서 제공하는 key를 받아야한다.

- ROPSTEN network api key => `ropsten.infura.io/v3/api_key`

- Truffle-config.js

  ```javascript
  var HDWalletProvider = require("truffle-hdwallet-provider");
  //require('dotenv').config();
   
  var infura_apikey = "api_key";
  var mnemonic = "시드단어";
  
  console.log("infura_apikey = ", infura_apikey);
  console.log("mnemonic = ", mnemonic);
   
  module.exports = {
    networks: {
      development: {
        host: "localhost",
        port: 8545,
        network_id: "*" // Match any network id
      },
      ropsten: {
        provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
        network_id: 3
      }
    }
  };
  ```

- `yarn add truffle-hdwallet-provider`

- `truffle compile --all`

- `truffle migrate --reset --network ropsten`

- `npm i --save dotenv`

- root 폴더에 `.env` 파일 생성

- .env

  ```
  API_KEY="api_key"
  MNEMONIC="시드단어"
  ```

- truffle-config.js

  ```javascript
  var HDWalletProvider = require("truffle-hdwallet-provider");
  require('dotenv').config(); // .env 파일안에 있는 모든 것들이 사용할 수 있게됨.
                              // 따라서 밑에 정의했던 변수들도 바꿔줘야됨.
   
  //var infura_apikey = "api_key";
  //var mnemonic = "시드단어";
   
  var infura_apikey = process.env.API_KEY;
  var mnemonic = process.env.MNEMONIC;
  
  console.log("infura_apikey = ", infura_apikey);
  console.log("mnemonic = ", mnemonic);
   
  module.exports = {
    networks: {
      development: {
        host: "localhost",
        port: 8545,
        network_id: "*" // Match any network id
      },
      ropsten: {
        provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
        network_id: 3
      }
    }
  };
  ```

  
---
layout: post
title: Solidity_6
subtitle: ERC20, metamask
tags: [solidity,Smart contract]
comments: true
---

20190909

## ERC20

- 이더리움 표준 토큰 규격
  - Ethereum RFC 20번째 규격
  - 이더리움 토큰이 따라야 하는 표준 규격 정의
  - 사실상 ICO 표준
  - EOS, ICON등이 ERC20으로 탄생
- ERC20 특징
  - 총 발행량    : Total Supply
  - 송금           : Transfer
  - 유저간 송금 : TransferFrom
  - 잔액           : BalanceOf
- Ethereum 표준 규격
  - https://theethereum.wiki/w/index.php/ERC20_Token_Standard
  - https://github.com/ethereum/eips/issues/20`



## 실습

- `mkdir ERC20_myToken`

- `truffle unbox tutorialtoken`

  ❌truffle 에는 여러가지 box가 있지만 첫 1단계는 solidity로만 이루어진 `metacoin` 을  했었고 두번째는 Web으로 연동까지 할 수 있는 `tutorialtoken`❌

- version 

  ***✔️결과화면***

  ```
  truffle(develop)> version
  
  Truffle v5.0.35 (core: 5.0.35)
  Solidity v0.5.8 (solc-js)
  Node v10.16.0
  Web3.js v1.2.1
  ```

- conctracts > Migrations.sol

  ```javascript
  pragma solidity ^0.5.8; //solidity version 바꿔주기
  ```

- 새로운 terminal 열고 `npm run dev` 하면 web 페이지가 열린다.

- `npm install --save openzeppelin-solidity`

- ERC20_myToken > node_modules > openzeppelin-solidity > contracts > token > ERC20 > ERC20.sol

- Openzeppelin-solidity 를 설치하면 Node_modules에 폴더가 생긴다.

- contracts > TutorialToken.sol

  ```javascript
  pragma solidity ^0.5.8;
  
  import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
  import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
  
  contract TutorialToken is ERC20Detailed, ERC20{ // ERC20Detailed 와 ERC20 두가지를 상속받음.
      uint public initialSupply = 1000e18;    //최초 토큰 수
  
  
      constructor (string memory _name, string memory _symbol, uint8 _decimals, uint _initialSupply)
          // 생성자 생성 & 인자를 받아서 초기화 가능(initialSupply) & uint는 memory를 붙여줄 필요가 없다.
          ERC20Detailed(_name,_symbol,_decimals) public { // 상위의 생성자 호출
              initialSupply = _initialSupply ** _decimals;
              _mint(msg.sender,initialSupply);
      }
  }
  ```

- Migrations > 2_deploy_migration.js

  ```javascript
  var TutorialToken = artifacts.require("./Tutorialtoken.sol");
  
  const _name = "TutorialToken";
  const _symbol = "TTK";
  const _decimals = 18;
  const _initialSupply = 10000;
  
  module.exports = function(deployer) {
    deployer.deploy(TutorialToken,_name,_symbol,_decimals,_initialSupply);
  };
  ```

- `compile --all`

- `migrate --reset`

  ***✔️결과화면***

  ![image](https://user-images.githubusercontent.com/43080040/64504560-14e28000-d30b-11e9-93af-0c9fb5563826.png)

- 두번째 계정에 100 보내기

  ***✔️결과화면***

  ![image](https://user-images.githubusercontent.com/43080040/64504889-b8806000-d30c-11e9-8fc5-2a1d0aa0cbca.png)

❌`truffle develop>`에서 compile 하고 migrate를 하는것은 9545 포트의 블록체인에 배포를 하는것이고,

❌`~/ERC20 $` 에서 `truffle compile` 하고 `truffle migrate` 하는 것은 Ganache 블록체인에 배포하는 것이다.

## MetaMask

- Chrome Web store에서 metamask 설치

- 자체적으로 Geth를 내장하고 있음.(solid drive basket broken sea hungry fat team mutual cactus casino second)

- truffle.js

  ```javascript
  module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
      development: {
        host: "127.0.0.1",
        port: 8545,	// 8545로 바꿔줌
        network_id: "*" // Match any network id
      }
    }
  };
  ```

- Metamask를 Ganache에 연결하기
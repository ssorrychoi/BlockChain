---
layout: post
title: Solidity_5
subtitle: Truffle / Truffle Boxes / Truffle init
tags: [solidity,Smart contract]
comments: true
---

20190906

## Truffle Framework

- 스마트 계약 개발에 필요한 컴파일,링크,배포, 바이너리 관리 기능이 있어 통합 개발 관리를 할 수 있다.

- 빈폴더 생성 `mkdir truffleTest`

- `cd truffleTest`

- `sudo npm i -g truffle`

- `truffle init`

- `truffle compile`

  ***결과화면***

  ```
  ip-70-12-224-174:truffleTest ssorrychoi$ truffle compile
  
  Compiling your contracts...
  ===========================
  > Compiling ./contracts/Migrations.sol
  > Artifacts written to /Users/ssorrychoi/Desktop/Practice/Geth/truffleTest/build/contracts
  > Compiled successfully using:
     - solc: 0.5.8+commit.23d335f2.Emscripten.clang
  ```

- Ganache Truffle을 켜준다.

- Truffle-config.js에서 development 부분의 주석을 풀고 host, port, network-id를 Ganache와 통신하게 맞춰준다.

- `truffle migrate`

  ***결과화면***

  ```
  ip-70-12-224-174:truffleTest ssorrychoi$ truffle migrate
  
  Compiling your contracts...
  ===========================
  > Everything is up to date, there is nothing to compile.
  
  Starting migrations...
  ======================
  > Network name:    'development'
  > Network id:      5678
  > Block gas limit: 0x6691b7
  
  1_initial_migration.js
  ======================
  
     Deploying 'Migrations'
     ----------------------
     > transaction hash:    0x462ff4c1f60e11b23b35ab6f6f1c8cf07bdb3ee3321351ffe36637c0c5b10ba7
     > Blocks: 0            Seconds: 0
     > contract address:    0x84BC4A707f9395F975507990cEC9f3b4395Fc48e
     > block number:        8
     > block timestamp:     1567733006
     > account:             0xc66e60472D391375952B5B18D24194453A2c6A65
     > balance:             99.97185032
     > gas used:            261393
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00522786 ETH
  
     > Saving migration to chain.
     > Saving artifacts
     -------------------------------------
     > Total cost:          0.00522786 ETH
  
  Summary
  =======
  > Total deployments:   1
  > Final cost:          0.00522786 ETH
  ```

- `truffle develop`

  - console ganache와 같은 환경을 제공한다. 10개의 address를 제공

    ```
    ip-70-12-224-174:truffleTest ssorrychoi$ truffle develop
    Truffle Develop started at http://127.0.0.1:9545/
    
    Accounts:
    (0) 0x27663c5d7d59017c084068feb02f104178ee413a
    (1) 0xc86eae03b6dce85c7a0da0b2b4e785d608516c3c
    (2) 0x8b408cf1f92ed2ea11e7d946881661d22bc657c8
    (3) 0x7e7b6706787680d6dd005fdd902e5d1d23ca3c60
    (4) 0xe6337a6b790491a2f4a8c838d820b542fc68b70b
    (5) 0xcfda48d9bfd6254de713258131212d383ee6207a
    (6) 0x3d2358b3eea6a1be4ed8da33dae11e5c0b9b184b
    (7) 0x029fc6501cb99fe3e138480af4be47c06a5ef8df
    (8) 0xc12cb5b9dc76cf75df4699dbb74c8d5f8a8ca03c
    (9) 0x6e6765f9152d8976f2c74f08437ece160a7af526
    
    Private Keys:
    (0) f69812af966d9e3671ffd530b2eb50985b6b0f6a2932ddbe2814106a2e8bb5cf
    (1) 4d5ba0ae6679270522d16b6131d99f1e1483218ea413d98ffda6e35d9c4d4c38
    (2) 223027d08f70da59071240c38e9064c9cb787e4f5649d00d15cd586dd45a663d
    (3) ac089494aa718480840210bcdaaa4f983a15f5dbc8084371853f3c3d4dbdcd10
    (4) 8881ecea6ac6cc4660cc6598c031e61f18df67d998bdfec8d4c116839dacb57f
    (5) e643982482d9af56f387c30b7431a3f975b733411c08ef4a44bfebd148140d91
    (6) 9b1906042866a36cfb0f074e724e81aced76d557110db939da62ef32c2ab8dbb
    (7) 158998b443f2d5f15564c29b29a0722e2b3db05ef1336fd72b90c36b6705d194
    (8) d69e33a3aaad6cab654807f4b49b7e9e4d2fb9ba80bb7a0cafbe76fa341a6097
    (9) f90390d55c9f6f24454c7c547295d2dc5359e715665ad8ebfa1ea1300db32f00
    
    Mnemonic: satisfy random point scare mass jelly dizzy rapid basket fragile auction timber
    
    ⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.
    Ensure you do not use it on production blockchains, or else you risk losing funds.
    
    truffle(develop)>
    //위와 같이 바뀌어져있다.
    ```

  - truffle develop과 geth와의 차이점 : 소스코드로 관리가 가능하다.

- `truffle(develop)> migrate`

  ***결과화면***

  ```
  truffle(develop)> migrate
  
  Compiling your contracts...
  ===========================
  > Everything is up to date, there is nothing to compile.
  
  Starting migrations...
  ======================
  > Network name:    'develop'
  > Network id:      5777
  > Block gas limit: 0x6691b7
  
  1_initial_migration.js
  ======================
  
     Deploying 'Migrations'
     ----------------------
     > transaction hash:    0x8dd80aaf154d8b40bba761486428f74f708453bb00fcbcb1963dd820c6e1c166
     > Blocks: 0            Seconds: 0
     > contract address:    0x2B89116f91A5863B7ce61D66bb37683b4C23E916
     > block number:        1
     > block timestamp:     1567733581
     > account:             0x27663c5D7d59017C084068FeB02f104178eE413A
     > balance:             99.99477214
     > gas used:            261393
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00522786 ETH
  
     > Saving migration to chain.
     > Saving artifacts
     -------------------------------------
     > Total cost:          0.00522786 ETH
  
  Summary
  =======
  > Total deployments:   1
  > Final cost:          0.00522786 ETH
  ```

- **Truffle 명령어**

  - *accounts*

    ```
    truffle(develop)> accounts
    [ '0x27663c5D7d59017C084068FeB02f104178eE413A',
      '0xC86eAE03B6dcE85c7a0da0B2B4E785D608516c3C',
      '0x8b408cF1f92ed2eA11e7d946881661D22BC657C8',
      '0x7e7B6706787680D6Dd005fDd902e5D1D23ca3C60',
      '0xe6337A6b790491A2F4a8c838d820B542FC68b70B',
      '0xCFda48d9bfd6254dE713258131212D383EE6207a',
      '0x3D2358b3eeA6A1Be4ed8da33dAe11E5C0B9B184b',
      '0x029FC6501cb99fe3E138480aF4bE47c06a5eF8df',
      '0xC12CB5B9DC76cF75df4699dbb74c8D5F8A8cA03C',
      '0x6e6765f9152d8976f2C74f08437ecE160A7AF526' ]
    ```

  - https://www.trufflesuite.com/docs/truffle/reference/truffle-commands



## Truffle Boxes

- Truffle을 쓰는 가장 큰 이유임.

- 새로운 폴더 생성 `mkdir metacoin`

- `cd metacoin`

- `truffle unbox metacoin`

  ***결과화면***

  ```
  ip-70-12-224-174:metacoin ssorrychoi$ truffle unbox metacoin
  
  ✔ Preparing to download
  ✔ Downloading
  ✔ Cleaning up temporary files
  ✔ Setting up box
  
  Unbox successful. Sweet!
  
  Commands:
  
    Compile contracts: truffle compile
    Migrate contracts: truffle migrate
    Test contracts:    truffle test
  ```

- 하나의 완전한 프로젝트가 생성됨

- `compile  (--all)`

  ```
  truffle(develop)> compile
  
  Compiling your contracts...
  ===========================
  > Compiling ./contracts/ConvertLib.sol
  > Compiling ./contracts/MetaCoin.sol
  > Compiling ./contracts/Migrations.sol
  > Artifacts written to /Users/ssorrychoi/Desktop/Practice/Geth/metacoin/build/contracts
  > Compiled successfully using:
     - solc: 0.5.8+commit.23d335f2.Emscripten.clang
  ```

- `migrate (--reset)` - *블록체인에 배포*

  ```
  truffle(develop)> migrate
  
  Compiling your contracts...
  ===========================
  > Everything is up to date, there is nothing to compile.
  
  Starting migrations...
  ======================
  > Network name:    'develop'
  > Network id:      5777
  > Block gas limit: 0x6691b7
  
  1_initial_migration.js
  ======================
  
     Deploying 'Migrations'
     ----------------------
     > transaction hash:    0x35f7ba8da8eee1a53d8aa8c3cb10fb80d245b82680d408f9676f966f49d2b74d
     > Blocks: 0            Seconds: 0
     > contract address:    0x2B89116f91A5863B7ce61D66bb37683b4C23E916
     > block number:        1
     > block timestamp:     1567734394
     > account:             0x27663c5D7d59017C084068FeB02f104178eE413A
     > balance:             99.99477214
     > gas used:            261393
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00522786 ETH
  
     > Saving migration to chain.
     > Saving artifacts
     -------------------------------------
     > Total cost:          0.00522786 ETH
  
  2_deploy_contracts.js
  =====================
  
     Deploying 'ConvertLib'
     ----------------------
     > transaction hash:    0xfccae2ccc23968d046c2371deebb3a598a386c72ac0e45737a54b5a26c2288e7
     > Blocks: 0            Seconds: 0
     > contract address:    0xAb289b742F51122106B36bb04aA59324270e4770
     > block number:        3
     > block timestamp:     1567734394
     > account:             0x27663c5D7d59017C084068FeB02f104178eE413A
     > balance:             99.99185922
     > gas used:            103623
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00207246 ETH
  
     Linking
     -------
     * Contract: MetaCoin <--> Library: ConvertLib (at address: 0xAb289b742F51122106B36bb04aA59324270e4770)
  
     Deploying 'MetaCoin'
     --------------------
     > transaction hash:    0xadd1049ee1452fb421522d6b4d3aa42921505dd10a485482a54cf2c892541269
     > Blocks: 0            Seconds: 0
     > contract address:    0x1eCB591622e945D560868E5BE5BaCDf7E342d017
     > block number:        4
     > block timestamp:     1567734394
     > account:             0x27663c5D7d59017C084068FeB02f104178eE413A
     > balance:             99.98509224
     > gas used:            338349
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00676698 ETH
  
  
     > Saving migration to chain.
     > Saving artifacts
     -------------------------------------
     > Total cost:          0.00883944 ETH
  
  Summary
  =======
  > Total deployments:   3
  > Final cost:          0.0140673 ETH
  ```

- `test`

- ```
  truffle(develop)> test
  Using network 'develop'.
  
  
  Compiling your contracts...
  ===========================
  > Compiling ./test/TestMetaCoin.sol
  
    TestMetaCoin
      ✓ testInitialBalanceUsingDeployedContract (67ms)
      ✓ testInitialBalanceWithNewMetaCoin (53ms)
  
    Contract: MetaCoin
      ✓ should put 10000 MetaCoin in the first account
      ✓ should call a function that depends on a linked library (40ms)
      ✓ should send coin correctly (152ms)
  
    5 passing (6s)
  ```

- 함수 사용해보기(Metacoin.sol)

- ```
  truffle(develop)> let Mycontract = await MetaCoin.deployed()
  undefined					//비동기 함수이므로 await을 붙여준다.
  
  truffle(develop)> let balance = await Mycontract.getBalance(accounts[0])
  undefined
  
  truffle(develop)> balance
  <BN: 2710>
  
  truffle(develop)> balance.toNumber()
  10000
  
  truffle(develop)> Mycontract.sendCoin(accounts[1],500)
  { tx:
     '0xf09006701268ae202a9a18e7b851d9f38953fe8091daca56592256a208923643',
    receipt:
     { transactionHash:
        '0xf09006701268ae202a9a18e7b851d9f38953fe8091daca56592256a208923643',
       transactionIndex: 0,
       blockHash:
        '0xcc6ffc932a96f9541fc4a4a66d758becedbe20d2badebadf699d4a46137415c4',
       blockNumber: 17,
       from: '0x27663c5d7d59017c084068feb02f104178ee413a',
       to: '0x36ad36b1c57233075f06a60b512c63f820d810fd',
       gasUsed: 51072,
       cumulativeGasUsed: 51072,
       contractAddress: null,
       logs: [ [Object] ],
       status: true,
       logsBloom:
        '0x00000000000000000100000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000002000000000000040000000008000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000800000000000000002000000000000000000000000000000100000000000000000000000040000000000000000000000',
       v: '0x1b',
       r:
        '0xed3daf55ca896727360f2d27c3e5af354866f4b45ab15940d36cb3a674c3af85',
       s:
        '0x486419caa8811e787825151de713e46df5f6a40089ca11c76a77d45e301dfcf6',
       rawLogs: [ [Object] ] },
    logs:
     [ { logIndex: 0,
         transactionIndex: 0,
         transactionHash:
          '0xf09006701268ae202a9a18e7b851d9f38953fe8091daca56592256a208923643',
         blockHash:
          '0xcc6ffc932a96f9541fc4a4a66d758becedbe20d2badebadf699d4a46137415c4',
         blockNumber: 17,
         address: '0x36ad36B1c57233075F06a60B512C63f820D810FD',
         type: 'mined',
         id: 'log_4eccb178',
         event: 'Transfer',
         args: [Result] } ] }
         
  truffle(develop)> let received_1 = await Mycontract.getBalance(accounts[1])
  undefined
  
  truffle(develop)> received_1.toNumber()
  500
  
  truffle(develop)> let newBalance = await Mycontract.getBalance(accounts[0])
  undefined
  
  truffle(develop)> newBalance.toNumber()
  9500
  ```

- Contracts > TestContract.sol

  ```
  pragma solidity ^0.5.8;
  
  contract TestContract {
      string value;
      
      constructor() public {
          
      }
      // get 
      function getValue() public view returns (string memory){
          return value;
      }
  
      // set
      function setValue(string memory _value) public{
          value = _value;
      }    
  }
  ```

- Migrations > 3_deploy_testcontract.js

  ```javascript
  const TestContract = artifacts.require("TestContract");
  
  module.exports = function(deployer) {
    deployer.deploy(TestContract);
  };
  ```

- `compile --all`

  ***결과화면***

  ```
  truffle(develop)> compile --all
  
  Compiling your contracts...
  ===========================
  > Compiling ./contracts/ConvertLib.sol
  > Compiling ./contracts/MetaCoin.sol
  > Compiling ./contracts/Migrations.sol
  > Compiling ./contracts/TestContract.sol
  > Artifacts written to /Users/ssorrychoi/Desktop/Practice/Geth/metacoin/build/contracts
  > Compiled successfully using:
     - solc: 0.5.8+commit.23d335f2.Emscripten.clang
  ```

- `migrate --reset`

  ```
  truffle(develop)> migrate --reset
  
  Compiling your contracts...
  ===========================
  > Everything is up to date, there is nothing to compile.
  
  
  Starting migrations...
  ======================
  > Network name:    'develop'
  > Network id:      5777
  > Block gas limit: 0x6691b7
  
  
  1_initial_migration.js
  ======================
  
     Replacing 'Migrations'
     ----------------------
     > transaction hash:    0xf908c5909c9d74df8a39670a5e054c2ba537e79a567eb5df697640642a2ff75d
     > Blocks: 0            Seconds: 0
     > contract address:    0x61E90830838dC3E01f689621e55981Ff2a7429A3
     > block number:        28
     > block timestamp:     1567738511
     > account:             0x27663c5D7d59017C084068FeB02f104178eE413A
     > balance:             99.91548944
     > gas used:            261393
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00522786 ETH
  
  
     > Saving migration to chain.
     > Saving artifacts
     -------------------------------------
     > Total cost:          0.00522786 ETH
  
  
  2_deploy_contracts.js
  =====================
  
     Replacing 'ConvertLib'
     ----------------------
     > transaction hash:    0xbf06fb2b5df6ad66eb0f59f95f19b09e9698edefe4833b07c9776d8687b2d548
     > Blocks: 0            Seconds: 0
     > contract address:    0xb3B0DB0616e9d501A352953baA63966499f27d73
     > block number:        30
     > block timestamp:     1567738512
     > account:             0x27663c5D7d59017C084068FeB02f104178eE413A
     > balance:             99.91257652
     > gas used:            103623
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00207246 ETH
  
  
     Linking
     -------
     * Contract: MetaCoin <--> Library: ConvertLib (at address: 0xb3B0DB0616e9d501A352953baA63966499f27d73)
  
     Replacing 'MetaCoin'
     --------------------
     > transaction hash:    0x4b9cb271216658f8d720c01cccee5d6aac393a234fabe4d93e56621e5cdf563f
     > Blocks: 0            Seconds: 0
     > contract address:    0xEc2B4D26D6F2C68e921D10Bb043548D4C780dfC3
     > block number:        31
     > block timestamp:     1567738512
     > account:             0x27663c5D7d59017C084068FeB02f104178eE413A
     > balance:             99.90580954
     > gas used:            338349
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00676698 ETH
  
  
     > Saving migration to chain.
     > Saving artifacts
     -------------------------------------
     > Total cost:          0.00883944 ETH
  
  
  3_deploy_testcontract.js
  ========================
  
     Deploying 'TestContract'
     ------------------------
     > transaction hash:    0x6ca1a56a942d486377be9fbf592c0d2c1a8f61cf9f30034b6e176f81f817069d
     > Blocks: 0            Seconds: 0
     > contract address:    0xd9421bB5e9B2d9D8C8Bd7F6BADa57e252d7D74A1
     > block number:        33
     > block timestamp:     1567738512
     > account:             0x27663c5D7d59017C084068FeB02f104178eE413A
     > balance:             99.90007304
     > gas used:            259802
     > gas price:           20 gwei
     > value sent:          0 ETH
     > total cost:          0.00519604 ETH
  
  
     > Saving migration to chain.
     > Saving artifacts
     -------------------------------------
     > Total cost:          0.00519604 ETH
  
  
  Summary
  =======
  > Total deployments:   4
  > Final cost:          0.01926334 ETH
  ```

- `test`

  ```
  truffle(develop)> test
  Using network 'develop'.
  
  Compiling your contracts...
  ===========================
  > Compiling ./test/TestMetaCoin.sol
  
    TestMetaCoin
      ✓ testInitialBalanceUsingDeployedContract (64ms)
      ✓ testInitialBalanceWithNewMetaCoin (56ms)
  
    Contract: MetaCoin
      ✓ should put 10000 MetaCoin in the first account
      ✓ should call a function that depends on a linked library (46ms)
      ✓ should send coin correctly (120ms)
  
    5 passing (6s)
  ```

  *contracts를 추가하면 migrations에도 추가해야한다.*

- testContract

  ```
  truffle(develop)> let testContract = await TestContract.deployed()
  undefined
  
  truffle(develop)> testContract.
  testContract.__defineGetter__      testContract.__defineSetter__      testContract.__lookupGetter__      testContract.__lookupSetter__
  testContract.__proto__             testContract.hasOwnProperty        testContract.isPrototypeOf         testContract.propertyIsEnumerable
  testContract.toLocaleString        testContract.toString              testContract.valueOf               
  
  testContract.abi                   testContract.address               testContract.allEvents             testContract.constructor
  testContract.contract              testContract.getPastEvents         testContract.getValue              testContract.methods
  testContract.send                  testContract.sendTransaction       testContract.setValue              testContract.transactionHash
  ```

- testContract의 함수 사용

  ```
  truffle(develop)> testContract.getValue()
  ''
  
  truffle(develop)> testContract.setValue("Hello")
  
  { tx:
     '0xc93ea9fc239e1514a8121b5bc37d9889d1c66c8efe993a99b7bfc04c17fa2158',
    receipt:
     { transactionHash:
        '0xc93ea9fc239e1514a8121b5bc37d9889d1c66c8efe993a99b7bfc04c17fa2158',
       transactionIndex: 0,
       blockHash:
        '0x585bea2d5cf2f6c768b1ccca1086a021bd17635d520462e355fa4c56c4e870d7',
       blockNumber: 19,
       from: '0x27663c5d7d59017c084068feb02f104178ee413a',
       to: '0xa7363359f6bcab154796bfb821b03750f55d7069',
       gasUsed: 43210,
       cumulativeGasUsed: 43210,
       contractAddress: null,
       logs: [],
       status: true,
       logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
       v: '0x1c',
       r:
        '0xa6384863692660c1b51fb26070d055b094f714a3fc189f8ed7e973076fa9aacf',
       s:
        '0x2b7f15a679223ba7fa2549467dec8fa5088633fe14d12782ecc3466929ca28d5',
       rawLogs: [] },
    logs: [] }
    
  truffle(develop)> testContract.getValue()
  'Hello'
  ```



## Test

- test > metacoin.js

- `test` 명령어를 입력하면 test 폴더가 실행되는 것.

- metacoin.js

  ```javascript
  const MetaCoin = artifacts.require("MetaCoin");
  
  contract('MetaCoin', (accounts) => {
    console.log(accounts);
    
    //getBalance를 test하기 위한 function
    it('should put 10000 MetaCoin in the first account', async () => {
      const metaCoinInstance = await MetaCoin.deployed();
      const balance = await metaCoinInstance.getBalance.call(accounts[0]);
  
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  
    //getBalanceInEth 가 2배가 차이 나는지 확인하기 위한 function
    it('should call a function that depends on a linked library', async () => {
      const metaCoinInstance = await MetaCoin.deployed();
      const metaCoinBalance = (await metaCoinInstance.getBalance.call(accounts[0])).toNumber();
      const metaCoinEthBalance = (await metaCoinInstance.getBalanceInEth.call(accounts[0])).toNumber();
  
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, 'Library function returned unexpected function, linkage may be broken');
    });
  
    //coin이 정확하게 맞는지 확인하는 function
    it('should send coin correctly', async () => {
      const metaCoinInstance = await MetaCoin.deployed();
  
      // Setup 2 accounts.
      const accountOne = accounts[0];
      const accountTwo = accounts[1];
  
      // Get initial balances of first and second account.
      const accountOneStartingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
      const accountTwoStartingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();
  
      // Make transaction from first account to second.
      const amount = 10;
      await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });
  
      // Get balances of first and second account after the transactions.
      const accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
      const accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();
  
  
      assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });
  
  ```

  
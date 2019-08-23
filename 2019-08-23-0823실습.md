20190823

## JSON RPC

- https://github.com/ethereum/wiki/wiki/JSON-RPC

- #### web3_clientVersion

![image](https://user-images.githubusercontent.com/43080040/63558881-d0748780-c589-11e9-993f-0a94d9190559.png)

- #### eth_accounts

![image](https://user-images.githubusercontent.com/43080040/63558965-2ba67a00-c58a-11e9-87f4-ab79d00dcd46.png)

- #### eth_blockNumber

![image](https://user-images.githubusercontent.com/43080040/63559022-67d9da80-c58a-11e9-8de3-362be6eb4920.png)

- #### eth_getBalance (accounts[0]="0x9add686bc075735225a53fe9412c21fc28a4d6c1")

![image](https://user-images.githubusercontent.com/43080040/63559108-c69f5400-c58a-11e9-9319-5d5a9265553a.png)

![image](https://user-images.githubusercontent.com/43080040/63559193-272e9100-c58b-11e9-9fe3-4d67244cdd78.png)
![image](https://user-images.githubusercontent.com/43080040/63559195-2ac21800-c58b-11e9-9d5f-ef19414164e0.png)

- #### eth_getTransactionCount

eth.accounts[0]

![image](https://user-images.githubusercontent.com/43080040/63560088-9908d980-c58f-11e9-803b-151fd2dec35f.png)

eth.accounts[1]

![image](https://user-images.githubusercontent.com/43080040/63560095-a1611480-c58f-11e9-8308-ed01707e65b2.png)

eth.accounts[2]

![image](https://user-images.githubusercontent.com/43080040/63560093-9d34f700-c58f-11e9-826f-45eae4b490e9.png)





## Web3

- JSON RPC를 쉽게 할 수 있도록 지원을 하는 것

- https://web3js.readthedocs.io/en/v1.2.1/

- `mkdir web3_test`  //새로운 폴더를 만들어준다.

- `yarn add web3`

  - `brew install web3` 선 설치 후 web3설치

- web3test.js

  ```javascript
  var Web3 = require('web3');
  var web3 = new Web3('http://localhost:8545');
  
  //console.log(web3);
  
  web3.eth.getBlockNumber((err,number)=>{
      console.log(number);
  })
  ```

- `node web3test.js`

  ```
  ip-70-12-224-174:web3_test ssorrychoi$ node web3test.js 
  163
  ```

- console

  ```
  > eth.blockNumber
  163
  ```

- web3test.js

  ```javascript
  var Web3 = require('web3');
  var web3 = new Web3('http://localhost:8545');
  
  //console.log(web3);
  
  web3.eth.getBlockNumber((err,number)=>{
      console.log(number);
  })
  
  web3.eth.getBlock(163)
  .then((block)=>{
      console.log(block);
  })
  ```

- `node web3test.js`

  ```
  ip-70-12-224-174:web3_test ssorrychoi$ node web3test.js 
  163
  { difficulty: '131200',
    extraData: '0xd883010802846765746887676f312e392e348664617277696e',
    gasLimit: 114458079,
    gasUsed: 0,
    hash:
     '0xc8958625963b2537f6a79fd0406d370586f59a5d45e09fbdcb27b62d90d485dd',
    logsBloom:
     '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    miner: '0xfB289c5b8B04c52e379EaAD342ABa3E206B721eE',
    mixHash:
     '0xdaeeaa6ed625e765ae7938a06776eb4f10657ed31f456adb1e678e362304dadf',
    nonce: '0x778b2965366e9d0d',
    number: 163,
    parentHash:
     '0x6b063fc5f0ed2c396132f851d0754aa611afcc5ac16667dca36e1a88f524b151',
    receiptsRoot:
     '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    sha3Uncles:
     '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
    size: 538,
    stateRoot:
     '0xd18dc27f560c9298afc7f380a607cb6bc38efca84f5584a34d8369a851de86a1',
    timestamp: 1566454222,
    totalDifficulty: '21918955',
    transactions: [],
    transactionsRoot:
     '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    uncles: [] }
  ```



## ETHEREUM 과 WEB 연동

- `express --ejs gethweb`

- `cd getweb`

- `npm i`

- `npm i --save ejs-locals`

- `yarn add web3`

- 전에 블록체인web에서 썼던 소스들 다 긁어오기

  
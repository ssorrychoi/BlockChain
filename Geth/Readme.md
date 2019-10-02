## 스마트계약 개발 준비 

### 개발환경 구축 : Geth 설치하기

- `brew install geth`

- `~/geth💲mkdir eth_private_net`

- `vi genesis.json`

  ```json
  {
    "config":{
      "chainID":15,
      "homesteadBlock":0,
      "eip155Block":0,
      "eip158Block":0
    },
    "nonce":"0x000000000000042",
    "mixhash":"0x0000000000000000000000000000000000000000000000000000000000000000",
    "difficulty":"0x00",
    "alloc":{ },
    "coinbase":"0x0000000000000000000000000000000000000000",
    "timestamp":"0x00",
    "parentHash":"0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData":"0x00",
    "gasLimit":"0x1312d00"
  }
  ```

### 초기화 하기

- `~geth/💲geth --datadir ./geth/eth_private_net/ init ./geth/eth_private_net/genesis.json`

  ![image](https://user-images.githubusercontent.com/43080040/65422227-d2f42680-de40-11e9-8d06-b43b0d21d47f.png)

  ✔️마지막 line에 "Successfully wrote genesis state"라고 나오면 초기화 성공

### Geth 시작하기

- `~geth/eth_private_net💲geth --networkid "10" --nodiscover --datadir "./" --rpc --rpcaddr "localhost" --rpcport "8545"  --allow-insecure-unlock --rpccorsdomain "*" --rpcapi "eth,net,web3,personal" --targetgaslimit "20000000" console 2>> ./geth_err.log`

  ![image](https://user-images.githubusercontent.com/43080040/65422687-2b77f380-de42-11e9-9af7-7a64f27ea2e5.png)

  ✔️"Welcome to the Geth Javascript console!" 문구가 나오면 성공!

  ❗️Geth v.1.9.5 에서는 --allow-insecure-unlock 옵션을 꼭 넣어줘야한다. 

### 계정 만들기

- `personal.newAccount("비밀번호입력")`  :  계정 생성

- `eth.accounts` :  계정 확인 

  ![image](https://user-images.githubusercontent.com/43080040/65422973-da1c3400-de42-11e9-9170-79709e4a83d9.png)

  ✔️4개의 계정 생성

- Index를 이용해서 계정 확인하기

  ![image](https://user-images.githubusercontent.com/43080040/65423096-31ba9f80-de43-11e9-9103-cf1c4e454598.png)

### Coinbase 계정

- `eth.coinbase`  :  coinbase 계정 확인하기

  ![image](https://user-images.githubusercontent.com/43080040/65423176-63cc0180-de43-11e9-9508-9ecacefa3b4b.png)

- `miner.setEtherbase(eth.accounts[1])`  :  coinbase 계정 변경 

- `eth.coinbase`  : coinbase 계정 확인

  ![image](https://user-images.githubusercontent.com/43080040/65423188-66c6f200-de43-11e9-8967-85fe5b750a78.png)

### genesis 블록의 내용 확인하기

- `eth.getBlock(0)`

  ![image](https://user-images.githubusercontent.com/43080040/65423462-ff5d7200-de43-11e9-92c7-70a7a634234c.png)

### mining 하기

- `miner.start(2)`  :  스레드 2개로 마이닝 시작하기

- `eth.mining`  :  'True'가 출력된다면 마이닝을 수행중이라는 뜻이다.

  ![image](https://user-images.githubusercontent.com/43080040/65423553-4a778500-de44-11e9-99b6-c48d650d0a56.png)

### 송금하기

- `eth.sendTransaction({from: eth.accounts[0],to: eth.accounts[2], value: web3.toWei(5,"ether")})`

  ![image](https://user-images.githubusercontent.com/43080040/65423710-b8bc4780-de44-11e9-9028-22bb0a31a127.png)

  ❌에러가 발생하는 이유 : 계좌의 잠금을 해제하지 않았기 때문에

- `personal.unlockAccount(eth.accounts[0])` 명령어로 계좌의 잠금을 해제해준다.

- `eth.getTransaction('Transaction Hash')`

  ![image](https://user-images.githubusercontent.com/43080040/65425805-d344ef80-de49-11e9-8b96-afd402894c6b.png)

- `web3.fromWei(eth.getBalance(eth.accounts[2],"ether"))`

  ![image](https://user-images.githubusercontent.com/43080040/65426244-c7a5f880-de4a-11e9-9332-6f59e544bfa0.png)

  mining을 해야 (블록이 생성되어야) 거래가 성사된다.


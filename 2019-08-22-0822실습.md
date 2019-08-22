20190822

# Geth 설치

- Google 검색창에 `Go Ethereum `검색
- https://github.com/ethereum/go-ethereum/
- 밑에 다운로드 (https://geth.ethereum.org/downloads/)
- `Geth & Tools` v.1.8.20 설치



## Geth(Go-ethereum)

- 이더리움 프로토콜을 Go 언어로 구현한 풀 노드 클라이언트 프로그램
- 주요기능
  - 이더리움 네트워크 참여
  - 실제 이더 채굴
  - 사용자간 이더 전송
  - 스마트 컨트랙트 생성 및 배포
  - 블록내역 조회 등
- 실제 이더리움 네트워크에 참여하기가 가능하다.



## cmder 설치

- Windows 의 cmd는 버그도 많고 오류가 많이 나기 때문에 설치해야 하지만
- Mac OS에선 Terminal로 해도 됨.



## Ethereum Network

- MainNet -> 실제 Eth를 송금할 수 있는 네트워크
- TestNet -> 개발시, 테스트용 네트워크, mainNet과 같은 노드들. 가짜Eth로 채굴, 송금, 가능
- Private 



## Genesis block

- Genesis Block은 번복이 안되기 때문에 오타없이 신중하게 만들어야 한다.

- Genesis.json

  ```json
  {
    "config" : {
      "chainId" : 33,
      "homesteadBlock" : 0,
      "eip155Block" : 0,
      "eip158Block" : 0
    },
  
    "nonce":"0x0000000000000033",
    "timestamp":"0x0",
    "parentHash":"0x0000000000000000000000000000000000000000000000000000000000000000",
    "gasLimit":"0x8000000",
    "difficulty":"0x100",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase":"0x333333333333333333333333333333333333333",
    "alloc":{}
  }
  ```

- `./geth --datadir chaindata account new` 명령어로 계좌 생성

- 결과값

  > ip-70-12-224-174:geth182 ssorrychoi$ **./geth --datadir chaindata account new**
  >
  > INFO [08-22|11:38:52] Maximum peer count                       ETH=25 LES=0 total=25
  >
  > Your new account is locked with a password. Please give a password. Do not forget this password.
  >
  > Passphrase: 
  >
  > Repeat passphrase: 
  >
  > Address: {***9add686bc075735225a53fe9412c21fc28a4d6c1***}
  >
  > ip-70-12-224-174:geth182 ssorrychoi$ **./geth --datadir chaindata account new**
  >
  > INFO [08-22|11:39:12] Maximum peer count                       ETH=25 LES=0 total=25
  >
  > Your new account is locked with a password. Please give a password. Do not forget this password.
  >
  > Passphrase: 
  >
  > Repeat passphrase: 
  >
  > Address: {***f6cd8687b51194d541983eae81ef8e167a23e1fe***}

- 주소 값을 genesis.json에 넣어주기(16진수로)

- genesis.json

  ```json
  {
    "config" : {
      "chainId" : 33,
      "homesteadBlock" : 0,
      "eip155Block" : 0,
      "eip158Block" : 0
    },
  
    "nonce":"0x0000000000000033",
    "timestamp":"0x0",
    "parentHash":"0x0000000000000000000000000000000000000000000000000000000000000000",
    "gasLimit":"0x8000000",
    "difficulty":"0x100",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase":"0x9add686bc075735225a53fe9412c21fc28a4d6c1",
    "alloc":{
      "0x9add686bc075735225a53fe9412c21fc28a4d6c1" : {"balance":"300000"},
      "0xf6cd8687b51194d541983eae81ef8e167a23e1fe" : {"balance":"200000"}
    }
  }
  ```

- 초기화 `./geth --datadir ~/Desktop/Practice/Geth/geth182/chaindata/ init ~/Desktop/Practice/Geth/geth182/genesis.json`

  >ip-00-00-000-000:geth182 ssorrychoi$ **./geth --datadir ~/Desktop/Practice/Geth/geth182/chaindata/ init ~/Desktop/Practice/Geth/geth182/genesis.json** 
  >INFO [08-22|11:49:54] Maximum peer count                       ETH=25 LES=0 total=25
  >INFO [08-22|11:49:54] Allocated cache and file handles         database=/Users/ssorrychoi/Desktop/Practice/Geth/geth182/chaindata/geth/chaindata cache=16 handles=16
  >INFO [08-22|11:49:54] Writing custom genesis block 
  >INFO [08-22|11:49:54] Persisted trie from memory database      nodes=3 size=503.00B time=112.423µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
  >INFO [08-22|11:49:54] Successfully wrote genesis state         database=chaindata                                                                hash=887660…0bcef5
  >INFO [08-22|11:49:54] Allocated cache and file handles         database=/Users/ssorrychoi/Desktop/Practice/Geth/geth182/chaindata/geth/lightchaindata cache=16 handles=16
  >INFO [08-22|11:49:54] Writing custom genesis block 
  >INFO [08-22|11:49:54] Persisted trie from memory database      nodes=3 size=503.00B time=73.983µs  gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
  >INFO [08-22|11:49:54] **Successfully wrote genesis state**         database=lightchaindata                                                                hash=887660…0bcef5



## JSRE - Javascript Runtime Environment

- 자바스크립트를 실행할 수 있는 콘솔 환경
- Geth에서 지원하는 자바스크립트 환경
  - Interactive Mode(JSRE REPL)
    - `console` 이나 `attatch` 명령으로 실행됨
    - `$ geth console`

- `$ ./geth --datadir chaindata --networkid 33 console`
- 33 은 Genesis.json 의 chainID 를 말하는 것이다.

> ip-70-12-224-174:geth182 ssorrychoi$ **./geth --datadir chaindata --networkid 33 console**
>
> INFO [08-22|13:54:56] Maximum peer count                       ETH=25 LES=0 total=25
>
> INFO [08-22|13:54:56] Starting peer-to-peer node               instance=Geth/v1.8.2-stable-b8b9f7f4/darwin-amd64/go1.9.4
>
> INFO [08-22|13:54:56] Allocated cache and file handles         database=/Users/ssorrychoi/Desktop/Practice/Geth/geth182/chaindata/geth/chaindata cache=768 handles=128
>
> WARN [08-22|13:54:56] Upgrading database to use lookup entries 
>
> INFO [08-22|13:54:56] Database deduplication successful        deduped=0
>
> INFO [08-22|13:54:56] Initialised chain configuration          config="{ChainID: 33 Homestead: 0 DAO: <nil> DAOSupport: false EIP150: <nil> EIP155: 0 EIP158: 0 Byzantium: <nil> Constantinople: <nil> Engine: unknown}"
>
> INFO [08-22|13:54:56] Disk storage enabled for ethash caches   dir=/Users/ssorrychoi/Desktop/Practice/Geth/geth182/chaindata/geth/ethash count=3
>
> INFO [08-22|13:54:56] Disk storage enabled for ethash DAGs     dir=/Users/ssorrychoi/.ethash                                             count=2
>
> INFO [08-22|13:54:56] Initialising Ethereum protocol           versions="[63 62]" network=33
>
> INFO [08-22|13:54:56] Loaded most recent local header          number=0 hash=887660…0bcef5 td=256
>
> INFO [08-22|13:54:56] Loaded most recent local full block      number=0 hash=887660…0bcef5 td=256
>
> INFO [08-22|13:54:56] Loaded most recent local fast block      number=0 hash=887660…0bcef5 td=256
>
> INFO [08-22|13:54:56] Regenerated local transaction journal    transactions=0 accounts=0
>
> INFO [08-22|13:54:56] Starting P2P networking 
>
> INFO [08-22|13:54:58] UDP listener up                          self=enode://4f50d00acf2b41762dcc10cb568ace2cbb051ca0b4636fb725228d1d0f50bf65e4f58c2ab98c9eeb167e59ced6b5cac538196ba6a7d3b515e1c556826c20d47b@[::]:30303
>
> INFO [08-22|13:54:58] RLPx listener up                         self=enode://4f50d00acf2b41762dcc10cb568ace2cbb051ca0b4636fb725228d1d0f50bf65e4f58c2ab98c9eeb167e59ced6b5cac538196ba6a7d3b515e1c556826c20d47b@[::]:30303
>
> INFO [08-22|13:54:58] IPC endpoint opened                      url=/Users/ssorrychoi/Desktop/Practice/Geth/geth182/chaindata/geth.ipc
>
> Welcome to the Geth JavaScript console!
>
> 
>
> instance: Geth/v1.8.2-stable-b8b9f7f4/darwin-amd64/go1.9.4
>
> INFO [08-22|13:54:58] Etherbase automatically configured       address=0x9ADd686bC075735225A53fE9412C21fC28A4D6c1
>
> coinbase: 0x9add686bc075735225a53fe9412c21fc28a4d6c1
>
> at block: 0 (Thu, 01 Jan 1970 09:00:00 KST)
>
>  datadir: /Users/ssorrychoi/Desktop/Practice/Geth/geth182/chaindata
>
>  modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0
>
> **\>**



## Geth modules

- admin : Geth node management
- debug : Geth node debugging
- minder : 
- personal
- txpool



## Geth console

- 계정 조회

> **\> eth.accounts**
>
> ["0x9add686bc075735225a53fe9412c21fc28a4d6c1", "0xf6cd8687b51194d541983eae81ef8e167a23e1fe"]
>
> **\> personal.newAccount("eth")**
>
> "0xfb289c5b8b04c52e379eaad342aba3e206b721ee"
>
> **\> eth.accounts**
>
> ["0x9add686bc075735225a53fe9412c21fc28a4d6c1", "0xf6cd8687b51194d541983eae81ef8e167a23e1fe", "0xfb289c5b8b04c52e379eaad342aba3e206b721ee"]
>
> **\> eth.accounts[0]**
>
> "0x9add686bc075735225a53fe9412c21fc28a4d6c1"
>
> **\> eth.accounts[1]**
>
> "0xf6cd8687b51194d541983eae81ef8e167a23e1fe"
>
> **\> eth.accounts[2]**
>
> "0xfb289c5b8b04c52e379eaad342aba3e206b721ee"
>
> **\> eth.accounts[3]**
>
> undefined
>
> **\> eth.coinbase**
>
> "0x9add686bc075735225a53fe9412c21fc28a4d6c1"

- Coinbase 설정

> **\> eth.accounts**
>
> ["0x9add686bc075735225a53fe9412c21fc28a4d6c1", "0xf6cd8687b51194d541983eae81ef8e167a23e1fe", "0xfb289c5b8b04c52e379eaad342aba3e206b721ee"]
>
> **\> eth.coinbase**
>
> "0x9add686bc075735225a53fe9412c21fc28a4d6c1"
>
> **\> miner.setEtherbase(eth.accounts[1])**
>
> true
>
> **\> eth.coinbase**
>
> "0xf6cd8687b51194d541983eae81ef8e167a23e1fe"

- balance 조회

> **\> eth.getBalance(eth.accounts[0])**
>
> 300000
>
> **\> eth.getBalance(eth.accounts[1])**
>
> 200000
>
> **\> eth.getBalance(eth.accounts[2])**
>
> 0

- Mining

> **\> miner.start(1)**
>
> INFO [08-22|14:22:21] Updated mining threads                   threads=1
>
> INFO [08-22|14:22:21] Transaction pool price threshold updated price=18000000000
>
> null
>
> \> INFO [08-22|14:22:21] Starting mining operation 
>
> INFO [08-22|14:22:21] Commit new mining work                   number=1 txs=0 uncles=0 elapsed=507.324µs
>
> INFO [08-22|14:22:23] Generating DAG in progress               epoch=0 percentage=0 elapsed=1.158s
>
> INFO [08-22|14:22:24] Generating DAG in progress               epoch=0 percentage=1 elapsed=2.344s
>
> INFO [08-22|14:22:25] Generating DAG in progress               epoch=0 percentage=2 elapsed=3.467s
>
> INFO [08-22|14:22:26] Generating DAG in progress               epoch=0 percentage=3 elapsed=4.583s
>
> INFO [08-22|14:22:27] Generating DAG in progress               epoch=0 percentage=4 elapsed=5.730s
>
> INFO [08-22|14:22:29] Generating DAG in progress               epoch=0 percentage=5 elapsed=6.877s
>
> INFO [08-22|14:22:30] Generating DAG in progress               epoch=0 percentage=6 elapsed=8.045s
>
> INFO [08-22|14:22:31] Generating DAG in progress               epoch=0 percentage=7 elapsed=9.233s
>
> INFO [08-22|14:22:32] Generating DAG in progress               epoch=0 percentage=8 elapsed=10.409s
>
> INFO [08-22|14:22:33] Generating DAG in progress               epoch=0 percentage=9 elapsed=11.709s
>
> INFO [08-22|14:22:35] Generating DAG in progress               epoch=0 percentage=10 elapsed=12.892s
>
> INFO [08-22|14:22:36] Generating DAG in progress               epoch=0 percentage=11 elapsed=14.060s
>
> ...
>
> **\> miner.stop()**
>
> true
>
> **\> eth.blockNumber**
>
> 98



- Mining끝난 후 보상 받은 Wei 금액조회

> **\> eth.accounts**
>
> ["0x9add686bc075735225a53fe9412c21fc28a4d6c1", "0xf6cd8687b51194d541983eae81ef8e167a23e1fe", "0xfb289c5b8b04c52e379eaad342aba3e206b721ee"]
>
> **\> eth.coinbase**
>
> "0xf6cd8687b51194d541983eae81ef8e167a23e1fe"
>
> **\> eth.getBalance(eth.accounts[1])**
>
> 490000000000000200000
>
> **\> web3.fromWei(eth.getBalance(eth.accounts[1]),"ether")**		//wei를 ether로 변환
>
> 490.0000000000002

- 거래

>**\> eth.sendTransaction({from:eth.accounts[2],to:eth.accounts[0],value:web3.toWei(10,"ether")})**
>
>Error: authentication needed: password or unlock
>
>​    at web3.js:3143:20
>
>​    at web3.js:6347:15
>
>​    at web3.js:5081:36
>
>​    at <anonymous>:1:1
>
>
>
>**\> personal.unlockAccount(eth.accounts[2])**
>
>Unlock account 0xfb289c5b8b04c52e379eaad342aba3e206b721ee
>
>Passphrase: 
>
>true
>
>**\> eth.sendTransaction({from:eth.accounts[2],to:eth.accounts[0],value:web3.toWei(10,"ether")})**
>
>INFO [08-22|14:41:38] Submitted transaction                    fullhash=0xfbcd1277dff4482fd893b6f9ffa4c9a9995032991c32acda6095054b4b1a9d51 recipient=0x9ADd686bC075735225A53fE9412C21fC28A4D6c1
>
>"0xfbcd1277dff4482fd893b6f9ffa4c9a9995032991c32acda6095054b4b1a9d51"
>
>**\> eth.getBalance(eth.accounts[0])**
>
>300000
>
>//아직 전송 안됨.

- PendingTransaction

> **\> eth.pendingTransactions**
>
> [{
>
> ​    blockHash: null,
>
> ​    blockNumber: null,
>
> ​    from: "0xfb289c5b8b04c52e379eaad342aba3e206b721ee",
>
> ​    gas: 90000,
>
> ​    gasPrice: 18000000000,
>
> ​    hash: "0xfbcd1277dff4482fd893b6f9ffa4c9a9995032991c32acda6095054b4b1a9d51",
>
> ​    input: "0x",
>
> ​    nonce: 0,
>
> ​    r: "0xad9e4fc2dc307d8863b1265cd757b57d7b7114cb1d45b8996a51c4ecbb7e7b8a",
>
> ​    s: "0x3432ea62ad07315161270cad51090ec30f597b0d4655e976a0793905a4300e08",
>
> ​    to: "0x9add686bc075735225a53fe9412c21fc28a4d6c1",
>
> ​    transactionIndex: 0,
>
> ​    v: "0x65",
>
> ​    value: 10000000000000000000
>
> }]
>
> **\> eth.sendTransaction({from:eth.accounts[1],to:eth.accounts[0],value:web3.toWei(20,"ether")})**
>
> Error: authentication needed: password or unlock
>
> ​    at web3.js:3143:20
>
> ​    at web3.js:6347:15
>
> ​    at web3.js:5081:36
>
> ​    at <anonymous>:1:1
>
> 
>
> **\> personal.unlockAccount(eth.accounts[1])**
>
> Unlock account 0xf6cd8687b51194d541983eae81ef8e167a23e1fe
>
> Passphrase: 
>
> true
>
> **\> eth.sendTransaction({from:eth.accounts[1],to:eth.accounts[0],value:web3.toWei(20,"ether")})**
>
> INFO [08-22|14:44:14] Submitted transaction                    fullhash=0x45cc49a2bd20115c3810fd9218e8a594cb5ac3bce079d10d04bc7af8a2267749 recipient=0x9ADd686bC075735225A53fE9412C21fC28A4D6c1
>
> "0x45cc49a2bd20115c3810fd9218e8a594cb5ac3bce079d10d04bc7af8a2267749"
>
> **\> eth.pendingTransactions**
>
> [*{*
>
> ​    *blockHash: null,*
>
> ​    *blockNumber: null,*
>
> ​    *from: "0xfb289c5b8b04c52e379eaad342aba3e206b721ee",*
>
> ​    *gas: 90000,*
>
> ​    *gasPrice: 18000000000,*
>
> ​    *hash: "0xfbcd1277dff4482fd893b6f9ffa4c9a9995032991c32acda6095054b4b1a9d51",*
>
> ​    *input: "0x",*
>
> ​    *nonce: 0,*
>
> ​    *r: "0xad9e4fc2dc307d8863b1265cd757b57d7b7114cb1d45b8996a51c4ecbb7e7b8a",*
>
> ​    *s: "0x3432ea62ad07315161270cad51090ec30f597b0d4655e976a0793905a4300e08",*
>
> ​    *to: "0x9add686bc075735225a53fe9412c21fc28a4d6c1",*
>
> ​    *transactionIndex: 0,*
>
> ​    *v: "0x65",*
>
> ​    *value: 10000000000000000000*
>
> *}, {*
>
> ​    *blockHash: null,*
>
> ​    *blockNumber: null,*
>
> ​    *from: "0xf6cd8687b51194d541983eae81ef8e167a23e1fe",*
>
> ​    *gas: 90000,*
>
> ​    *gasPrice: 18000000000,*
>
> ​    *hash: "0x45cc49a2bd20115c3810fd9218e8a594cb5ac3bce079d10d04bc7af8a2267749",*
>
> ​    *input: "0x",*
>
> ​    *nonce: 0,*
>
> ​    *r: "0x855d51319bb914f218c73f85b544f2ffdb726e413204262af4ba142cf841f4cd",*
>
> ​    *s: "0x4f2f9974a978bd240128b503908446eb338f407c6f14b207f1534d671e640e28",*
>
> ​    *to: "0x9add686bc075735225a53fe9412c21fc28a4d6c1",*
>
> ​    *transactionIndex: 0,*
>
> ​    *v: "0x66",*
>
> ​    *value: 20000000000000000000*
>
> *}]*

- Mining

> **\> miner.start(1)**
>
> INFO [08-22|14:45:33] Updated mining threads                   threads=1
>
> INFO [08-22|14:45:33] Transaction pool price threshold updated price=18000000000
>
> INFO [08-22|14:45:33] Starting mining operation 
>
> null
>
> ...
>
> **\> eth.pendingTransactions**
>
> []
>
> **\> eth.getBalance(eth.accounts[0])**
>
> 30000000000000300000
>
> **\> eth.getBalance(eth.accounts[1])**
>
> 469999622000000200000
>
> **\> eth.getBalance(eth.accounts[2])**
>
> 300000378000000000000

- GetBlock

> **\> eth.blockNumber**
>
> 160
>
> **\> eth.getBlock(0)**
>
> *{*
>
>   ***difficulty: 256,***
>
>   *extraData: "0x",*
>
>   *gasLimit: 134217728,*
>
>   *gasUsed: 0,*
>
>   *hash: "0x88766025a644aaacd829292f084517176844cfcd48831b3bff62834ae80bcef5",*
>
>   *logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",*
>
>   *miner: "0x9add686bc075735225a53fe9412c21fc28a4d6c1",*
>
>   *mixHash: "0x0000000000000000000000000000000000000000000000000000000000000000",*
>
>   *nonce: "0x0000000000000033",*
>
>   *number: 0,*
>
>   *parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",*
>
>   *receiptsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",*
>
>   *sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",*
>
>   *size: 507,*
>
>   *stateRoot: "0x4d8282327c3afd06defb75d11848ae9b46c838ea6eb4ceedbcf5282b9815d493",*
>
>   *timestamp: 0,*
>
>   *totalDifficulty: 256,*
>
>   *transactions: [],*
>
>   *transactionsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",*
>
>   *uncles: []*
>
> *}*
>
> **\> eth.getBlock(160)**
>
> *{*
>
>   ***difficulty: 135337,***
>
>   *extraData: "0xd883010802846765746887676f312e392e348664617277696e",*
>
>   *gasLimit: 114794027,*
>
>   *gasUsed: 0,*
>
>   *hash: "0x047490d3715d99bba1db4430be1453a13477ff0397d6ad9cc53a5148e8f308c3",*
>
>   *logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",*
>
>   *miner: "0xfb289c5b8b04c52e379eaad342aba3e206b721ee",*
>
>   *mixHash: "0x5a0b227b6e6f487e2f2042f6ca2860ab4d14fe840d9d558b7059f06ae7d8b522",*
>
>   *nonce: "0x5ff2ce843acf3f16",*
>
>   *number: 160,*
>
>   *parentHash: "0x875f72155484cae65d79012b54c507ebd143af7ef3267edf702404d217bea7da",*
>
>   *receiptsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",*
>
>   *sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",*
>
>   *size: 538,*
>
>   *stateRoot: "0x0f335864121fcc459eda44fd0aae005c886447bb130259e52727d2df24581268",*
>
>   *timestamp: 1566452756,*
>
>   *totalDifficulty: 21525547,*
>
>   *transactions: [],*
>
>   *transactionsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",*
>
>   *uncles: []*
>
> *}*
>
> **//난이도가 점점 높아짐!**
>
> **\> eth.getBlock(161)**
>
> *{*
>
>   *difficulty: 131072,*
>
>   *extraData: "0xd883010802846765746887676f312e392e348664617277696e",*
>
>   *gasLimit: 114681925,*
>
>   *gasUsed: 21000,*
>
>   *hash: "0xe3fb2079101506232e3b2de5a45122f21465ef36bccb46e0a2ff83cdf4a60ac4",*
>
>   *logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",*
>
>   *miner: "0xfb289c5b8b04c52e379eaad342aba3e206b721ee",*
>
>   *mixHash: "0xaacfd364dec7c6d8ac3abd4c0f02b1df58da2422ec67ce6b442fe6ed67e5e04e",*
>
>   *nonce: "0x3b456c71589373d9",*
>
>   *number: 161,*
>
>   *parentHash: "0x047490d3715d99bba1db4430be1453a13477ff0397d6ad9cc53a5148e8f308c3",*
>
>   *receiptsRoot: "0xff0796bcc1cae47ed5cb95edc8599af46ffcf22c1fcdca3efdee43b6de35d655",*
>
>   *sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",*
>
>   *size: 652,*
>
>   *stateRoot: "0xb45448e5980c25fa80d83382e384d97fc9861ad825d9c8ee51f60a63b9e81d93",*
>
>   *timestamp: 1566454220,*
>
>   *totalDifficulty: 21656619,*
>
>   ***transactions: ["0x7bd216ae20b22b504ef459410f5a82dd339cd7b474720a626a0186115159ef9c"],***
>
>   *transactionsRoot: "0x003d0c2d77e9af7cd84ec52e0d424dfe7d25649c2c01b5f402d7e01556a76835",*
>
>   *uncles: []*
>
> *}*
>
> **//Transaction이 있는 Block!**
>
> **\> eth.getTransaction("0x7bd216ae20b22b504ef459410f5a82dd339cd7b474720a626a0186115159ef9c")**
>
> *{*
>
>   *blockHash: "0xe3fb2079101506232e3b2de5a45122f21465ef36bccb46e0a2ff83cdf4a60ac4",*
>
>   *blockNumber: 161,*
>
>   *from: "0xf6cd8687b51194d541983eae81ef8e167a23e1fe",*
>
>   *gas: 90000,*
>
>   *gasPrice: 18000000000,*
>
>   *hash: "0x7bd216ae20b22b504ef459410f5a82dd339cd7b474720a626a0186115159ef9c",*
>
>   *input: "0x",*
>
>   *nonce: 1,*
>
>   *r: "0xc69751b113d47ff9255041aa9676d3aa3a3be552ceaa5e0bf9ebb186c371ccf7",*
>
>   *s: "0x579c63134926ea9e85c8268e993823f72c5eda7e8b79bfc9259a1d15edc6fa0a",*
>
>   *to: "0x9add686bc075735225a53fe9412c21fc28a4d6c1",*
>
>   *transactionIndex: 0,*
>
>   *v: "0x65",*
>
>   *value: 5000000000000000000*
>
> *}*



## 이더리움 클라이언트

- 블록체인 네트워크 노드
- 일반 사용자의 접속을 허용하고 블록체인과 연결시켜주는 역할



## POSTMAN

![image](https://user-images.githubusercontent.com/43080040/63492322-36aecb00-c4f4-11e9-8564-70a2ded8ea2e.png)

- 실행중이던 console 내리고

- #### `$ ./geth --datadir chaindata --networkid 5678 --nodiscover --maxpeers 0 --rpc –rpcaddr "0.0.0.0" --rpcport 8545 --rpccorsdomain "*" --rpcapi "db,eth,net,web3,admin,debug,miner,shh,txpool,personal” console`


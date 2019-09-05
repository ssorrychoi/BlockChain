20190905

## Review(CrowdFunding)

- CrowdFunding.sol

  ```javascript
  pragma solidity ^0.5.8;
  
  contract CrowdFunding{
  
    struct Investor{
      address payable addr;
      uint amount;
    }
  
    mapping(uint => Investor) public investors;
    uint numOfInvestors =0;
  
    uint goalAmount=4000000000000000000;
    uint totalAmount;
    address payable owner;
  
    //functions
    constructor () public payable{
      owner = msg.sender;
    }
    modifier onlyOwner (){
      require(msg.sender==owner);
      _;
    }
  
    function funding() public payable {
      /*
      Investor memory newInvestor;
      newInvestor.addr = msg.sender;
      newInvestor.amount = msg.value;
      totalAmount += msg.value;
      investors[numOfInvestors] = newInvestor;
      numOfInvestors++;
      */
      investors[numOfInvestors] = Investor(msg.sender,msg.value);
      numOfInvestors++;
      totalAmount += msg.value;
    }
  
    function checkGoalFunding() public payable onlyOwner{
      if(totalAmount >= goalAmount){
        owner.transfer(address(this).balance);
        totalAmount=0;
      }else{
        for(uint i=0;i<numOfInvestors;i++){
          investors[i].addr.transfer(investors[i].amount);
          totalAmount=0;
        }
      }
    }
    
    function getTotalAmount() public view returns(uint){
      return totalAmount;
    }
    
    function killConstract() public onlyOwner {
      selfdestruct(owner);
    }
  }
  ```

- V2

  ```javascript
  pragma solidity ^0.5.8;
  contract CrowdFunding {
    // 투자자 구조체
    struct Investor {
      address payable addr;   // 투자자의 어드레스
      uint amount;    // 투자액
    }
  
    address payable public  owner;      // 컨트랙트 소유자
    uint public numInvestors;   // 투자자 수
    uint public deadline;       // 마감일 (UnixTime)
    string public status;       // 모금활동 스테이터스
    bool public ended;          // 모금 종료여부
    uint public goalAmount;     // 목표액
    uint public totalAmount;    // 총 투자액
    mapping (uint => Investor) public investors;    // 투자자 관리를 위한 매핑
  
    modifier onlyOwner () {
      require(msg.sender == owner);
      _;
    }
  
    /// 생성자
    constructor(uint _duration, uint _goalAmount) public {
      owner = msg.sender;
  
      // 마감일 설정 (Unixtime)
      deadline = now + _duration;
  
      goalAmount = _goalAmount;
      status = "Funding";
      ended = false;
  
      numInvestors = 0;
      totalAmount = 0;
    }
  
    /// 투자 시에 호출되는 함수
    function fund() public payable {
      // 모금이 끝났다면 처리 중단
      require(!ended);
  
      Investor storage inv = investors[numInvestors++];
      inv.addr = msg.sender;
      inv.amount = msg.value;
      totalAmount += inv.amount;
    }
  
    /// 목표액 달성 여부 확인
    /// 그리고 모금 성공/실패 여부에 따라 송금
    function checkGoalReached () public onlyOwner {     
      // 모금이 끝났다면 처리 중단
      require(!ended);
  
      // 마감이 지나지 않았다면 처리 중단
      require(now >= deadline);
  
      if(totalAmount >= goalAmount) { // 모금 성공인 경우
        status = "Campaign Succeeded";
        ended = true;
        // 컨트랙트 소유자에게 컨트랙트에 있는 모든 이더를 송금
        if(!owner.send(address(this).balance)) {
          revert();
        }
      } else {    // 모금 실패인 경우
        uint i = 0;
        status = "Campaign Failed";
        ended = true;
  
        // 각 투자자에게 투자금을 돌려줌
        while(i <= numInvestors) {
          if(!investors[i].addr.send(investors[i].amount)) {
            revert();
          }
          i++;
        }
      }
    }
  
    /// 컨트랙트를 소멸시키기 위한 함수
    function kill() public onlyOwner {
      selfdestruct(owner);
    }
  }
  
  ```



## Vote (Web3 Provider)

- Geth 실행시켜줌
- `$ ./geth --datadir chaindata --networkid 5678 --nodiscover --maxpeers 0 --rpc –rpcaddr "0.0.0.0" --rpcport 8545 --rpccorsdomain "*" --rpcapi "db,eth,net,web3,admin,debug,miner,shh,txpool,personal” console`
- geth182와 같은 위치에 gethNode라는 디렉토리 새로 생성
- `npm init`
- `npm i --save web3` => mac에서는 설치가 안됨. 
- `yarn add web3`로 설치
- 새로운 터미널 창 실행
- `cd Geth/gethweb`
- `node`
- `var Web3 = require('web3');`   //undefined
- `var web3 = new Web3('http://localhost:8545');`  //undefined
- 잘 연결되었는지 확인 `web3` 를 입력해보면 web3에 관한 정보들이 나온다
- `/geth182 $ eth.blockNumber` //375
- `/gethweb $ web3.eth.getBlockNumber().then(console.log)`   //375 갯수가 같은 것을 확인하면 연결 됨을 알 수 있다



## Ganache

- Geth를 사용하면 Mining도 내가 직접해야하고 불편한 점이 많다.
- mining도 직접해주고 Transaction이 발생할때마다 (or 몇초, 몇분마다) 블록을 생성해주는 플랫폼이 Ganache
- mining뿐만 아니라 작업했던것을 눈으로 직접 볼 수 있는 플랫폼이다.
- 다운로드 및 설치



## Web3.js(GethWeb)

- MyContract.js

  ```javascript
  var Web3 = require('web3');
  var web3 = new Web3('http://localhost:8545');
  
  const abi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_value",
          "type": "string"
        }
      ],
      "name": "setValue",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_value",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getValue",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]  ;
  
  const contractAddress = "0xa08c816992a9518423eb062afc5c348b1335e2c3";
  var helloContract = new web3.eth.Contract(abi, contractAddress);
  
  console.log(helloContract.options.address);
  console.log(helloContract.options.jsonInterface);
  
  helloContract.methods.getValue().call()
    .then(result => {
    console.log(result);
  })
  ```

  ```javascript
  var helloContract = new web3.eth.Contract(abi, contractAddress);
  
  
  console.log(helloContract.options.address);
  console.log(helloContract.options.jsonInterface);
  
  helloContract.methods.getValue().call()
    .then(result => {
    console.log(result);
  }
         )
  
  async function sendTest(){
    let result = await helloContract.methods
    .setValue("12345")
    .send({from: "0x86021aC05f903209f7ada6A662D8083D599b1dD9"});    
    // 비용이 발생할땐 누가 이 비용을 지불할지 정하고 send함수를 호출해야한다.
    console.log(result);
  }
  
  sendTest();
  
  async function hello(){
    let result = await helloContract.methods.getValue().call();     
    // get()함수를 호출할땐 call()함수를 호출한다.
    console.log(result);
  }
  hello();
  ```




## HTML Web3

- HTML에서 블록체인에 접근하기

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
  
      <!-- web3 cdn -->
      <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.0.0-beta.34/dist/web3.min.js"></script>
  
      <!-- HTML에서 블록체인에 접근하기 Test -->
      <script>
        var web3 = new Web3('http://localhost:8545');
  
        const abi = [
          {
            "constant": false,
            "inputs": [
              {
                "name": "_value",
                "type": "string"
              }
            ],
            "name": "setValue",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "name": "_value",
                "type": "string"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "getValue",
            "outputs": [
              {
                "name": "",
                "type": "string"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          }
        ]  ;
  
        const contractAddress = "0xa08c816992a9518423eb062afc5c348b1335e2c3";
  
        var helloContract = new web3.eth.Contract(abi, contractAddress);
  
        console.log(helloContract.options.address);
        console.log(helloContract.options.jsonInterface);
  
        helloContract.methods.getValue().call()
          .then(result => {
          console.log(result);
        }
               )
        async function hello(){
          let result = await helloContract.methods.getValue().call();     
          // get()함수를 호출할땐 call()함수를 호출한다.
          console.log(result);
        }
        hello();
      </script>
  
    </head>
    <body>
  
    </body>
  </html>
  ```

- '웹 브라우저 개발자도구'에서 console에 보면 

  > 12345
  >
  > 12345

  
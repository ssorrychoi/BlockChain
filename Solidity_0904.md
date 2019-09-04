---
layout: post
title: Solidity_3
subtitle: Bank,SimpleToken,Vote,Lottery,CrowdFunding
tags: [solidity,Smart contract]
comments: true
---

20190904

## Review

- bank.sol

- *각 사용자(account)가 contract(은행)에게 돈을 보내는 소스코드.*

  - 장부의 역할을 할 ***balanceOf*** 
  - ***deposit()*** - 은행에 돈을 보내는 function
  - ***withdrawl()*** - 은행에서 돈을 빼서 호출자(msg.sender)에게 돈을 보내주는 function
  - ***getBalanceOf()*** -  입력한 주소값의 잔액을 return받는 function

  ```javascript
  pragma solidity ^0.5.8;
  
  contract Bank{
  
    uint public totalDeposit;				
    mapping(address => uint) balanceOf;		//장부의 역할
    
    constructor() public{
    }
  
    function deposit() public payable{	//돈을 주고받는 것이 있을 땐 payable을 붙여준다.
      balanceOf[msg.sender] += msg.value;			//contract에 입력한 돈을 넣는다.
      totalDeposit += msg.value;							//totalDeposit 변수에 돈을 계속해서 저장한다.
    }
  
    function withdrawl(uint _amount) public payable{		// contract에서 인출
      require(balanceOf[msg.sender] >= _amount);	// contract에 남아있는 금액이 요청한 금액보다 많을때
      balanceOf[msg.sender] -= _amount;					  // contract에서 요청한 금액을 뺀다.
      totalDeposit -= _amount;										// totalDeposit에서도 금액을 뺀다.
      msg.sender.transfer(_amount);								// 요청한 금액을 요청한사람(msg.sender)에게 송금한다.
    }
  
    function getBalanceOf(address _account) public view returns(uint){
      return balanceOf[_account];
    }
  }
  ```





## SimpleToken

- simpleToken.sol

- eth가 아니라 Token을 주고받는 소스

  - **코인** : *독립된 블록체인 네트워크(메인넷)를 소유한 경우 코인으로 부른다. 예를 들면, 비트코인(BTC), 이더리움(ETH), 퀀텀(QTUM), 스팀(STEEM), 넴(NEM) 등을 들 수 있다.*

    **토큰** : *독립된 블록체인 네트워크를 소유하지 않은 경우 토큰으로 부른다. 예를 들면, 이오스(EOS), 트론(TRX) 등을 들 수 있다.*

  ```javascript
  pragma solidity ^0.5.8;
  
  contract SimpleToken{
    address owner;
  
    string symbol = "STK";
    mapping(address => uint) public balanceOf;
  
    constructor() public {		//생성자
      balanceOf[msg.sender] = 1000000000000000;			
      owner = msg.sender;		//배포한 사람을 owner로 지정한다.
    }
  
    function transfer(address _to, uint _value) public{
      address _from = msg.sender;		// 이 함수를 호출한 사람으로부터 지정한 사람에게 지정한 토큰의 갯수를 보낸다
      balanceOf[_from] -= _value;		// 호출한 사람의 잔액에서 보낸만큼 뺀다.
      balanceOf[_to] += _value;			// 지정한 사람의 잔액에는 보낸만큼 더해준다.
    }
  }
  ```





## Vote

- vote.sol

- 투표하는 소스코드 (단, 중복투표 안되고, 배포한 사람만이 후보자를 등록할 수 있다)

  ```javascript
  pragma solidity ^0.5.8;
  
  contract Vote{
  
    mapping(address => bool)isVoted;						// 각 계정이 투표했는지 여부
    uint8 numOfCandidate = 0;										// 후보자들의 수
    mapping(string => uint)score;  							// 각 후보자들의 득표수
    mapping(uint8 => string) candidateList;     // 후보자 리스트
    address owner=msg.sender;										// owner는 배포자
    
    constructor() public{										//생성자
    }
  
    modifier ownerOnly() {			//권한을 owner에게만 주기위해 modifier를 사용한다.
      require(msg.sender==owner);
      _;
    }
    
    function addCandidate (string memory candidate) public ownerOnly{  // 후보자 등록
      bool found = false;
      for(uint8 i=0;i<numOfCandidate;i++){		//후보자들의 수만큼 for문 반복
        if(keccak256(bytes(candidateList[i])) == keccak256(bytes(candidate))){
          // 입력한 후보자와 리스트에 있는 후보자의 이름이 같다면
          /*
          	string과 string은 비교할 수 없다.(Solidity의 특징)
          	따라서 keccak256이라는 해시값을 비교해야한다. 
          	에러가 나는 이유는 keccak256에는 string값을 입력으로 받을 수 없기에 bytes로 형변환이 필요하다.
          */
          found = true;  //found를 true로 바꿔줌.
          break;
        }
      }
  
      require(!found);	//found가 true인 경우
  
      candidateList[numOfCandidate] = candidate;	// 지명한 후보자를 리스트에 추가
      numOfCandidate ++;		// 후보자 추가됨.
    }
  
    function vote(string memory candidate) public {	// 투표
      require(!isVoted[msg.sender]);	// 함수를 호출한 사람이 투표를 안했다면 지명한 후보자를 투표
      isVoted[msg.sender]=true;
      score[candidate]++;		//후보자의 득표수 추가
    }
  
    function getNumOfCandidate() public view returns(uint8) {
      return numOfCandidate;
    }
  
    function getCandidate(uint8 index) public view returns(string memory) {
      return candidateList[index];
    }
  
    function getScore(string memory candidate) public view returns(uint) {
      return score[candidate];
    }
  
    function killContract() public ownerOnly{
      selfdestruct(owner);
    }
  }
  ```





## Lottery

- Lottery.sol

- timestamp를 이용해서 랜덤한 수를 추출 후 당첨자 뽑기(단, 배포자만 뽑을 수 있다.)

  ```javascript
  pragma solidity ^0.5.8;
  
  contract Lottery{
    // 응모자를 관리하는 매핑
    mapping (uint => address) public applicants;
  
    // 응모자 수
    uint public numApplicants;
  
    // 당첨자 정보
    address public winnerAddress;
    uint public winnerInd;
  
    // 소유자
    address public owner;
  
    // 타임스탬프
    uint public timestamp;
  
    // 소유자 여부를 확인하는 modifier
    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }
  
    constructor() public {
      numApplicants=0;
      owner = msg.sender;
    }
  
    function enter() public {	//응모자 추가
      for(uint i=0;i<=numApplicants;i++){
        applicants[i]=msg.sender;
      }
      numApplicants++;
    }
  
    function hold() public onlyOwner{	//당첨번호 돌리기
  
      timestamp = block.timestamp;
  
      winnerInd = timestamp % numApplicants;
      winnerAddress = applicants[winnerInd];
    }
  
  }
  ```





## CrowdFunding

- Crowdfunding.sol

- 일정한 모금액이 모이면 모금액을 배포자에게 주고 안 모일 경우 다시 모금한 금액을 돌려주는 소스코드

  ```javascript
  pragma solidity ^0.5.8;
  
  contract CrowdFunding{
  
    struct Investor{			// 투자자
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
      Investor memory newInvestor;	//새로운 투자자 객체 생성
      newInvestor.addr = msg.sender;	// 투자자의 주소정보
      newInvestor.amount = msg.value;	// 투자자의 투자금액
      totalAmount += msg.value;				// totalAmount에 투자금액 추가
      investors[numOfInvestors] = newInvestor;  // 새로운 투자자를 투자자리스트에 추가
      numOfInvestors++;								// 투자자수 증가
    }
  
    function checkGoalFunding() public payable onlyOwner{	// 투자금액이 목표치에 도달했으면 빼기
      if(totalAmount >= goalAmount){	// 만약 모인 금액이 목표 금액보다 많다면
        owner.transfer(address(this).balance);	// 배포자의 계좌로 쏴줌.
        totalAmount=0;	// 보낸 후 totalAmount는 0으로 초기화
      }else{													// 금액이 안모인 경우
        for(uint i=0;i<numOfInvestors;i++){	  // 투자자들 수만큼 반복문
          investors[i].addr.transfer(investors[i].amount);	// 투자했던 사람들에게 다시 돌려주기
          totalAmount=0;	//다 돌려주고 초기화
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

  
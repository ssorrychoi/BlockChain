20190902

- 비트코인 vs 이더리움 차이점 => ***스마트 컨드랙트***를 지원 하느냐 안하느니

## Solidity Language(v0.4.11)

- 이더리움 기반의 스마트 컨트랙트를 작성할 수 있는 객체지향형 프로그래밍 언어
- 스마트 컨트랙트는 이더리움 가상 머신인 EVM(Ethereum Virtual Machine)에서 실행
- 솔리디티 소스파일 확장자는 .sol
- 솔리디티를 이용하여 DApp(Decentralized application) 개발
- 솔리디티 컴파일러 - 솔크(Solc)
  
- solc/app/source.sol
  
- https://remix.ethereum.org/#optimize=false&evmVersion=null

  - previous version

- HelloWorld.sol

  ```javascript
  pragma solidity ^0.4.11;    //version of solidity
  
  contract HelloWorld {       //similar of javascript class
    string public greeting;	//실제 우리가 원하는 장부
  //0.4.16버전 이후로 생성자의 문법이 조금 달라짐.
    function HelloWolrd(string _greeting){	//class명과 똑같은 함수 = 생성자
      greeting = _greeting;
    }
    
    function setGreeting(string _greeting){		//함수
      greeting = _greeting;
    }
  
    function say() constant returns (string){	 //함수
      return greeting;
    }
  }
  ```

- 그냥 컴파일을 하면 **에러**가 남.

- Compiler version을 0.4.11버젼으로 바꿔줘야 함.

- Remix IDE를 쓰는 이유

  ![image](https://user-images.githubusercontent.com/43080040/64084772-6fa73500-cd69-11e9-89af-77189587f7be.png)

  Environment를 지원하기 때문,,,

- terminal > cd Desktop/Practice/Geth/geth182 > `./geth --datadir chaindata --networkid 5678 --nodiscover --maxpeers 0 --rpc --rpcaddr "0.0.0.0" --rpcport 8545 --rpccorsdomain "*" --rpcapi "admin, db, eth, debug, miner, net, shh, txpool,personal,web3" console` // geth 실행

- Environment 변경

  ![image](https://user-images.githubusercontent.com/43080040/64085256-96b33600-cd6c-11e9-876e-245262bc21d9.png)

- Geth

- `eth.getBalance(eth.accounts[0])` 명령어로 계좌 잔액 확인

  ![image](https://user-images.githubusercontent.com/43080040/64085563-82703880-cd6e-11e9-8697-4fe2c625b7f0.png)

  - `personal.unlockAccount(eth.accounts[0])`
  - `miner.start()`

![image](https://user-images.githubusercontent.com/43080040/64085595-b3e90400-cd6e-11e9-9011-aed1d2830eae.png)

- setGreeting에 문자열을 넣고 setGreeting버튼을 누른다.

- `transact to HelloWorld.setGreeting pending ... ` 이라고 console창에 뜬다.

-  `greeting` 과 `say` 함수를 호출하면 "Hello" 문자열이 아닌 deploy했던 문자열이 나온다.

- terminal에 가보면 pendingTransaction으로 확인할 수 있다. (pending 임을 확인할 수 있다.)

- `miner.start()` 를 실행하고 다시 Remix로 돌아와서 다시 greeting 과 say 버튼을 클릭하면

  ![image](https://user-images.githubusercontent.com/43080040/64085703-4db0b100-cd6f-11e9-8127-5b2d772b6048.png) 바뀌어 있는 것을 확인할 수 있다.

- **Javascript VM** vs **Web3 Provider**

  - Javascript VM : 가상으로 모든 환경들을 제공해준다.
  - Web3 Provider : 내가 Geth를 직접 실행하고 mining도 해야되고 많이 해야한다.



## Opcodes

- https://ethervm.io/#opcodes
- Ethereum에서의 어셈블리어
- ***ABI ( Application Binary Interface )***
  - high level language 와 low level language를 서로 연결해주는 인터페이스
  - 컴파일러에 의해서 생성됨



## Pragma

- 현재 솔리디티 파일에 사용할 컴파일러 버전을 지정하는 지시자
- 일반적으로 솔리디티 파일의 첫번째 줄에 명시
- `pragma solidity ^0.5.8`
- 버전표시 : major.miner.patch
- ^1.2.3 =>  1.2.3 <= v < 2.0.0



## Solidity Language(v0.5.8)

- 버전에 따라 문법이 조금씩 달라짐.

- `constant` 가 사라지고 => `view` 또는 `pure` 를 사용

- 생성자는 contract와 같은 함수 이름이 아닌 constructor로 통일한다.

- `public` 이나 `private` 을 필수적으로 명시한다.

- parameter에 `memory` 를 필수적으로 명시한다.

- HelloWorld.sol

  ```javascript
  pragma solidity ^0.5.8;    //version of solidity
  
  contract HelloWorld {       //similar of javascript class
  
    string public greeting; 
  
    constructor(string memory _greeting) public {	//생성자는 constructor, memory 명시, public명시
      greeting = _greeting;
    }
  
    function setGreeting (string memory _greeting) public{	//memory, public 명시
      greeting = _greeting;
    }
  
    function say() public view returns (string memory){ //view로 바꿔주고 public, memory 명시
      return greeting;
    }
  }
  ```





## Solidity 개요

- **Solidity**
  - 정적타입 언어 - 변수의 자료형이 컴파일 시점에 결정
  - 객체지향 언어 - 객체지향 언어이지만 기능에 제약이 있음.
  - 대소문자 구분
  - 세미콜론( ; )으로 문장을 구분
  - 확장자명은 "**.sol**" 을 사용
- Gas 비용

![image](https://user-images.githubusercontent.com/43080040/64091740-9dea3c00-cd8c-11e9-8c6a-3e92ea097960.png)

- **상태변수**

  - 채굴자가 블록체인 및 이더리움 원장에 영구적으로 저장하는 값
  - 계약 내에서 선언되었으나 함수에 속하지 않은 변수
  - 계약의 현재 값을 저장
  - 상태 변수의 메모리는 정적으로 할당되며 계약의 수명 내에서는 그 크기가 늘거나 줄지 않는다.

- **한정자( qualifier )**

  - 형식 : 자료형 한정자 변수명;

    - Ex) int public stateVar1;

    
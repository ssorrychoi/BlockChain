---
layout: post
title: Solidity_2
subtitle: Solidity Syntax
tags: [solidity,Smart contract]
comments: true

---

20190903

### Review

- MyContract.sol

  ```javascript
  pragma solidity ^0.5.8;
  
  contract MyContract{
    string value;
    constructor (string memory _value) public {
      value = _value;
    }
    //get
    function getValue() public returns (string memory){
      return value;
    }
    //set
    function setValue(string memory _value) public{
      value = _value;
    }
  }
  ```

## dataType

- dataType.sol

  ```javascript
  pragma solidity ^0.5.8;
  
  contract MyContract{
      //public 으로 설정하면 get함수를 만들지 않아도 값을 확인할 수 있다.
      string public value;
      bool public isValid = true;
      int public num1 = 100;
      int public num2 = -100;
      uint public unum1 = 200;
      int256 public num256 = -256;
      uint256 public unum256 = 256;
      
      int8 public num8 = 10;     //(-128~127)
      uint8 public unum8 = 20;   //(0~255)
  }
  ```

  ![image](https://user-images.githubusercontent.com/43080040/64137007-587f4a80-ce30-11e9-8994-e9af53ccd497.png)

- state.sol

  ```javascript
  pragma solidity ^0.5.8;
  
  contract MyContract{
    enum State {Waiting, Ready, Active};
    
    State public state;
    
    constructor() public{
      state = State.Waiting;
    }
    function activate() public {
      state = State.Active;
    }
    function isActive() public view returns(bool){
      return state == State.Active;
    }
  }
  ```

- Grade.sol

  ```javascript
  pragma solidity ^0.5.8;
  
  contract MyContract{
      enum Grade {Bronze, Silver, Gold}		//Bronze = 0 , Silver = 1, Gold = 2
      
      Grade public Kim = Grade.Bronze;    // 0
      Grade public Lee = Grade.Silver;    // 1
      Grade public Park = Grade.Gold;     // 2
      
      function setGradeKim(uint8 newGrade) public{
          Kim = Grade(newGrade);
      }
  }
  ```

- Person.sol

  ```javascript
  pragma solidity ^0.5.8;
  
  contract MyContract{
    struct Person{
      string _firstName;
      string _lastName;
    }
    uint public peopleCount;
  
    Person[] public people;
  
    function addPerson(string memory _firstName, string memory _lastName) public{
      people.push(Person(_firstName,_lastName));
      peopleCount++;
    }
  }
  ```

- mappingEx.sol

  ```javascript
  pragma solidity ^0.5.8;
  
  contract MyContract{
    struct Person{
      uint _id;
      string _firstName;
      string _lastName;
    }
    uint public peopleCount;
    mapping(address => Person) public people;
  
    //address1 => {0,"JS","CHOI"}
    //address2 => {1,"MJ","KIM"}
    //address3 => {2,"YC","SHIN"}
  
    //people[address1]; => {0,"JS","CHOI"}
  
    function addPerson(address _address, string memory _firstName, string memory _lastName) public{
      peopleCount++;
      people[_address] = Person(peopleCount, _firstName, _lastName);
    }
  }
  ```



## CryptoZombie.io

- Chapter1

  ```javascript
  pragma solidity ^0.4.19;
  
  contract ZombieFactory {
  
    // 여기에 이벤트 선언
    event NewZombie(uint zombieId,string name, uint dna);
  
    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;
  
    struct Zombie {
      string name;
      uint dna;
    }
  
    Zombie[] public zombies;
  
    function _createZombie(string _name, uint _dna) private {
      //zombies.push(Zombie(_name, _dna));
      // 여기서 이벤트 실행
      uint id = zombies.push(Zombie(_name, _dna))-1;
      NewZombie(id,_name,_dna);
    } 
  
    function _generateRandomDna(string _str) private view returns (uint) {
      uint rand = uint(keccak256(_str));
      return rand % dnaModulus;
    }
  
    function createRandomZombie(string _name) public {
      uint randDna = _generateRandomDna(_name);
      _createZombie(_name, randDna);
    }
  
  }
  
  ```



## 참조형식

```javascript
pragma solidity ^0.5.8;
contract ReferenceContract {
 function getValueType( ) public pure returns (uint ) {
   uint a;
   a = 1;
   uint b = a;  //b=1  => b는 a의 값만 가져오는 것이다.
   b = 2;				//b=2  
   return a;
 }
 function getReferenceType() public pure returns   (uint[2] memory) {
   uint[2] memory a;
   a[0] = 1;
   a[1] = 2;
   uint[2] memory b = a;	//b는 a의 메모리 공간을 공유
   b[0] = 10;
   b[1] = 20;
   return a;
 }
}
```



## 수정자(modifier)

```javascript
pragma solidity ^0.5.8;

contract ModifierContract {
  uint256 public peopleCount = 0;
  mapping(uint => Person) public people;

  address owner;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  struct Person {
    uint _id;
    string _firstName;
    string _lastName;
  }

  constructor() public {
    owner = msg.sender;
  }

  function incrementCount() internal {
    peopleCount += 1;
  }

  function addPerson(string memory _firstName,string memory _lastName) public onlyOwner
  {
    incrementCount();
    people[peopleCount] = Person(peopleCount, _firstName, _lastName);
  }
}

```


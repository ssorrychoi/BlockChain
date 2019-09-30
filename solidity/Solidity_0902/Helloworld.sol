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
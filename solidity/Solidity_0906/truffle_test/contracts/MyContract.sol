pragma solidity ^0.5.8;

contract MyContract {
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
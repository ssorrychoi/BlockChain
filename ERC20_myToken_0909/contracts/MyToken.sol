pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract MyToken is ERC20Detailed, ERC20{ // ERC20Detailed 와 ERC20 두가지를 상속받음.
    uint public initialSupply = 1000e18;    //최초 토큰 수


    constructor (string memory _name, string memory _symbol, uint8 _decimals, uint _initialSupply)
        // 생성자 생성 & 인자를 받아서 초기화 가능(initialSupply) & uint는 memory를 붙여줄 필요가 없다.
        ERC20Detailed(_name,_symbol,_decimals) public { // 상위의 생성자 호출
            initialSupply = _initialSupply ** _decimals;
            _mint(msg.sender,initialSupply);
    }
}
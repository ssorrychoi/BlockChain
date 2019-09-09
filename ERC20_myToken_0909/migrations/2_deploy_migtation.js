var MyToken = artifacts.require("./MyToken.sol");

const _name = "MyToken";
const _symbol = "MTK";
const _decimals = 18;
const _initialSupply = 10000;

module.exports = function(deployer) {
  deployer.deploy(MyToken,_name,_symbol,_decimals,_initialSupply);
};
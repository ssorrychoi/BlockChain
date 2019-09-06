const TestContract = artifacts.require("TestContract");


module.exports = function(deployer) {
  deployer.deploy(TestContract);    //실제 블록체인에 배포하는 함수
};

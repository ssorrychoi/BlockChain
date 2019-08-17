const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index,timestamp,transactions,prevHash){
    this.index = index;
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.curHash = this.calculateHash();
    this.nonce = 0;
    this.transactions = transactions;
  }
  calculateHash(){
    return SHA256(this.prevHash+this.timestamp+this.nonce+JSON.stringify(this.transactions)).toString();
  }
  printBlock(){
    console.log(JSON.stringify(this,null,2));
  }

}
module.exports = Block;
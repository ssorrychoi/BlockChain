const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index,timestamp,transactions){
        this.index = index;
        this.timestamp = timestamp;
        this.prevHash = '';
        this.curHash = this.calculateHash();
        this.nonce = 0;
        this.transactions = transactions;
    }

    calculateHash(){
        return SHA256(this.prevHash+this.timestamp+this.nonce+JSON.stringify(this.transactions)).toString();
    }

    printBlock(){
        // console.log("Block[",this.index,"]");
        // console.log("   timestamp: ",this.timestamp);
        // console.log("   prevHash : ",this.prevHash);
        // console.log("   curHash  : ",this.curHash);
        // console.log("   nonce    : ",this.curHash);
        // console.log("   data     : ",this.transactions);
        console.log(JSON.stringify(this,null,2));
    }
}


module.exports = Block;

const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress+this.toAddress+this.amount).toString();
    }

    printTransaction(){
        console.log('from   : ',this.fromAddress);
        console.log('to     : ',this.toAddress);
        console.log('amount : ',this.amount);
    }
}
module.exports = Transaction;
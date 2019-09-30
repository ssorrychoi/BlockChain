var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');


class Transaction {
    constructor(fromAddress,toAddress,amount){
        this.toAddress = toAddress;
        this.fromAddress = fromAddress;
        this.amount = amount;
        this.signature = undefined;
    }
    
    printTransaction(){
        console.log(JSON.stringify(this,null,2));
    }
    isValid(){
        // signature가 있는지 검사
        if(!this.signature || this.signature.length===0){
            console.log('Warn : No signature');
            return false;
        }

        //정상적으로 sign 되었는지 검사
        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);

    }

    calculateHash(){
        return SHA256(this.fromAddress+this.toAddress+this.amount).toString();
    }

    signTransaction(privKey){
        // console.log(privKey.getPublic('hex'));
        // console.log(this.fromAddress);
        if(privKey.getPublic('hex') !== this.fromAddress){
            console.log('Err : No permission');
            return false;
        }
        const hashTx = this.calculateHash();
        const sig = privKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');
        return true;
    }
}

module.exports = Transaction;
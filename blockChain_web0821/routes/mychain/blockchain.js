const Block = require('./block');
const Transaction = require('./transaction');
const fs = require('fs');

class BlockChain{
    constructor(){
        this.difficulty=2;
        this.miningReward = 100;
        this.chain = [new Block(0,Date.now(),[],'Genesis Block')];
        this.pendingTransactions = [];
        this.accounts=[];
    }

    addBlock(block){
        block.prevHash = this.getLatestBlock().curHash;
        //block.curHash = block.miningBlock(2);
        block.miningBlock(this.difficulty);
        this.chain.push(block);
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    printBlockChain(){
        console.log(JSON.stringify(this,null,2));
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            //블록 내부 해시값 검증
            if(curBlock.curHash !== curBlock.calculateHash()){
                console.log('Err 1 : chain['+i+']');
                return false;
            }

            //이전 블록 해시값 검증
            if(curBlock.prevHash !== prevBlock.curHash){
                console.log('Err 2 : chain['+i+']');
                return false;
            }
        }
        return true;
    }

    addTransaction(transaction){
        //주소 검사
        if(!transaction.fromAddress || !transaction.toAddress){
            console.log("Warn : Invalid transaction address");
            return false;
        }
        //validation check
        if(!transaction.isValid()){
            console.log('Warn : Invalid transaction');
            return false;
        }
        //pending transaction에 추가
        this.pendingTransactions.push(transaction);
    }

    minePendingTransaction(rewardAddress){

        this.pendingTransactions.unshift(new Transaction(null,rewardAddress,this.miningReward));   //현재 배열을 뒤로 미루고 맨앞에 넣는 함수.

        let block = new Block(this.getLatestBlock().index + 1, Date.now(), this.pendingTransactions, this.getLatestBlock().curHash);

        block.miningBlock(this.difficulty);

        console.log("Mined....");
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    getBalance(address){
        let balance = 0;

        for(let block of this.chain){
            for(let tx of block.transactions){
                if(tx.fromAddress == address){
                    balance -= tx.amount;
                }
                if(tx.toAddress == address){
                    balance += tx.amount;
                }
            }
        }
        return balance;
    }

    getAllTransactionOfWallet(address){
        const txs = [];

        for(let block of this.chain){
            for(let tx of block.transactions){
                if(tx.fromAddress == address || tx.toAddress == address){
                    txs.push(tx);
                }
            }
        }
        return txs;
    }


    loadKeyStore() {
        console.log('load keystore...') 
        if (fs.existsSync('./routes/mychain/keystore.json')) {
           
            let rawdata = fs.readFileSync('./routes/mychain/keystore.json');
            let accountList = JSON.parse(rawdata);
           
            this.accounts = accountList;
            console.log(this.accounts);
        }
    }
    saveKeyStore() {
        fs.writeFileSync('./routes/mychain/keystore.json', mychain.accounts);
    }
 
}

module.exports = BlockChain;
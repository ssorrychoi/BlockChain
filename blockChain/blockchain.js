const Block = require('./block');
const Transaction = require('./transaction');



class BlockChain{
    constructor(){
        this.chain = [new Block(0,Date.now(),[],"GenesisBlock")];
    }

    printAllBlockchain(){
        this.chain.map((block,index)=>{
            console.log("*******************************");
            block.printBlock();
        });
    }
    
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(block){
        //this.prevHash = this.chain[this.chain.length-1].curHash;
        block.prevHash = this.getLatestBlock().curHash;
        block.curHash = block.calculateHash();
        this.chain.push(block);
    }

    
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            
            //해당 블록 해시값을 재계산 해서 curHashs 값과 비교
            if(curBlock.curHash !== curBlock.calculateHash()){
                console.log('Err1 : chain[',i,']');
                return false;
            }

            //preHash 값 검증
            if(curBlock.prevHash !== prevBlock.curHash){
                console.log('Err2 : chain[',i,']');
                return false;
            }
        }
        console.log('OK');
        return true;
    }
}

module.exports = BlockChain;
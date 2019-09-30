var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

async function getTransactionByAccount(myaccount, startBlockNumber, endBlockNumber){
    console.log('Transaction By Account');
    console.log('Account : ', myaccount);
    console.log('Block : ', startBlockNumber, ' - ', endBlockNumber);

    for(let i=startBlockNumber; i<=endBlockNumber; i++){
        let block = await web3.eth.getBlock(i);
/*         if(block.transactions.length > 0){
            console.log(block);
            break;
        } */

         if(block != null && block.transaction != null) {
            //for(let i = 0; i<block.transaction.length; i++){
                block.transactions.forEach( async (el) => {
                    let tx = await web3.eth.getTransaction(el);
                    console.log(tx);
                    console.log("tx hash : ", tx.hash);
                    console.log("   nonce : ", tx.nonce);
                    console.log("   blocknumber : ", tx.blocknumber);
                    console.log("   from : ", tx.from);
                    console.log("   to : ", tx.to);
                })
        }
    }
}

getTransactionByAccount("0xb3015912ae0ac770328768e09d008a68204629e2", 0,279 ); //0번 계정 , 트랜잭션이 있는 BlockNumber, endNumber
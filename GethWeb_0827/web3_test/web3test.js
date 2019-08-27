var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
var Tx = require('ethereumjs-tx').Transaction;

//console.log(web3);

/*
{
 address: '0xd577d4fA6571C2FaAa76Cb97835b0cBC0a9aFf30',
 privateKey: '0xc444b705fd7feee0662cf58fb71de40f6da12f1e76e7f198e27b14809eb28d5f'
}
*/ 
web3.eth.getBlockNumber((err,number)=>{
    console.log(number);
})

web3.eth.getBlock(163)
.then((block)=>{
    console.log(block);
})

var privateKey = Buffer.from('c444b705fd7feee0662cf58fb71de40f6da12f1e76e7f198e27b14809eb28d5f','hex');
var txParams = {
    nonce: '0x00',
    gasPrice: '0x09184e72a000',
    gasLimit: '0x2710',
    to: '0xf6cd8687b51194d541983eae81ef8e167a23e1fe',
    value: '0x00',
    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
  }
  var tx = new Tx(txParams);
  tx.sign(privateKey);
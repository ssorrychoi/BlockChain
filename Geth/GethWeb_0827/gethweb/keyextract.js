// var Web3 = require('web3');
// var web3 = new Web3('http://localhost:8545');

// const keystore = {
//     "address":"9add686bc075735225a53fe9412c21fc28a4d6c1",
//     "crypto":{
//         "cipher":"aes-128-ctr",
//         "ciphertext":"c7e713f42ab3d4051bbdeb3cadff5ac6e2848219abe87c0cfd47dcebc310442b",
//         "cipherparams":{"iv":"136ec2d61274a9a45d05dd56f7057da2"},
//         "kdf":"scrypt",
//         "kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"c7735990f3ce0df7abbd176028844eb4255e52ce0191c71d9ea06d3a488cefe3"},
//         "mac":"1ea7e817a7ff07159b72df9cdde1ef0fb3aa967eef6b3b646773a839cb93c1ae"
//     },
//     "id":"ad54361e-4f53-4b19-a5b7-5c1d44074a2b","version":3
// };
// const decryptAccount = web3.eth.accounts.decrypt(keystore,'1234'); //password
// console.log(decryptAccount.privateKey); 
// //privateKey : 0xb4d359173e37931117863ade346129f8901cb15f6863adc1642667959aa4f368

// var fromAddress = "0x9add686bc075735225a53fe9412c21fc28a4d6c1";
// var toAddress = "0x0730fe2d899ef1579e8e7431243e677d6a440a55";
// var amount = web3.utils.toHex(1111111);

// async function sendTransaction(fromAddress, toAddress, amount) {
//     var txPrams = {
//         from : fromAddress,
//         to : toAddress,
//         value : amount,
//         gas: web3.utils.toHex(0x21000)
//     }
    
//     var signedTx = await decryptAccount.signTransaction(txPrams);
//     console.log(signedTx);

//     web3.eth.sendSignedTransaction(signedTx.rawTransaction)
//     .once('transactionHash', (hash) => {
//         console.log(hash);
//     })
// }

// sendTransaction(fromAddress,toAddress,amount);





var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

const keystore={"address":"b3015912ae0ac770328768e09d008a68204629e2","crypto":{"cipher":"aes-128-ctr","ciphertext":"8a1932f7aa8bf65e4fedf772150a73ecea6d7464c3716f9b3f2b593313500b91","cipherparams":{"iv":"dd49e6017c7413c521b8f2cfcc307281"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"3369e6c3009d5519fc9029d7df7d1042ac72c9e3de7e31933f5bd5f92be55937"},"mac":"56711a9b7c48c5924093033b87eb3bd6c1f0f89cddd534d48a8ed99c3923fa79"},"id":"eff9f3ae-a118-4a57-b0e7-13f06d0725b5","version":3}
const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth');

console.log(decryptAccount.privateKey);

// privKey = 0x300c8aca71926c57ce6387a1de3af2000d9c295232ac3b8fa0da80eef7914bcc

var fromAddress = "0xb3015912ae0ac770328768e09d008a68204629e2";
var toAddress = "0x9dd50f1e2618d4c20e0731a81a6b55ccdf86e0c9";
var amount = web3.utils.toHex(1000);

async function sendTransaction(fromAddress, toAddress, amount) {
    var txPrams = {
        from : fromAddress,
        to : toAddress,
        value : amount,
        gas : web3.utils.toHex(0x210)
    }

    var signedTx = await decryptAccount.signTransaction(txPrams);
    console.log(signedTx);


    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .once('transactionHash', (hash) => {
        console.log(hash);
    })

}

sendTransaction(fromAddress, toAddress, amount);
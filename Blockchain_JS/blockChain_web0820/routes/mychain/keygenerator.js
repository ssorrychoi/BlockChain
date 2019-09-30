//https://www.npmjs.com/package/elliptic

var EC = require('elliptic').ec;
 
// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');
 
// Generate keys
var key = ec.genKeyPair();
 
console.log('PrivateKey = ',key.getPrivate('hex'));  //216bit
console.log('PublicKey = ',key.getPublic('hex'));   //512bit

// Sign the message's hash (input must be an array, or a hex-string)
var msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var signature = key.sign(msgHash);
 
// Export DER encoded signature in Array
var derSign = signature.toDER();
 
// Verify signature
console.log("signDER : ",derSign);
console.log(key.verify(msgHash, derSign));

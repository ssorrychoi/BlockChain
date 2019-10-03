---
layout: post
title: Hyperledger_JES
subtitle: BasicNetwork+chaincode_Ex2+Myweb
categories: [Hyperledger Fabric,Security]
tags: [Hyperledger Fabric,Smart contract]
comments: true
---

20191003

# Hyperledger Fabric with JES

## BasicNetwork + chaincode_Example02_node + Myweb

✓노드로 체인코드 개발해보기 실습!

`docker ps` 명령으로 컨테이너가 실행중에 있는지 확인! 실행되고 있는 컨테이너가 없다면 `/fabric-samples/basic-network` 에서 `./start.sh` 명령을 실행!

👉🏻`Ubuntu > 💲cd ~/HLF/fabric-samples/chaincode/chaincode_example02/node`

![image](https://user-images.githubusercontent.com/43080040/66098359-3d455d80-e5dd-11e9-9371-b1dec07e54ab.png)

node 로 만들어진 chain code 를 확인할 수 있다.

```javascript
/************************** chaincode_example02 **************************/
const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {

  // Initialize the chaincode
  
  /************************** Init 함수 **************************/
  async Init(stub) {
    console.info('========= example02 Init =========');
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let args = ret.params;
    // initialise only if 4 parameters passed.
    if (args.length != 4) {
      return shim.error('Incorrect number of arguments. Expecting 4');
    }

    let A = args[0];
    let B = args[2];
    let Aval = args[1];
    let Bval = args[3];

    if (typeof parseInt(Aval) !== 'number' || typeof parseInt(Bval) !== 'number') {
      return shim.error('Expecting integer value for asset holding');
    }

    try {
      await stub.putState(A, Buffer.from(Aval));
      try {
        await stub.putState(B, Buffer.from(Bval));
        return shim.success();
      } catch (err) {
        return shim.error(err);
      }
    } catch (err) {
      return shim.error(err);
    }
  }
/************************** Invoke (배포) 함수 **************************/
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.log('no method of name:' + ret.fcn + ' found');
      return shim.success();
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }
/************************** 이건 send하는 함수이다.!!!주의! **************************/
  async invoke(stub, args) {
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let A = args[0];
    let B = args[1];
    if (!A || !B) {
      throw new Error('asset holding must not be empty');
    }

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      throw new Error('Failed to get state of asset holder A');
    }
    let Aval = parseInt(Avalbytes.toString());

    let Bvalbytes = await stub.getState(B);
    if (!Bvalbytes) {
      throw new Error('Failed to get state of asset holder B');
    }

    let Bval = parseInt(Bvalbytes.toString());
    // Perform the execution
    let amount = parseInt(args[2]);
    if (typeof amount !== 'number') {
      throw new Error('Expecting integer value for amount to be transaferred');
    }

    Aval = Aval - amount;
    Bval = Bval + amount;
    console.info(util.format('Aval = %d, Bval = %d\n', Aval, Bval));

    // Write the states back to the ledger
    await stub.putState(A, Buffer.from(Aval.toString()));
    await stub.putState(B, Buffer.from(Bval.toString()));

  }
/************************** delete 함수 **************************/
  // Deletes an entity from state
  async delete(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let A = args[0];

    // Delete the key from the state in ledger
    await stub.deleteState(A);
  }

  // query callback representing the query of a chaincode
/************************** query 함수 (조회) **************************/
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the person to query')
    }

    let jsonResp = {};
    let A = args[0];

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      jsonResp.error = 'Failed to get state for ' + A;
      throw new Error(JSON.stringify(jsonResp));
    }

    jsonResp.name = A;
    jsonResp.amount = Avalbytes.toString();
    console.info('Query Response:');
    console.info(jsonResp);
    return Avalbytes;
  }
};

shim.start(new Chaincode());
```

Ubuntu 의 `/fabric-samples/chaincode/chaincode_example02/` 디렉토리는

CLI의 `/opt/gopath/src/github.com/chaincode_example02/` 디렉토리와 volume 되어있다.

![image](https://user-images.githubusercontent.com/43080040/66098763-dd4fb680-e5de-11e9-962e-0ed673a27805.png)

### ✔️Peer0 에 chaincode_example02 체인코드 install 하기

👉🏻`cli> peer chaincode install -n jes_cc_node -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode_example02/node/ `

=> peer에 chaincode를 설치할건데 이름(-n)은 ssorry_cc_node 이고 버전(-v)은 1.0, 언어(-l)는 node로 할것이며 경로(-p)는 `/opt/gopath/src/github.com/chaincode_example02/node/` 이다. ❌반드시 ***절대경로***를 쓸것!

![image](https://user-images.githubusercontent.com/43080040/66098971-b2b22d80-e5df-11e9-9f3c-536ae1439389.png)

✔️설치한 후 확인해보기

👉🏻`Ubuntu > docker exec -it peer0.org1.example.com bash` 명령어로 Peer0에 접속

👉🏻`cd /var/hyperledger/production/chaincodes` 로 디렉토리 변경 후 `ls` 명령어로 chaincode가 설치된 것을 확인 가능.

![image](https://user-images.githubusercontent.com/43080040/66099178-c8742280-e5e0-11e9-842e-d32e22c951fc.png)

✔️ cli 컨테이너에서 체인코드를 mychannel에 연결하기

👉🏻`cli> peer chaincode instantiate -C mychannel -n ssorry_cc_node -l node -v 1.0 -c '{"Args":["init","a","100","b","200"]}'`

=> peer에 chaincode를 연결할건데 채널이름(-C)은 mychannel이고 체인코드이름(-n)은 sorry_cc_node이고 언어(-l)는 node이고 버전(-v)은 1.0 이고 함수 {Args는 init이고 a=100, b=200}이라고 정의할 것이다.

```javascript
/************************** Init 함수 **************************/
  async Init(stub) {
    console.info('========= example02 Init =========');
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let args = ret.params;
    // initialise only if 4 parameters passed.
    if (args.length != 4) {
      return shim.error('Incorrect number of arguments. Expecting 4');
    }

    let A = args[0];
    let B = args[2];
    let Aval = args[1];
    let Bval = args[3];

    if (typeof parseInt(Aval) !== 'number' || typeof parseInt(Bval) !== 'number') {
      return shim.error('Expecting integer value for asset holding');
    }

    try {
      await stub.putState(A, Buffer.from(Aval));
      try {
        await stub.putState(B, Buffer.from(Bval));
        return shim.success();
      } catch (err) {
        return shim.error(err);
      }
    } catch (err) {
      return shim.error(err);
    }
  }
```

![image](https://user-images.githubusercontent.com/43080040/66099686-cc08a900-e5e2-11e9-8bf7-39811e54e3c0.png)

✓couchDB에서 ssorry_cc_node가 설치된 것을 확인할 수 있다

![image](https://user-images.githubusercontent.com/43080040/66099833-6832b000-e5e3-11e9-96d7-3ca6379e278f.png)

👉🏻`peer chaincode query -C mychannel -n ssorry_cc_node -c '{"Args":["query","a"]}'` => 100

👉🏻`peer chaincode query -C mychannel -n ssorry_cc_node -c '{"Args":["query","b"]}'` => 200 

✓값이 제대로 저장 되어있음을 확인 가능

![image](https://user-images.githubusercontent.com/43080040/66099910-bb0c6780-e5e3-11e9-8f10-3241dfe743d4.png)

### ✔️a의 값을 b에게 보내기

👉🏻`cli> peer chaincode invoke -C mychannel -n ssorry_cc_node -c '{"Args":["invoke","a","b","10"]}'`

👉🏻`cli> peer chaincode query -C mychannel -n ssorry_cc_node -c '{"Args":["query","a"]}'`

![image](https://user-images.githubusercontent.com/43080040/66100270-39b5d480-e5e5-11e9-8361-57f51f7ab690.png)

- chaincode를 안헷갈리게 수정한 후 배포하기

```javascript
/************************** chaincode_example02 **************************/

/************************** 이건 send하는 함수이다.!!!주의! **************************/
/************************** invoke 함수를 send로 바꾸겠다! **************************/
  //async invoke(stub, args) {
		async send(stub, args) {
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let A = args[0];
    let B = args[1];
    if (!A || !B) {
      throw new Error('asset holding must not be empty');
    }

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      throw new Error('Failed to get state of asset holder A');
    }
    let Aval = parseInt(Avalbytes.toString());

    let Bvalbytes = await stub.getState(B);
    if (!Bvalbytes) {
      throw new Error('Failed to get state of asset holder B');
    }

    let Bval = parseInt(Bvalbytes.toString());
    // Perform the execution
    let amount = parseInt(args[2]);
    if (typeof amount !== 'number') {
      throw new Error('Expecting integer value for amount to be transaferred');
    }

    Aval = Aval - amount;
    Bval = Bval + amount;
    console.info(util.format('Aval = %d, Bval = %d\n', Aval, Bval));

    // Write the states back to the ledger
    await stub.putState(A, Buffer.from(Aval.toString()));
    await stub.putState(B, Buffer.from(Bval.toString()));

  }
```

✔️이 경우는 체인코드를 ***새로 배포*** 함. (체인코드의 이름을 다르게 한 후)

👉🏻`peer chaincode install -n ssorry_cc_node_1 -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode_example02/node/`

` peer chaincode instantiate -C mychannel -n ssorry_cc_node_1 -l node -v 1.0 -c '{"Args":["init","a","100","b","200"]}'`

`peer chaincode invoke -C mychannel -n ssorry_cc_node_1 -c '{"Args":["send","a","b","50"]}'`

![image](https://user-images.githubusercontent.com/43080040/66100671-d462e300-e5e6-11e9-8fdd-12e8efe17b7a.png)

{a=100, b=200} 에서 {a=50, b=250} 으로 보내진 것을 확인 할 수 있다.

✔️체인코드를 ***업데이트*** 하는 경우

👉🏻`peer chaincode install -n ssorry_cc_node -v 1.1 -l node -p /opt/gopath/src/github.com/chaincode_example02/node/`

`peer chaincode upgrade -n ssorry_cc_node -v 1.1 -c '{"Args":["init", "a", "100","b","0"]}' -C mychannel`

`peer chaincode invoke -C mychannel -n ssorry_cc_node -c '{"Args":["send","a","b","10"]}'`

`peer chaincode query -C mychannel -n ssorry_cc_node -c '{"Args":["query","a"]}'`

### ✔️Web과 연동하기

- `/Myweb` 에서 basic_articles 라는 디렉토리를 생성 후 `connection.json` 파일을 만들어 준다.

```json
{
    "name": "basic-network",
    "version": "1.0.0",
    "client": {
        "organization": "Org1",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300"
                },
                "orderer": "300"
            }
        }
    },
    "channels": {
        "mychannel": {
            "orderers": [
                "orderer.example.com"
            ],
            "peers": {
                "peer0.org1.example.com": {}
            }
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.org1.example.com"
            ],
            "certificateAuthorities": [
                "ca.example.com"
            ]
        }
    },
    "orderers": {
        "orderer.example.com": {
            "url": "grpc://localhost:7050"
        }
    },
    "peers": {
        "peer0.org1.example.com": {
            "url": "grpc://localhost:7051"
        }
    },
    "certificateAuthorities": {
        "ca.example.com": {
            "url": "http://localhost:7054",
            "caName": "ca.example.com"
        }
    }
}
```

- Myweb/routes/basic_network_router.js 수정

```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');

/* GET */
router.get('/', async(req, res, next) => {
    const ccpPath = path.resolve(__dirname, '..' , 'basic_articles', 'connection.json');
   //ccp란 common connection profile의 약자
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    // 인증기관과 통신할 수 있는 객체 생성
    const caURL = ccp.certificateAuthorities['ca.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // 신원 증명서를 저장할 지갑 생성
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);    

    // admin신원 증명서가 있는지 확인
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
       // Enroll the admin user, and import the new identity into the wallet.
       const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
       const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
       wallet.import('admin', identity);
       console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    }   
    res.json({"msg":"ok"});
  });
  
module.exports = router;
```

- `npm start` 를 해서 웹 서버를 올린 후 접속한다.

![image](https://user-images.githubusercontent.com/43080040/66101240-0c6b2580-e5e9-11e9-9fbd-0f7f695254cf.png)

- Wallet부분이 **연결 버튼**을 누르면 생성이 되는 걸 볼 수 있다.

![image](https://user-images.githubusercontent.com/43080040/66101257-1d1b9b80-e5e9-11e9-84f2-676a344ee5a3.png)

### ✔️User1 추가하기

- User1을 등록하기 위해 basic_network_router.js 수정

```javascript
/*
const express = require('express');const router = express.Router();const fs = require('fs');
const path = require('path');const FabricCAServices = require('fabric-ca-client');
*/
// Gateway 추가
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');

/* GET */
/*
router.get('/', async(req, res, next) => {
    if (!adminExists) {
    }   
*/

// 지갑에 user1에 대한 신원 증명서가 있는지 확인
const userExists = await wallet.exists('user1');
if (!userExists) {
  // 피어 노드로 연결하기 위한 Gateway 객체 생성.
  const gateway = new Gateway();
  await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

  // Gateway를 통해 인증기관 객체를 생성
  const ca = gateway.getClient().getCertificateAuthority();
  const adminIdentity = gateway.getCurrentIdentity();

  // user1의 신원 증명
  const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
  const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
  const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
  wallet.import('user1', userIdentity);
  console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');
}
res.json({"msg":"ok"});
});
```

- 수정한 후 연결 버튼을 누르면 User1에 대한 wallet이 생성된다.

![image](https://user-images.githubusercontent.com/43080040/66101398-afbc3a80-e5e9-11e9-8ad3-3bfa7633dd26.png)

- index.jsx 를 수정한다.

```react
const {Component}=React;
const {Router,Route,IndexRoute,Link}=ReactRouter;

class Main extends Component{
  render(){
    return(
      <div>
        <h1>Hyperledger Fabric Study</h1>
        <ul className="header">
          <li><Link exact to="/">Home</Link></li>
          <li><Link to="/basic">BasicNetwork</Link></li>
          <li><Link to="/first">FirstNetwork</Link></li>
        </ul>
        <div  className="content"  >
          {this.props.children}
        </div>
      </div>
    );
  }
}

class Home extends Component{
  render(){
    return(
      <div>
        <h2>Home</h2>
      </div>
    );
  }
}

class BasicNetwork extends Component{
  state={
    amount:0
  }

basic_network_connect=()=>{
  axios.get('basic_network/connect')
    .then((res)=>{
    console.log(res);
  })
    .catch((error)=>{
    console.log(error);
  });
}

query=()=>{        
  axios.get('/basic_network/query')
    .then((response)=>{
    console.log(response.data.msg);
    this.setState({amount:response.data.msg});
  })
    .catch((error)=>{
    console.log(error);
  });
}

send=()=>{
  alert(this.amount.value);
  axios.post('/basic_network/send',{"amount":this.amount.value})
    .then((response)=>{
    console.log(response);

  })
    .catch((error)=>{
    console.log(error);
  });
}

render(){
  return(
    <div>
      <h2>BasicNetwork
        에 <button onClick={this.basic_network_connect}>연결</button></h2>
      <br/>
      <button onClick={this.query}  > a의 잔액 확인</button> {' '} {this.state.amount}원
      <br/>               
      <br/> 
      <div>a가 b에게 {' '}
        <input placeholder='송금량' ref={ref=>this.amount=ref} />원을 {' '} 
        <button onClick={this.send}  > 보내기</button><br/>               
      </div>

    </div>
  );
}
}

class FirstNetwork extends Component{
  render(){
    return(
      <div>
        <h2>FirstNetwork</h2>
      </div>
    );
  }
}

ReactDOM.render(
  (<Router>
      <Route path="/" component={Main} >
        <IndexRoute component={Home} />
        <Route path="basic" component={BasicNetwork} />
        <Route path="first" component={FirstNetwork} />
      </Route>
    </Router>)
  , document.getElementById("root")
);

```

- Basic_network_router.js 수정

```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
//추가
const ccpPath = path.resolve(__dirname, '..' , 'basic_articles', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Create a new CA client for interacting with the CA.
const caURL = ccp.certificateAuthorities['ca.example.com'].url;
const ca = new FabricCAServices(caURL);

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

/* GET */
router.get('/connect', async(req, res, next) => {
  try{
    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
      const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
      wallet.import('admin', identity);
      console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    }   

    // 지갑에 user1에 대한 신원 증명서가 있는지 확인
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      // 피어 노드로 연결하기 위한 Gateway 객체 생성.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

      // Gateway를 통해 인증기관 객체를 생성
      const ca = gateway.getClient().getCertificateAuthority();
      const adminIdentity = gateway.getCurrentIdentity();

      // user1의 신원 증명
      const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
      const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
      const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
      wallet.import('user1', userIdentity);
      console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');

    }

    res.json({"msg":"ok"});
  }catch(e){
    console.log(e);
    res.json({"msg":"connect error"});
  }
});
/* GET */
router.get('/query', async (req, res, next) => {
  try{
    console.log("query a...");
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      await res.json({'msg':'연결부터 해주세요'});
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('ssorry_cc_node_1');

    const result = await contract.evaluateTransaction('query','a');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    res.json({'msg':result.toString()});
  }catch(e){
    console.log(e);
    res.json({'msg':'query error'});
  }
}
          );

/* POST */
router.post('/send', async (req, res, next) => {
  try{
    console.log("send from a to b : ", req.body.amount);
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      await res.json({'msg':'연결부터 해주세요'});
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('ssorry_cc_node_1');

    await contract.submitTransaction('send','a','b',`${req.body.amount}`);
    console.log(`Transaction has been submitted`);
    res.json({'msg':'ok'});
  }catch(e){
    console.log(e);
    res.json({'msg':'send error'});
  }
}
           );
module.exports = router;
```

![image](https://user-images.githubusercontent.com/43080040/66103680-80a9c700-e5f1-11e9-9eca-4bb97687c738.png)

***✔️결과화면***

![image](https://user-images.githubusercontent.com/43080040/66103717-93240080-e5f1-11e9-9805-5b5a456ba24d.png)


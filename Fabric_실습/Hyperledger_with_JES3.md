# Hyperledger Fabric with JES

## 1️⃣BasicNetwork+chaincode_Ex2+Myweb+MyMarbles 

### ✔️잔액이 a와 b가 보이게 UI바꾸기

- index.jsx 수정

```react
/************************** index.jsx **************************/
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


        <div>
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
    a_amount:0,
    b_amount:0
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
    this.setState({a_amount:response.data.a_amount, b_amount:response.data.b_amount});
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
      <button onClick={this.query}  > 잔액 확인</button> {' '} a : {this.state.a_amount}원 {'    '} b : {this.state.b_amount}원
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

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

      // Get the CA client object from the gateway for interacting with the CA.
      const ca = gateway.getClient().getCertificateAuthority();
      const adminIdentity = gateway.getCurrentIdentity();

      // Register the user, enroll the user, and import the new identity into the wallet.
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
    const contract = network.getContract('jes_cc_node');

    const a_result = await contract.evaluateTransaction('query','a');
    const b_result = await contract.evaluateTransaction('query','b');
    console.log(`Transaction has been evaluated, result is: ${a_result.toString()} , ${b_result.toString()}`);
    res.json({'a_amount':a_result.toString(),'b_amount':b_result.toString()});
  }catch(e){
    console.log(e);
    res.json({'msg':'query error'});
  }
}
          );

/* POST */
router.post('/send', async (req, res, next) => {
  try{
    console.log("invoke from a to b : ", req.body.amount);
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
    const contract = network.getContract('jes_cc_node');

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

**✓결과 화면**

![image](https://user-images.githubusercontent.com/43080040/66128140-2d9f3680-e628-11e9-98ba-1bd85a6cb9d9.png)

![image](https://user-images.githubusercontent.com/43080040/66128369-ae5e3280-e628-11e9-83a3-d76f167fbc9d.png)

- 새로운 CSS 적용하기 위해 index.jsx 수정

```jsx
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


        <div>
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
    a_amount:0,
    b_amount:0
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
    this.setState({a_amount:response.data.a_amount, b_amount:response.data.b_amount});
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
      <button onClick={this.query}  > 잔액 확인</button> {' '} a : {this.state.a_amount}원 {'    '} b : {this.state.b_amount}원
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

![image](https://user-images.githubusercontent.com/43080040/66128535-faa97280-e628-11e9-81a4-a28e70be5595.png)



## 2️⃣basic network + marbles_chaincode + Marbles UI

👉🏻`HLF/fabric-samples> git clone https://github.com/IBM-Blockchain/marbles.git --depth 1`

Marbles 예제를 다운받는다.

👉🏻`cd marbles` 

👉🏻`npm i` 명령어로 node.js Web Application을 위한 모듈을 다운받는다.

👉🏻`marbles/config/connection_profile_local.json` 파일을 수정한다.

```json
{
  "name": "Docker Compose Network",
  "x-networkId": "not-important",
  "x-type": "hlfv1",
  "description": "Connection Profile for an Hyperledger Fabric network on a local machine",
  "version": "1.0.0",
  "client": {
    "organization": "Org1MSP",
    "credentialStore": {
      "path": "/$HOME/HLF/hfc-key-store"
    }
  },
  "channels": {
    "mychannel": {
      "orderers": [
        "fabric-orderer"
      ],
      "peers": {
        "fabric-peer-org1": {
          "x-chaincode": {}
        }
      },
      "chaincodes": [
        "marbles:v4"
      ],
      "x-blockDelay": 10000
    }
  },
  "organizations": {
    "Org1MSP": {
      "mspid": "Org1MSP",
      "peers": [
        "fabric-peer-org1"
      ],
      "certificateAuthorities": [
        "fabric-ca"
      ],
      "x-adminCert": {
        "path": "/$HOME/HLF/fabric-samples/basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/admincerts/Admin@org1.example.com-cert.pem"
      },
      "x-adminKeyStore": {
        "path": "/$HOME/HLF/fabric-samples/basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/"
      }
    }
  },
  "orderers": {
    "fabric-orderer": {
      "url": "grpc://localhost:7050"
    }
  },
  "peers": {
    "fabric-peer-org1": {
      "url": "grpc://localhost:7051",
      "eventUrl": "grpc://localhost:7053"
    }
  },
  "certificateAuthorities": {
    "fabric-ca": {
      "url": "http://localhost:7054",
      "httpOptions": {
        "verify": true
      },
      "registrar": [
        {
          "enrollId": "admin",
          "enrollSecret": "adminpw"
        }
      ],
      "caName": null
    }
  }
}
```

👉🏻`HLF > mkdir hfc-key-store`

**✔️체인코드 설치 및 채널 연결**

​	👉🏻`HLF/fabric-samples/marbles/scripts> node install_chaincode.js`

​	👉🏻`HLF/fabric-samples/marbles/scripts> node instantiate_chaincode.js`

**✔️glup 설치 및 실행**

​	👉🏻`HLF/fabric-samples/marbles> sudo npm i gulp -g`

​	👉🏻`HLF/fabric-samples/marbles> gulp marbles_local`

포트번호 3001 으로 들어가면 marbles 실행됨


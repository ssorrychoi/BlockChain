## FirstNetwork + Fabcar(go)

### startFabric.sh

```sh
# !/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"go"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`
if [ "$CC_SRC_LANGUAGE" = "go" -o "$CC_SRC_LANGUAGE" = "golang"  ]; then
	CC_RUNTIME_LANGUAGE=golang
	CC_SRC_PATH=github.com/chaincode/fabcar/go
elif [ "$CC_SRC_LANGUAGE" = "java" ]; then
	CC_RUNTIME_LANGUAGE=java
	CC_SRC_PATH=/opt/gopath/src/github.com/chaincode/fabcar/java
elif [ "$CC_SRC_LANGUAGE" = "javascript" ]; then
	CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
	CC_SRC_PATH=/opt/gopath/src/github.com/chaincode/fabcar/javascript
elif [ "$CC_SRC_LANGUAGE" = "typescript" ]; then
	CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
	CC_SRC_PATH=/opt/gopath/src/github.com/chaincode/fabcar/typescript
	echo Compiling TypeScript code into JavaScript ...
	pushd ../chaincode/fabcar/typescript
	npm install
	npm run build
	popd
	echo Finished compiling TypeScript code into JavaScript
else
	echo The chaincode language ${CC_SRC_LANGUAGE} is not supported by this script
	echo Supported chaincode languages are: go, javascript, and typescript
	exit 1
fi


# clean the keystore
################################ 수정 ################################
# rm -rf ./hfc-key-store
rm -rf ./javascript/wallet # 저장 장소 바꿈

# launch network; create channel and join peer to channel
cd ../first-network
################################ 수정 ################################
echo y | ./byfn.sh -m down # -m 추가
echo y | ./byfn.sh up -a -n -s couchdb

...
```

👉🏻수정 후 `./startFabric.sh` 명령어 실행

👉🏻`cd javascript`

👉🏻`npm i`

👉🏻`node enrollAdmin.js`

👉🏻`node registerUser.js`

![image](https://user-images.githubusercontent.com/43080040/66316894-72daa580-e953-11e9-972e-e78a8471758a.png)

👉🏻`node query.js`

![image](https://user-images.githubusercontent.com/43080040/66316970-a0bfea00-e953-11e9-975d-05cc92567764.png)



## FirstNetwork + ex02_node 체인코드 올리기

- Cli에 접속

  👉🏻`ubuntu > docker exec -it cli bash` 

- 환경변수 설정

  ```
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  CORE_PEER_ADDRESS=peer0.org1.example.com:7051
  CORE_PEER_LOCALMSPID="Org1MSP"
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  ```

- 체인코드 install

  👉🏻`cli > peer chaincode install -n send_money -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/chaincode_example02/node`

- 체인코드 instantiate

  👉🏻`cli > peer chaincode instantiate -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n send_money -l node -v 1.0 -c '{"Args":["init","a", "100", "b","200"]}'  -P "OR ('Org1MSP.member','Org2MSP.member')"`

- query.js 파일을 query_money.js 로 복사 후 코드 수정

  ```javascript
  /*
   * SPDX-License-Identifier: Apache-2.0
   */
  
  'use strict';
  
  const { FileSystemWallet, Gateway } = require('fabric-network');
  const path = require('path');
  
  const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
  
  async function main() {
      try {
  
          // Create a new file system based wallet for managing identities.
          const walletPath = path.join(process.cwd(), 'wallet');
          const wallet = new FileSystemWallet(walletPath);
          console.log(`Wallet path: ${walletPath}`);
  
          // Check to see if we've already enrolled the user.
          const userExists = await wallet.exists('user1');
          if (!userExists) {
              console.log('An identity for the user "user1" does not exist in the wallet');
              console.log('Run the registerUser.js application before retrying');
              return;
          }
  
          // Create a new gateway for connecting to our peer node.
          const gateway = new Gateway();
          await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
  
          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork('mychannel');
  
          // Get the contract from the network.
        	// send_money 체인코드로 수정
          const contract = network.getContract('send_money');
  
          // Evaluate the specified transaction.
          // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
          // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        	// Fabcar를 모두 조회하는 변수에서 a만 조회하는 쿼리로 수정.
          const result = await contract.evaluateTransaction('query','a');
          console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
  
      } catch (error) {
          console.error(`Failed to evaluate transaction: ${error}`);
          process.exit(1);
      }
  }
  
  main();
  ```

- query_money.js 실행

  👉🏻`Ubuntu > node query_money.js`

  ![image](https://user-images.githubusercontent.com/43080040/66317799-285a2880-e955-11e9-9a59-d679b2852baa.png)

- invoke.js 파일을  invoke_money.js로 복사 후 코드 수정

  ```javascript
  /*
   * SPDX-License-Identifier: Apache-2.0
   */
  
  'use strict';
  
  const { FileSystemWallet, Gateway } = require('fabric-network');
  const path = require('path');
  
  const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
  
  async function main() {
      try {
  
          // Create a new file system based wallet for managing identities.
          const walletPath = path.join(process.cwd(), 'wallet');
          const wallet = new FileSystemWallet(walletPath);
          console.log(`Wallet path: ${walletPath}`);
  
          // Check to see if we've already enrolled the user.
          const userExists = await wallet.exists('user1');
          if (!userExists) {
              console.log('An identity for the user "user1" does not exist in the wallet');
              console.log('Run the registerUser.js application before retrying');
              return;
          }
  
          // Create a new gateway for connecting to our peer node.
          const gateway = new Gateway();
          await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
  
          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork('mychannel');
  
          // Get the contract from the network.
        
        	// chaincode를 send_money로 수정
          const contract = network.getContract('send_money');
        
        	// a를 b에 1만큼 보내는 쿼리
          await contract.submitTransaction('invoke', 'a', 'b', '1');
          console.log('Transaction has been submitted');
  
          // Disconnect from the gateway.
          await gateway.disconnect();
  
      } catch (error) {
          console.error(`Failed to submit transaction: ${error}`);
          process.exit(1);
      }
  }
  
  main();
  ```

- Invoke_money.js 수행

  👉🏻`Ubuntu > node invoke_money.js`

  ![image-20191007230030432](/Users/ssorrychoi/Library/Application Support/typora-user-images/image-20191007230030432.png)



## FirstNetwork + ex02_node + Web

- cli 접속

  👉🏻`docker exec -it cli bash`

- 모든 peer에 체인코드 install

  ```
  ## peer0.org1
  => 위에서 했음
  
  ## peer1.org1
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  CORE_PEER_ADDRESS=peer1.org1.example.com:8051
  CORE_PEER_LOCALMSPID="Org1MSP"
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt
  
  peer chaincode install -n send_money -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/chaincode_example02/node
  
  
  ## peer0.org2
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
  CORE_PEER_ADDRESS=peer0.org2.example.com:9051
  CORE_PEER_LOCALMSPID="Org2MSP"
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
  
  peer chaincode install -n send_money -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/chaincode_example02/node
  
  
  ## peer1.org2
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
  CORE_PEER_ADDRESS=peer1.org2.example.com:10051
  CORE_PEER_LOCALMSPID="Org2MSP"
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt
  
  peer chaincode install -n send_money -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/chaincode_example02/node
  ```

- fabric-samples/first-network/ 에서 connection-org1.json을 복사해 Myweb/first-articles/ 아래로 복사한다.

  ![image](https://user-images.githubusercontent.com/43080040/66321287-504c8a80-e95b-11e9-9f8b-44510b8e954f.png)

  ![image](https://user-images.githubusercontent.com/43080040/66321456-8f7adb80-e95b-11e9-9849-538bda58db9b.png)

- fabcar/javascript/ 에서 wallet을 복사해 Myweb으로 복사해 wallet2로 이름을 바꿔준다.

  ![image](https://user-images.githubusercontent.com/43080040/66321572-c05b1080-e95b-11e9-8e8b-3020ab5d0c51.png)

  ![image](https://user-images.githubusercontent.com/43080040/66321915-437c6680-e95c-11e9-8146-fe06e53d26c6.png)

- Routes/first_network_router.js 를 만들고 코드를 수정한다.

  ```javascript
  const express = require('express');
  const router = express.Router();
  const fs = require('fs');
  const path = require('path');
  
  const FabricCAServices = require('fabric-ca-client');
  const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
  
  const ccpPath = path.resolve(__dirname, '..' , 'first_articles', 'connection-org1.json');
  const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
  const ccp = JSON.parse(ccpJSON);
  
  // Create a new CA client for interacting with the CA.
  const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
  
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), 'wallet2');
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);
  
  
  /* GET */
  router.get('/query', async (req, res, next) => {
    try{
      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet2');
      const wallet = new FileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);
  
      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists('user1');
      if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
      }
  
      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
  
      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');
  
      // Get the contract from the network.
      const contract = network.getContract('send_money');
  
      // Evaluate the specified transaction.   
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
      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet2');
      const wallet = new FileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);
  
      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists('user1');
      if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
      }
  
      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
  
      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');
  
      // Get the contract from the network.
      const contract = network.getContract('send_money');
  
      // Submit the specified transaction.     
      await contract.submitTransaction('invoke', 'a', 'b', '1');
      console.log('Transaction has been submitted');
  
      // Disconnect from the gateway.
      await gateway.disconnect();
  
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

- server.js 수정

  ```javascript
  const express=require("express");
  const path=require("path");
  const app=express(); 
  
  app.use(express.static(path.join(__dirname,"/public")));
  
  app.use(express.json());
  const basic_network_router=require('./routes/basic_network_router');
  app.use('/basic_network', basic_network_router);
  
  app.listen(3000,function(){
    console.log("3000 server ready...");
  });
  ```

- index.jsx 수정

  ```react
  var {Component} = React;
  var {Router, Route, IndexRoute, Link} = ReactRouter;
  
  class Main extends Component{
    render(){
      return(            
        <div>
          <h1>Hyperledger Fabric Study</h1>
          <ul className="header" >
            <li><Link exact to="/">Home</Link></li>
            <li><Link to="/basic">BasicNetwork</Link></li>
            <li><Link to="/first">FirstNetwork</Link></li>
          </ul>
          <div className="content">
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
          <h2>HELLO</h2>
          <p>안녕하세요? 하이퍼레저에 접속하는 노드 웹 예제입니다. 잘해보죠~!!!</p>
        </div>
      );
    }
  }
  class BasicNetwork extends Component{
    basic_network=()=>{
      axios.get('/basic_network')
        .then((response)=>{
        console.log(response);
  
      })
        .catch((error)=>{
        console.log(error);
      });
    }
    send=()=>{
      alert(this.amount.value);
      axios.post('/basic_network',{"amount":this.amount.value})
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
          <h2>BasicNetwork</h2>
          <p><button onClick={this.basic_network}>연결</button></p>
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
          <h2>FirstNetwork에 연결 해보세요</h2>                
        </div>
      );
    }
  }
  
  ReactDOM.render(
    (<Router>
        <Route path="/" component={Main} >   
          <Route path="basic" component={BasicNetwork}/>
          <Route path="first" component={FirstNetwork} />
          <IndexRoute component={Home} />
        </Route>
      </Router>)
    ,document.getElementById("root")
  );
  ```

**✔️결과화면**

![image](https://user-images.githubusercontent.com/43080040/66322221-bb4a9100-e95c-11e9-8c7f-9e1772785ead.png)
![image](https://user-images.githubusercontent.com/43080040/66322383-0369b380-e95d-11e9-89a6-4abcbbb4acce.png)
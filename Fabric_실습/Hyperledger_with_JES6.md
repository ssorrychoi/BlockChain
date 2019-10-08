# Smart Health Care System

👉🏻 `git clone https://github.com/javanism/temp.git`

👉🏻 basic network  시스템 구축을 위해 basic-2org.zip 파일을 HLF/fabric-samples 밑에 압축을 푼다.

👉🏻 `basic-2org > ./start.sh`

- *Basic-network* > start.sh

```sh
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

# ca, orderer, peer0.org1, couchdb 4개의 컨테이너를 띄운다.
docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.org1.example.com couchdb
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx
# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b mychannel.block
```

- **Basic-2org** > start.sh

```sh
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

# ca, orderer, peer0.org1, couchdb, cli, peer0.org2, cli2 7개의 컨테이너를 띄운다.
docker-compose -f docker-compose.yml up -d orderer.example.com ca.example.com  peer0.org1.example.com couchdb cli peer0.org2.example.com cli2
docker ps

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec cli peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx 

# Join peer0.org1.example.com to the channel.
docker exec  peer0.org1.example.com peer channel join -b /etc/hyperledger/configtx/mychannel.block

# Join peer0.org2.example.com to the channel.
docker exec  peer0.org2.example.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
```

- Chaincode 설치

  👉🏻 SmartHC_cc.zip 파일을 HLF/fabric-samples/chaincode 에 압축을 푼다.

  ```javascript
  /************************ mr.js ************************/
  'use strict';
  const shim = require('fabric-shim');
  const util = require('util');
  
  let Chaincode = class {
  
    async Init(stub) {
      console.info('=========== Instantiated Medical Report chaincode ===========');
      return shim.success();
    }
  
    async Invoke(stub) {
      let ret = stub.getFunctionAndParameters();
      console.info(ret);
  
      let method = this[ret.fcn];
      if (!method) {
        console.error('no function of name:' + ret.fcn + ' found');
        throw new Error('Received unknown function ' + ret.fcn + ' invocation');
      }
      try {
        let payload = await method(stub, ret.params);
        return shim.success(payload);
      } catch (err) {
        console.log(err);
        return shim.error(err);
      }
    }
  
    async testLedger(stub) {
      console.info('============= START : test insert Ledger ===========');
      const mr = 
            {	      
              pname:'jennifer',
              ssn: '801010_1010101',
              addr: 'seoul',
              email:'a@b.com',
              visitDate: '2019-09-29',
              desease:'heart',
              deseaseCode :'001',
              content :'heart rate irregular',
              docterName : 'Lee',
              docterNumber: 'd001'               
            };
      
      await stub.putState('p001', Buffer.from(JSON.stringify(mr)));
      console.info('Added <--> ', mr);
  
      console.info('============= END : test insert Ledger ===========');
    }
  
    async queryReport(stub, args) {
      if (args.length != 1) {
        throw new Error('Incorrect number of arguments. Expecting ssn ex: p001');
      }
      let key = args[0];
  
      let dataAsBytes = await stub.getState(key); //get the mr from chaincode state
      if (!dataAsBytes || dataAsBytes.toString().length <= 0) {
        throw new Error(dataAsBytes + ' does not exist: ');
      }
      console.log(dataAsBytes.toString());
      return dataAsBytes;
    }
  
    async createMedicalReport(stub, args) {
      console.info('============= START : createMedicalReport ===========');
      if (args.length != 11) {
        throw new Error('Incorrect number of arguments. Expecting 11');
      }
      var mr = {      
        pname: args[1],
        ssn: args[2],
        addr: args[3],
        email: args[4],
        visitDate: args[5],
        desease: args[6],
        deseaseCode : args[7],
        content : args[8],
        docterName: args[9],
        docterNumber: args[10]
      };
  
      await stub.putState(args[0], Buffer.from(JSON.stringify(mr)));
      console.info('============= END : createMedicalReport ===========');
    }
    async getHistoryForNo(stub, args) {
  
      if (args.length < 1) {
        throw new Error('Incorrect number of arguments. Expecting 1, ex) p001')
      }
      let key = args[0];
      console.info('- start getHistoryForNo: %s\n', key);
  
      let iterator = await stub.getHistoryForKey(key);
  
      let allResults = [];
      let isHistory=true;
      while (isHistory) {
        let res = await iterator.next();
  
        if (res.value && res.value.value.toString()) {
          let jsonRes = {};
          console.log(res.value.value.toString('utf8'));
  
          if (isHistory && isHistory === true) {
            jsonRes.TxId = res.value.tx_id;
            jsonRes.Timestamp = res.value.timestamp;
            jsonRes.IsDelete = res.value.is_delete.toString();
            try {
              jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
              console.log(err);
              jsonRes.Value = res.value.value.toString('utf8');
            }
          } else {
            jsonRes.Key = res.value.key;
            try {
              jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
              console.log(err);
              jsonRes.Record = res.value.value.toString('utf8');
            }
          }
          allResults.push(jsonRes);
        }
        if (res.done) {
          console.log('end of data');
          await iterator.close();
          console.info(allResults); 
          isHistory=false;      
        }
      }//end while 
  
      return Buffer.from(JSON.stringify(allResults));
    }
  }
  shim.start(new Chaincode());
  ```

  - cli에 접속

    👉🏻`Ubuntu > docker exec -it cli bash`

  - chaincode 설치

    👉🏻`cli > peer chaincode install -n medicalreport -v 1.0 -l node -p /opt/gopath/src/github.com/SmartHC_cc/`

  - chaincode Instantiate 

    👉🏻`cli > peer chaincode instantiate -n medicalreport -v 1.0 -l node -C mychannel -c '{"Args":[]}'`

  - 설치된 체인코드 확인

    👉🏻`cli > peer chaincode list --installed`

    ![image](https://user-images.githubusercontent.com/43080040/66414192-e227c680-ea33-11e9-9031-c21652c1cec4.png)

  - Instantiate 된 체인코드 리스트 확인

    👉🏻`cli > peer chaincode list -C mychannel --instantiated`

    ![image](https://user-images.githubusercontent.com/43080040/66414375-46e32100-ea34-11e9-9fa6-7f37e431af52.png)

  - Ledger 확인

    👉🏻`cli > peer chaincode invoke -C mychannel -n medicalreport -c '{"Args":["testLedger"]}'`

    ![image](https://user-images.githubusercontent.com/43080040/66414578-aa6d4e80-ea34-11e9-9e08-bc49722009e0.png)

  - "p001" key값의 value 값 확인

    👉🏻`cli > peer chaincode query -C mychannel -n medicalreport -c '{"Args":["queryReport","p001"]}'`

    ![image](https://user-images.githubusercontent.com/43080040/66414784-09cb5e80-ea35-11e9-89d2-1c2ec7aeb47d.png)

👉🏻SmartHC > package.json에 다음 내용 추가

```
    "fabric-ca-client": "~1.4.0",
    "fabric-client": "~1.4.0",
    "fabric-network": "^1.4.4",
```

👉🏻기존에 있던 wallet을 지우고 새로 실행하여 wallet을 만든다.

👉🏻`node enrollAdmin.js`

👉🏻`node registerUser.js`

![image](https://user-images.githubusercontent.com/43080040/66415191-01275800-ea36-11e9-80b1-f49d008759f1.png)

👉🏻`npm start`

- MongoDB 띄우기

  👉🏻`docker run --name mongo -p 27012:27012 -d mongo`

  👉🏻 `docker exec -it mongo bash`

  👉🏻 `mongo`

  👉🏻 `show dbs`

  👉🏻` use SmartHC`

  👉🏻 `show collections`

  👉🏻 `db.contactForm.find()`

  ![image](https://user-images.githubusercontent.com/43080040/66418402-fde39a80-ea3c-11e9-954e-c018b5035a2d.png)

![image](https://user-images.githubusercontent.com/43080040/66418582-5adf5080-ea3d-11e9-962a-f2c1e96972bc.png)

![image](https://user-images.githubusercontent.com/43080040/66418594-629ef500-ea3d-11e9-9869-51f58a93269e.png)
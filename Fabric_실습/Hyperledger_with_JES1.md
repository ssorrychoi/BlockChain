# Hyperledger Fabric with JES

**개발 순서**

- Network Topology
- Sub Networking
- Service setup

## 실습

### Basic Network + sacc(Simple Asset Chain Code)

- `~/0ejs/MyWeb_0_template`  폴더를 복사하여 ~/0ejs/Myweb` 폴더로 복사

- VScode를 켜서 Myweb에 들어간 후 `npm start` 를 하면 웹 페이지가 나온다.

- 서버를 내린 후 package.json 파일에서 dependencies에 밑에 3개를 추가한다.

  ```
  "fabric-ca-client": "~1.4.0",
  "fabric-client": "~1.4.0",
  "fabric-network": "^1.4.4",
  ```

  => HLF Node SDK 를 추가한 것이다.

- `npm i` 명령어로 설치

👉🏻`~/HLF/fabric-samples/basic-network` 에서 `./start.sh` 실행

```sh
###############################  start.sh  ###############################
set -ev

export MSYS_NO_PATHCONV=1

# Docker-compose.yml을 down 시킨다.
docker-compose -f docker-compose.yml down

#  Docker-compose.yml 파일을 up 시키고 CA, Orderer, Peer, CouchDB를 띄운다.
docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.org1.example.com couchdb
docker ps -a

export FABRIC_START_TIMEOUT=10

sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx
# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b mychannel.block
```

👉🏻`docker ps`

![image](https://user-images.githubusercontent.com/43080040/66062647-c4aeb480-e57c-11e9-984e-9f421aeb7d36.png)

*fabric-peer , fabric-ca, fabric-orderer, fabric-couchdb*  4가지의 컨테이너가 실행되고 있다.

```sh
###############################  docker-compose.yml  ###############################
version: '2'

networks:
  basic:

services:
  ca.example.com:
  ############################### fabric-ca ###############################
    image: hyperledger/fabric-ca
    environment:
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca.example.com
      - FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem
      - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/4239aa0dcd76daeeb8ba0cda701851d14504d31aad1b2ddddbac6a57365e497c_sk
    ports:
      - "7054:7054"
    command: sh -c 'fabric-ca-server start -b admin:adminpw'
    volumes:
      - ./crypto-config/peerOrganizations/org1.example.com/ca/:/etc/hyperledger/fabric-ca-server-config
    container_name: ca.example.com
    networks:
      - basic

  orderer.example.com:
    container_name: orderer.example.com
    ############################### fabric-orderer ###############################
    image: hyperledger/fabric-orderer
    environment:
      - FABRIC_LOGGING_SPEC=info
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_GENESISMETHOD=file
      - ORDERER_GENERAL_GENESISFILE=/etc/hyperledger/configtx/genesis.block
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/etc/hyperledger/msp/orderer/msp
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/orderer
    command: orderer
    ports:
      - 7050:7050
    volumes:
        - ./config/:/etc/hyperledger/configtx
        - ./crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/:/etc/hyperledger/msp/orderer
        - ./crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/:/etc/hyperledger/msp/peerOrg1
    networks:
      - basic

  peer0.org1.example.com:
    container_name: peer0.org1.example.com
    ############################### fabric-peer ###############################
    image: hyperledger/fabric-peer
    environment:
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_PEER_ID=peer0.org1.example.com
      - FABRIC_LOGGING_SPEC=info
      - CORE_CHAINCODE_LOGGING_LEVEL=info
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/peer/
      - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=${COMPOSE_PROJECT_NAME}_basic
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb:5984
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric
    command: peer node start
    ports:
      - 7051:7051
      - 7053:7053
    volumes:
        - /var/run/:/host/var/run/
        - ./crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp:/etc/hyperledger/msp/peer
        - ./crypto-config/peerOrganizations/org1.example.com/users:/etc/hyperledger/msp/users
        - ./config:/etc/hyperledger/configtx
    depends_on:
      - orderer.example.com
      - couchdb
    networks:
      - basic

  couchdb:
    container_name: couchdb
    ############################### fabric-couchdb ###############################
    image: hyperledger/fabric-couchdb
    # Populate the COUCHDB_USER and COUCHDB_PASSWORD to set an admin user and password
    # for CouchDB.  This will prevent CouchDB from operating in an "Admin Party" mode.
    environment:
      - COUCHDB_USER=
      - COUCHDB_PASSWORD=
    ports:
      - 5984:5984
    networks:
      - basic

  cli:
    container_name: cli
    ############################### fabric-tools ###############################
    image: hyperledger/fabric-tools
    tty: true
    environment:
      - GOPATH=/opt/gopath
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - FABRIC_LOGGING_SPEC=info
      - CORE_PEER_ID=cli
      - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
      - CORE_CHAINCODE_KEEPALIVE=10
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
    command: /bin/bash
    volumes:
        - /var/run/:/host/var/run/
        - ./../chaincode/:/opt/gopath/src/github.com/
        - ./crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/
    networks:
        - basic
    #depends_on:
    #  - orderer.example.com
    #  - peer0.org1.example.com
    #  - couchdb
```

docker-compose.yml 파일에는 cli의 정보까지 들어있는데 start.sh 에서는 cli 컨테이너를 실행하지 않았다.

따라서 start.sh파일을 수정한다.

```sh
############################### start.sh ###############################
...

#  Docker-compose.yml 파일을 up 시키고 CA, Orderer, Peer, CouchDB를 띄운다.
docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.org1.example.com couchdb cli
# cli를 마지막에 추가해준다.
docker ps -a

...
```

👉🏻`./start.sh`

![image](https://user-images.githubusercontent.com/43080040/66063425-49e69900-e57e-11e9-8401-a015c90dac37.png)

Cli 컨테이너도 실행되고 있는 것을 볼 수 있다.

### chaincode 추가

Docker-compose.yml의 마지막줄 쯤에 보면 `/fabric-samples/chaincode/ `디렉토리와 컨테이너의 `/opt/gopath/src/github.com/` 디렉토리가 볼륨이 되어있다. == 동기화 되어있다.

    volumes:
        - /var/run/:/host/var/run/
        - ./../chaincode/:/opt/gopath/src/github.com/
        - ./crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/
#### Cli

👉🏻`docker exec -it cli bash` cli  // 컨테이너로 접속한다.

👉🏻`cli> peer chaincode install -n ssorry -v 1.0 -p github.com/sacc` // ssorry라는 이름으로 sacc를 설치

 	-> 설치만 한 것으로, 어떤 채널에도 연결 되어있지 않다. 

![image](https://user-images.githubusercontent.com/43080040/66064712-e742cc80-e580-11e9-9c32-952af06d51dc.png)

👉🏻`cli> peer chaincode instantiate -n ssorry -v 1.0 -c '{"Args":["a","10"]}' -C mychannel ` 

 	-> instantiate 하는 명령어가 채널에 연결하는 것이다! ssorry라는 체인코드가 mychannel 채널에 연결됨!

![image](https://user-images.githubusercontent.com/43080040/66064775-06d9f500-e581-11e9-987d-5ef1aaf62375.png)

👉🏻 또 다른 terminal을 띄우고 Peer에 접속한다. 

#### Peer

👉🏻`docker exec -it peer0.org1.example.com bash`

👉🏻`peer0> cd /var/hyperledger/production/chaincodes/ ` 로 이동해보면 ssorry.1.0 이라는 ***체인코드***가 설치 되어있는 것을 확인할 수 있다.

![image](https://user-images.githubusercontent.com/43080040/66065356-27ef1580-e582-11e9-8ec9-211ac5f18fc6.png)

👉🏻`peer0> cd /var/hyperledger/production/ledgerData/chains/chains/mychannel/` 에는 블록파일이 생긴다.

![image](https://user-images.githubusercontent.com/43080040/66065429-52d96980-e582-11e9-859d-1c56fbfc145e.png)



#### CLI

```go
/**************************** sacc.go ****************************/
package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// SimpleAsset implements a simple chaincode to manage an asset
type SimpleAsset struct {
}

// Init 함수
func (t *SimpleAsset) Init(stub shim.ChaincodeStubInterface) peer.Response {
	// Get the args from the transaction proposal
	args := stub.GetStringArgs()
	if len(args) != 2 {
		return shim.Error("Incorrect arguments. Expecting a key and a value")
	}

	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to create asset: %s", args[0]))
	}
	return shim.Success(nil)
}

// Invoke 함수
func (t *SimpleAsset) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	// Extract the function and args from the transaction proposal
	fn, args := stub.GetFunctionAndParameters()

	var result string
	var err error
	if fn == "set" {
		result, err = set(stub, args)
	} else { // assume 'get' even if fn is nil
		result, err = get(stub, args)
	}
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return the result as success payload
	return shim.Success([]byte(result))
}

// set 함수
func set(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 2 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}

	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return "", fmt.Errorf("Failed to set asset: %s", args[0])
	}
	return args[1], nil
}

// Get 함수
func get(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key")
	}

	value, err := stub.GetState(args[0])
	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)
	}
	if value == nil {
		return "", fmt.Errorf("Asset not found: %s", args[0])
	}
	return string(value), nil
}

// main function starts up the chaincode in the container during instantiate
func main() {
	if err := shim.Start(new(SimpleAsset)); err != nil {
		fmt.Printf("Error starting SimpleAsset chaincode: %s", err)
	}
}
```

👉🏻`cli> peer chaincode query -n ssorry -c '{"Args":["get","a"]}' -C mychannel`

Cli 컨테이너에서 위 명령어를 입력하면 10을 반환한다.

![image](https://user-images.githubusercontent.com/43080040/66067222-1c9de900-e586-11e9-93b3-2d844ae206a6.png)

블록의 크기는 21318 이다.

👉🏻`cli>peer chaincode invoke -n jes -c '{"Args":["set","a","20"]}' -C mychannel`

a의 값을 20으로 변경하는 트랜잭션이다.

![image](https://user-images.githubusercontent.com/43080040/66067335-5242d200-e586-11e9-92bd-18b1cba047c3.png)

블록의 크기가 증가했다. => 블록에 트랜잭션의 로그가 저장되었다는 의미다.

👉🏻`cli>peer chaincode query -n jes -c '{"Args":["get","a"]}' -C mychannel`

a의 값이 20으로 변경된 값을 반환한다.

![image](https://user-images.githubusercontent.com/43080040/66067531-bd8ca400-e586-11e9-942e-b647d2d8c4df.png)

👉🏻localhost:5984/_utils 로 접속하게 되면 CouchDB를 UI로 볼 수 있게 제공한다.

![image](https://user-images.githubusercontent.com/43080040/66067781-44418100-e587-11e9-8ee0-94d69e11f9e6.png)


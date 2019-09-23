## Multihosting

- `docker swarm leave --force`

- `docker network ls`

- `docker network rm ______`

  ![image](https://user-images.githubusercontent.com/43080040/65396917-83810c80-dde6-11e9-9cb1-4191bcf5c44b.png)

- docker network 3개만 남기기  // 2개 Ubuntu 다

- PC1에서 `docker swarm init –advertise-addr 192.168.56.102` // PC1의 ip주소값입력

  - `docker swarm join-token manager`

  ![image](https://user-images.githubusercontent.com/43080040/65397137-7bc26780-dde8-11e9-9967-ce8591882e6a.png)

- 맨 밑에 본인PC의 Network token 값이 나온다.

- 네트워크가 enp0s17 & enp0s8 두개가 켜져야 하는데 하나만 켜지는 현상이 발생.

- 네트워크 설정에 들어가서 

  ![image](https://user-images.githubusercontent.com/43080040/65397293-e0ca8d00-dde9-11e9-9ff8-4eb8b769ea71.png)

- MAC Address를 선택해준다 (원래는 선택이 안되어있음)

  ![image](https://user-images.githubusercontent.com/43080040/65397290-d14b4400-dde9-11e9-94e5-f6f2fa3f9ff1.png)

  네트워크가 두개 다 연결된 것을 확인할 수 있다.

- Swarm 조인하기

  ![image](https://user-images.githubusercontent.com/43080040/65397352-4f0f4f80-ddea-11e9-8534-71afee540a64.png)

- Network 생성 (PC1) : `docker network create --attachable --driver overlay fabric`

  ![image](https://user-images.githubusercontent.com/43080040/65397608-7830df80-ddec-11e9-8d4a-7c2db8b24db7.png)

- `docker node ls`

  ![image](https://user-images.githubusercontent.com/43080040/65398419-183d3780-ddf2-11e9-9056-e7a82ae7c687.png)

  \* (별) 모양 있는것이 매니저, 없는 것이 worker 이다.

- `sudo ufw disable`  // 방화벽 내리기 명령어 실행 (2개의 Ubuntu에서)

- `docker network create --attachable --driver overlay my-net`

  ![image](https://user-images.githubusercontent.com/43080040/65398844-73702980-ddf4-11e9-9ad1-525fd49b727b.png)

- `cd /fabric-samples/first-network/`

- `~/fabric-samples/first-network$ ./byfn.sh generate`

- Generate 해서 생긴 인증서들을 PC2에 복사하기

  - PC2에서 우선 `mkdir channel-artifacts` 디렉토리를 생성한다.
  - PC1에서 `scp -r channel-artifacts/ bcadmin@hlf03:/home/bcadmin/fabric-samples/first-network/`

  ![image](https://user-images.githubusercontent.com/43080040/65399060-9e0eb200-ddf5-11e9-862e-90dbdfce737e.png)

- PC2에서 복사된것 확인

  ![image](https://user-images.githubusercontent.com/43080040/65399150-09f11a80-ddf6-11e9-8217-fa821832186f.png)

- 같은 방식으로 crypto-config 디렏토리도 복사해준다.

- `scp -r crypto-config/ bcadmin@hlf03:/home/bcadmin/fabric-samples/first-network/`

- ORG1의 CA값

  ```
  5c89a029d245045fb0daca8deede9f8236b3923145bd4974793fed463ce4ba18_sk
  ```

- ORG2의 CA값

  ```
  b7d8fdf204217189512c242bdaa33ad3b248709cc5aaecb57f11765ccfa15ecf_sk
  ```

- 2개의 PC에서  `$chmod 750 5c89a029d245045fb0daca8deede9f8236b3923145bd4974793fed463ce4ba18_sk ` 명령어로 key file의 권한을 상승 시켜줌

### PC1에서 컨테이너 띄우기

- **CA Server 띄우기** (org1) // 다 1줄로 만들어서 띄워야함

  ```
  $ docker run --rm -it --network="my-net" --name ca.example.com -p 7054:7054
  -e FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
  -e FABRIC_CA_SERVER_CA_NAME=ca.example.com
  -e FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem -e FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/5c89a029d245045fb0daca8deede9f8236b3923145bd4974793fed463ce4ba18_sk
  -v $(pwd)/crypto-config/peerOrganizations/org1.example.com/ca/:/etc/hyperledger/fabric-ca-server-config -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=hyp-net hyperledger/fabric-ca
  sh -c 'fabric-ca-server start -b admin:adminpw -d'
  ```

- **Orderer** 컨테이너 띄우기

  ```
  docker run --rm -it --network="my-net" --name orderer.example.com -p 7050:7050
  -e ORDERER_GENERAL_LOGLEVEL=debug -e ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
  -e ORDERER_GENERAL_LISTENPORT=7050 -e ORDERER_GENERAL_GENESISMETHOD=file
  -e ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block
  -e ORDERER_GENERAL_LOCALMSPID=OrdererMSP
  -e ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
  -e ORDERER_GENERAL_TLS_ENABLED=false
  -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net
  -v $(pwd)/channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
  -v $(pwd)/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp:/var/hyperledger/orderer/msp -w /opt/gopath/src/github.com/hyperledger/fabric hyperledger/fabric-orderer orderer
  ```

- ❌만약에 `docker ps -a` 명령 후 같은 이름으로 떠있다는 에러가 난 경우 `docker rm _____` 으로 지워 준 후 실행

- **CouchDB0** - for peer0

  ```
  docker run --rm -it --network="my-net" --name couchdb0 -p 5984:5984
  -e COUCHDB_USER=
  -e COUCHDB_PASSWORD=
  -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net hyperledger/fabric-couchdb
  ```

- **Peer0** 

  ```
  $ docker run --rm -it --link orderer.example.com:orderer.example.com --network="my-net" --name peer0.org1.example.com -p 8051:7051 -p 8053:7053
  -e CORE_LEDGER_STATE_STATEDATABASE=CouchDB
  -e CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb0:5984 -e CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=
  -e CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=
  -e CORE_PEER_ADDRESSAUTODETECT=true -e CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock -e CORE_LOGGING_LEVEL=DEBUG -e CORE_PEER_NETWORKID=peer0.org1.example.com
  -e CORE_NEXT=true -e CORE_PEER_ENDORSER_ENABLED=true
  -e CORE_PEER_ID=peer0.org1.example.com -e CORE_PEER_PROFILE_ENABLED=true
  -e CORE_PEER_COMMITTER_LEDGER_ORDERER=orderer.example.com:7050
  -e CORE_PEER_GOSSIP_IGNORESECURITY=true
  -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net
  -e CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org1.example.com:7051
  -e CORE_PEER_TLS_ENABLED=false -e CORE_PEER_GOSSIP_USELEADERELECTION=false
  -e CORE_PEER_GOSSIP_ORGLEADER=true
  -e CORE_PEER_LOCALMSPID=Org1MSP -v /var/run/:/host/var/run/
  -v $(pwd)/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp :/etc/hyperledger/fabric/msp
  -w /opt/gopath/src/github.com/hyperledger/fabric/peer hyperledger/fabric-peer peer node start
  ```

### PC2에서 컨테이너 띄우기

- Peer1

  ```
  docker run --rm -it --link orderer.example.com:orderer.example.com --network="my-net" \
  --link peer0.org1.example.com:peer0.org1.example.com \
  --name peer1.org1.example.com -p 9051:7051 -p 9053:7053 \
  -e CORE_LEDGER_STATE_STATEDATABASE=CouchDB \
  -e CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb1:5984 \
  -e CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME= \
  -e CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD= \
  -e CORE_PEER_ADDRESSAUTODETECT=true \
  -e CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock \
  -e CORE_LOGGING_LEVEL=DEBUG \
  -e CORE_PEER_NETWORKID=peer1.org1.example.com \
  -e CORE_NEXT=true -e CORE_PEER_ENDORSER_ENABLED=true \
  -e CORE_PEER_ID=peer1.org1.example.com -e CORE_PEER_PROFILE_ENABLED=true \
  -e CORE_PEER_COMMITTER_LEDGER_ORDERER=orderer.example.com:7050 \
  -e CORE_PEER_GOSSIP_IGNORESECURITY=true \
  -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net \
  -e CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org1.example.com:7051 \
  -e CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer1.org1.example.com:7051 \
  -e CORE_PEER_TLS_ENABLED=false -e CORE_PEER_GOSSIP_USELEADERELECTION=false \
  -e CORE_PEER_GOSSIP_ORGLEADER=true \
  -e CORE_PEER_LOCALMSPID=Org1MSP -v /var/run/:/host/var/run/ \
  -v $(pwd)/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp:/etc/hyperledger/fabric/msp \
  -w /opt/gopath/src/github.com/hyperledger/fabric/peer hyperledger/fabric-peer peer node start
  ```

- CLI 안됨 -> 하다가 안됨.

- 참고 : https://medium.com/@malliksarvepalli/hyperledger-fabric-on-multiple-hosts-using-docker-swarm-and-compose-f4b70c64fa7d


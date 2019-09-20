## Tuna-app 실습

- 어제 Peer1을 추가하려고 했는데 실패함

- 이어서 그 실패한것을 해결하려함

  - Configtxgen 파일이랑 cryptogen 복사함

    ```
    bcadmin@hlf03:~/fabric-samples/bin$ cp configtxgen /home/bcadmin/education/LFS171x/fabric-material/basic-network/
    
    bcadmin@hlf03:~/fabric-samples/bin$ cp cryptogen /home/bcadmin/education/LFS171x/fabric-material/basic-network/
    ```

  - crypto-config.yaml 파일이랑 configtx.yaml 도 복사함

  - ```
    bcadmin@hlf03:~/fabric-samples/first-network$ cp crypto-config.yaml /home/bcadmin/education/LFS171x/fabric-material/basic-network/
    
    bcadmin@hlf03:~/fabric-samples/first-network$ cp configtx.yaml /home/bcadmin/education/LFS171x/fabric-material/basic-network/
    ```

  - configtx.yaml파일에서 삭제할 부분

  - ```
        - &Org2
            # DefaultOrg defines the organization which is used in the sampleconfig
            # of the fabric.git development environment
            Name: Org2MSP
    
            # ID to load the MSP definition as
            ID: Org2MSP
    
            MSPDir: crypto-config/peerOrganizations/org2.example.com/msp
    
            # Policies defines the set of policies at this level of the config tree
            # For organization policies, their canonical path is usually
            #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
            Policies:
                Readers:
                    Type: Signature
                    Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')"
                Writers:
                    Type: Signature
                    Rule: "OR('Org2MSP.admin', 'Org2MSP.client')"
                Admins:
                    Type: Signature
                    Rule: "OR('Org2MSP.admin')"
    
            AnchorPeers:
                # AnchorPeers defines the location of peers which can be used
                # for cross org gossip communication.  Note, this value is only
                # encoded in the genesis block in the Application section context
                - Host: peer0.org2.example.com
                  Port: 7051
    ```

  - configtx.yaml파일에서 수정할 부분

    ```
    Profiles:
    
        OneOrgsOrdererGenesis:
            <<: *ChannelDefaults
            Orderer:
                <<: *OrdererDefaults
                Organizations:
                    - *OrdererOrg
                Capabilities:
                    <<: *OrdererCapabilities
            Consortiums:
                SampleConsortium:
                    Organizations:
                        - *Org1
    
        OneOrgsChannel:
            Consortium: SampleConsortium
            Application:
                <<: *ApplicationDefaults
                Organizations:
                    - *Org1
    
                Capabilities:
                    <<: *ApplicationCapabilities
    ```

  - `~/education/LFS171x/fabric-material/basic-network/crypto-config$` 안에 있는 모든 디렉토리 삭제

    `sudo rm -rf -R *`

  - `bcadmin@hlf03:~/education/LFS171x/fabric-material/basic-network$ cryptogen generate --config=./crypto-config.yaml` 실행

    ```
    bcadmin@hlf03:~/education/LFS171x/fabric-material/basic-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp$ ls
    admincerts  cacerts  config.yaml  keystore  signcerts  tlscacerts
    
    //6개 파일 있는지 확인
    ```

  - 인증서 생성

    >bcadmin@hlf03:~/education/LFS171x/fabric-material/basic-network$ cryptogen generate --config=./crypto-config.yaml
    >org1.example.com
    >org2.example.com

  - Genesis block 생성

    > bcadmin@hlf03:~/education/LFS171x/fabric-material/basic-network$ configtxgen -profile OneOrgsOrdererGenesis -outputBlock ./config/genesis.block
    >
    > 2019-09-20 09:56:08.588 KST [common/tools/configtxgen] main -> WARN 001 Omitting the channel ID for configtxgen for output operations is deprecated.  Explicitly passing the channel ID will be required in the future, defaulting to 'testchainid'.
    >
    > 2019-09-20 09:56:08.588 KST [common/tools/configtxgen] main -> INFO 002 Loading configuration
    >
    > 2019-09-20 09:56:08.624 KST [common/tools/configtxgen] doOutputBlock -> INFO 003 Generating genesis block
    >
    > 2019-09-20 09:56:08.625 KST [common/tools/configtxgen] doOutputBlock -> INFO 004 Writing genesis block

  - 채널 생성

    > bcadmin@hlf03:~/education/LFS171x/fabric-material/basic-network$ configtxgen -profile OneOrgsChannel -outputCreateChannelTx ./config/channel.tx -channelID mychannel
    >
    > 2019-09-20 09:58:19.947 KST [common/tools/configtxgen] main -> INFO 001 Loading configuration
    >
    > 2019-09-20 09:58:19.966 KST [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 002 Generating new channel configtx
    >
    > 2019-09-20 09:58:19.967 KST [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 003 Writing new channel tx

  - Anchor peer 생성

    >bcadmin@hlf03:~/education/LFS171x/fabric-material/basic-network$ configtxgen -profile OneOrgsChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP
    >
    >2019-09-20 10:02:23.249 KST [common/tools/configtxgen] main -> INFO 001 Loading configuration
    >
    >2019-09-20 10:02:23.281 KST [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 002 Generating anchor peer update
    >
    >2019-09-20 10:02:23.281 KST [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 003 Writing anchor peer update

- 압축 파일 받아서 압축풀기

- bcadmin@hlf03:~/education/LFS171x/fabric-material/basic-network$

  >bcadmin@hlf03:~/education/LFS171x/fabric-material/basic-network$ ls -al
  >
  >total 29832
  >
  >drwxr-xr-x 5 bcadmin bcadmin     4096  9월 20 11:19 .
  >
  >drwxr-xr-x 5 bcadmin bcadmin     4096  9월 19 13:50 ..
  >
  >drwxr-xr-x 2 bcadmin bcadmin     4096  9월 20 03:55 base
  >
  >drwxr-xr-x 2 bcadmin bcadmin     4096  9월 20 10:02 config
  >
  >-rwxr-xr-x 1 bcadmin bcadmin 18551624  9월 20 09:34 configtxgen
  >
  >-rw-r--r-- 1 bcadmin bcadmin    11022  9월 20 09:44 configtx.yaml
  >
  >drwxr-xr-x 4 bcadmin bcadmin     4096  9월 20 09:48 crypto-config
  >
  >-rw-r--r-- 1 bcadmin bcadmin     3906  9월 20 09:40 crypto-config.yaml
  >
  >-rwxr-xr-x 1 bcadmin bcadmin 11909544  9월 20 09:35 cryptogen
  >
  >-rwxr-xr-x 1 bcadmin bcadmin     2484  9월 20 11:20 docker-compose-cli2.yaml
  >
  >-rwxr-xr-x 1 bcadmin bcadmin     2346  9월 20 03:54 docker-compose-couch.yaml
  >
  >-rw-r--r-- 1 bcadmin bcadmin     7857  9월 19 15:47 docker-compose.yml
  >
  >-rw-r--r-- 1 bcadmin bcadmin       25  9월 19 13:50 .env
  >
  >-rwxr-xr-x 1 bcadmin bcadmin     1213  9월 19 13:50 generate.sh
  >
  >-rwxr-xr-x 1 bcadmin bcadmin      305  9월 19 13:50 init.sh
  >
  >-rw-r--r-- 1 bcadmin bcadmin     1104  9월 19 13:50 README.md
  >
  >-rwxr-xr-x 1 bcadmin bcadmin     1337  9월 19 16:20 start.sh
  >
  >-rwxr-xr-x 1 bcadmin bcadmin      258  9월 19 13:50 stop.sh
  >
  >-rwxr-xr-x 1 bcadmin bcadmin      441  9월 19 13:50 teardown.sh

- docker-compose-cli2.yaml의 44라인에 있는

  ```
  image: hyperledger/fabric-tools
  
  // :$IMAGE_TAG 삭제
  ```

- command_summary_3의 #6 수행

  *Start Fabric Network*

  `CHANNEL_NAME=mychannel TIMEOUT=30 docker-compose -f docker-compose-cli2.yaml -f docker-compose-couch.yaml up -d`

- \#7 run CLI : `docker exec -it cli bash ` 

- \#7.1 Orderer Environment Variable settings

  ```
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  
  ORDERER_GENERAL_LOGLEVEL=INFO
  ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
  ORDERER_GENERAL_GENESISMETHOD=file
  ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block
  ORDERER_GENERAL_LOCALMSPID=OrdererMSP
  ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
  ORDERER_GENERAL_TLS_ENABLED=true
  ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key
  ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt
  ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
  ```

- \#7.2 create channel

  ```
  peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/channel.tx --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
  ```

- `ls` 명령어로 mychannel.block 파일 확인

  ```
  root@e8497a310270:/opt/gopath/src/github.com/hyperledger/fabric/peer# ls
  channel-artifacts  crypto  mychannel.block  scripts
  ```

- \#8 Peer Join

  \#8.1 Peer0 Org1

  ```
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
  CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  
  CORE_PEER_ID=peer0.org1.example.com
  CORE_PEER_ADDRESS=peer0.org1.example.com:7051
  CORE_PEER_GOSSIP_BOOTSTRAP=peer1.org1.example.com:7051
  CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org1.example.com:7051
  CORE_PEER_LOCALMSPID=Org1MSP
  
  peer channel join -b mychannel.block
  ```

  ```
  root@e8497a310270:/opt/gopath/src/github.com/hyperledger/fabric/peer# peer channel join -b mychannel.block
  
  2019-09-20 02:38:27.560 UTC [channelCmd] InitCmdFactory -> INFO 001 Endorser and orderer connections initialized
  2019-09-20 02:38:27.797 UTC [channelCmd] executeJoin -> INFO 002 Successfully submitted proposal to join channel
  ```

  \#8.2 Peer1 Org1

  ```
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt
  CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.key
  CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.crt
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  
  CORE_PEER_ID=peer1.org1.example.com
  CORE_PEER_ADDRESS=peer1.org1.example.com:7051
  CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer1.org1.example.com:7051
  CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org1.example.com:7051
  CORE_PEER_LOCALMSPID=Org1MSP
  
  peer channel join -b mychannel.block
  ```

  ```
  root@e8497a310270:/opt/gopath/src/github.com/hyperledger/fabric/peer# peer channel join -b mychannel.block
  2019-09-20 02:42:26.402 UTC [channelCmd] InitCmdFactory -> INFO 001 Endorser and orderer connections initialized
  2019-09-20 02:42:26.565 UTC [channelCmd] executeJoin -> INFO 002 Successfully submitted proposal to join channel
  ```

- \#9 Anchor Peer setting

  ```
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
  CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  
  CORE_PEER_CRYPTO_BASE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto
  CORE_PEER_MSPCONFIGPATH=$CORE_PEER_CRYPTO_BASE/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  CORE_PEER_ADDRESS=peer0.org1.example.com:7051
  CORE_PEER_LOCALMSPID="Org1MSP"
  CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_CRYPTO_BASE/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  
  peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/Org1MSPanchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile 
  ```

  ```
  root@e8497a310270:/opt/gopath/src/github.com/hyperledger/fabric/peer# peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/Org1MSPanchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile 
  
  /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
  2019-09-20 02:43:49.207 UTC [channelCmd] InitCmdFactory -> INFO 001 Endorser and orderer connections initialized
  2019-09-20 02:43:49.237 UTC [cli/common] readBlock -> INFO 002 Received block: 0
  ```

- \#10 ChainCode deploy

  ```
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
  CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  
  CORE_PEER_CRYPTO_BASE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto
  CORE_PEER_MSPCONFIGPATH=$CORE_PEER_CRYPTO_BASE/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  CORE_PEER_ADDRESS=peer0.org1.example.com:7051
  CORE_PEER_LOCALMSPID="Org1MSP"
  CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_CRYPTO_BASE/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  
  peer chaincode install -n tuna-app -v 1.0 -p github.com/hyperledger/fabric/examples/chaincode/go/tuna-app
  ```

  ```
  root@e8497a310270:/opt/gopath/src/github.com/hyperledger/fabric/peer# peer chaincode install -n tuna-app -v 1.0 -p github.com/hyperledger/fabric/examples/chaincode/go/tuna-app
  
  2019-09-20 02:45:09.828 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
  2019-09-20 02:45:09.829 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc
  2019-09-20 02:45:11.463 UTC [chaincodeCmd] install -> INFO 003 Installed remotely response:<status:200 payload:"OK" > 
  ```

- \#11 Initialize chaincode

  ```
  CORE_PEER_CRYPTO_BASE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto
  CORE_PEER_MSPCONFIGPATH=$CORE_PEER_CRYPTO_BASE/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  CORE_PEER_ADDRESS=peer0.org1.example.com:7051
  CORE_PEER_LOCALMSPID="Org1MSP"
  CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_CRYPTO_BASE/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  
  peer chaincode instantiate -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem -C mychannel -n tuna-app -v 1.0 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
  ```

  ```
  root@e8497a310270:/opt/gopath/src/github.com/hyperledger/fabric/peer# peer chaincode instantiate -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem -C mychannel -n tuna-app -v 1.0 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
  2019-09-20 02:46:37.726 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
  2019-09-20 02:46:37.726 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc
  ```

  \#11.1 chaincode invoke

  ```
  root@e8497a310270:/opt/gopath/src/github.com/hyperledger/fabric/peer# peer chaincode invoke -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n tuna-app -c '{"function":"initLedger","Args":[""]}'
  
  2019-09-20 02:47:22.733 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 
  ```

  ```
  root@e8497a310270:/opt/gopath/src/github.com/hyperledger/fabric/peer# peer chaincode invoke -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n tuna-app -c '{"function":"queryAllTuna","Args":[""]}'
  
  2019-09-20 02:48:19.462 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"[{\"Key\":\"1\", \"Record\":{\"holder\":\"Miriam\",\"location\":\"67.0006, -70.5476\",\"timestamp\":\"1504054225\",\"vessel\":\"923F\"}},{\"Key\":\"10\", \"Record\":{\"holder\":\"Fatima\",\"location\":\"51.9435, 8.2735\",\"timestamp\":\"1487745091\",\"vessel\":\"49W4\"}},{\"Key\":\"2\", \"Record\":{\"holder\":\"Dave\",\"location\":\"91.2395, -49.4594\",\"timestamp\":\"1504057825\",\"vessel\":\"M83T\"}},{\"Key\":\"3\", \"Record\":{\"holder\":\"Igor\",\"location\":\"58.0148, 59.01391\",\"timestamp\":\"1493517025\",\"vessel\":\"T012\"}},{\"Key\":\"4\", \"Record\":{\"holder\":\"Amalea\",\"location\":\"-45.0945, 0.7949\",\"timestamp\":\"1496105425\",\"vessel\":\"P490\"}},{\"Key\":\"5\", \"Record\":{\"holder\":\"Rafa\",\"location\":\"-107.6043, 19.5003\",\"timestamp\":\"1493512301\",\"vessel\":\"S439\"}},{\"Key\":\"6\", \"Record\":{\"holder\":\"Shen\",\"location\":\"-155.2304, -15.8723\",\"timestamp\":\"1494117101\",\"vessel\":\"J205\"}},{\"Key\":\"7\", \"Record\":{\"holder\":\"Leila\",\"location\":\"103.8842, 22.1277\",\"timestamp\":\"1496104301\",\"vessel\":\"S22L\"}},{\"Key\":\"8\", \"Record\":{\"holder\":\"Yuan\",\"location\":\"-132.3207, -34.0983\",\"timestamp\":\"1485066691\",\"vessel\":\"EI89\"}},{\"Key\":\"9\", \"Record\":{\"holder\":\"Carlo\",\"location\":\"153.0054, 12.6429\",\"timestamp\":\"1485153091\",\"vessel\":\"129R\"}}]" 
  ```

## Multihosting

- Ubuntu Linux를 2개 띄운다

- docker network 상태를 2개 linux 모두 맞춰준다.

  ```
  bcadmin@hlf03:~$ docker network ls
  docNETWORK ID          NAME                DRIVER              SCOPE
  cfd307d79407        bridge              bridge              local
  58b503b5ce3d        host                host                local
  f1f7c8f5f0c7        net_basic           bridge              local
  6450b0efd7f7        net_byfn            bridge              local
  0aeb61f386ff        none                null                local
  
  bcadmin@hlf03:~$ docker network rm net_basic 
  net_basic
  
  bcadmin@hlf03:~$ docker network ls
  NETWORK ID          NAME                DRIVER              SCOPE
  cfd307d79407        bridge              bridge              local
  58b503b5ce3d        host                host                local
  6450b0efd7f7        net_byfn            bridge              local
  0aeb61f386ff        none                null                local
  ```

- `ifconfig`  명령어를 실행해보면 각각 다른 ip를 가지고 있다.

  ```
  enp0s8: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
          inet 192.168.56.103  netmask 255.255.255.0  broadcast 192.168.56.255
          inet6 fe80::248f:30b3:3a26:2  prefixlen 64  scopeid 0x20<link>
          inet6 fe80::484f:7454:9db8:42cd  prefixlen 64  scopeid 0x20<link>
          ether 08:00:27:2d:92:93  txqueuelen 1000  (Ethernet)
          RX packets 66  bytes 10484 (10.4 KB)
          RX errors 0  dropped 0  overruns 0  frame 0
          TX packets 376  bytes 65152 (65.1 KB)
          TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
  ```

  ```
  enp0s8: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
          inet 192.168.56.102  netmask 255.255.255.0  broadcast 192.168.56.255
          inet6 fe80::248f:30b3:3a26:2  prefixlen 64  scopeid 0x20<link>
          ether 08:00:27:8b:a4:7b  txqueuelen 1000  (Ethernet)
          RX packets 371  bytes 67061 (67.0 KB)
          RX errors 0  dropped 0  overruns 0  frame 0
          TX packets 132  bytes 16943 (16.9 KB)
          TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
  ```

### Hostname 바꾸기

- HOSTNAME 바꾸기 : `hostnamectl set-hostname hfl02`

  ```
  bcadmin@hlf03:~/fabric-samples/first-network$ hostnamectl set-hostname hfl02
  
  bcadmin@hlf03:~/fabric-samples/first-network$ hostname
  hfl02
  
  bcadmin@hlf03:~/fabric-samples/first-network$ hostnamectl
     Static hostname: hfl02
           Icon name: computer-vm
             Chassis: vm
          Machine ID: cc43e52289a9463d94833ee981549e1d
             Boot ID: 7f8cc8f11451441e8f2d59952ab1b0da
      Virtualization: oracle
    Operating System: Ubuntu 18.04.1 LTS
              Kernel: Linux 4.15.0-36-generic
        Architecture: x86-64
  ```

  

- `bcadmin@hlf03:~$ sudo vi /etc/hosts`

  ```
  127.0.0.1       localhost
  127.0.1.1       hlf02
  
  # The following lines are desirable for IPv6 capable hosts
  ::1     ip6-localhost ip6-loopback
  fe00::0 ip6-localnet
  ff00::0 ip6-mcastprefix
  ff02::1 ip6-allnodes
  ff02::2 ip6-allrouters
  
  hlf03 192.168.56.103
  hlf02 192.168.56.102
  ```

  ✔️결과화면

  ```
  bcadmin@hfl02:~$ nslookup hlf02
  Server:		127.0.0.53
  Address:	127.0.0.53#53
  
  Non-authoritative answer:
  Name:	hlf02
  Address: 127.0.0.1
  Name:	hlf02
  Address: 192.168.56.102
  ```

  ```
  bcadmin@hlf03:~$ nslookup hlf03
  Server:		127.0.0.53
  Address:	127.0.0.53#53
  
  Non-authoritative answer:
  Name:	hlf03
  Address: 127.0.0.1
  Name:	hlf03
  Address: 192.168.56.103
  ```

- Swarm 초기화 : `docker swarm init` // hlf02

- ssh를 이용해서 hlf03에 붙기 : `ssh bcadmin@192.168.56.103`

  ```
  bcadmin@hlf02:~$ ssh bcadmin@192.168.56.103
  The authenticity of host '192.168.56.103 (192.168.56.103)' can't be established.
  ECDSA key fingerprint is SHA256:gNhv8IyjBXCq5p3C8du8IbgzbU3nygCW/7/a5+0XobU.
  Are you sure you want to continue connecting (yes/no)? yes
  Warning: Permanently added '192.168.56.103' (ECDSA) to the list of known hosts.
  bcadmin@192.168.56.103's password: 
  Welcome to Ubuntu 18.04.1 LTS (GNU/Linux 4.15.0-36-generic x86_64)
  
   * Documentation:  https://help.ubuntu.com
   * Management:     https://landscape.canonical.com
   * Support:        https://ubuntu.com/advantage
  
  
   * Canonical Livepatch is available for installation.
     - Reduce system reboots and improve kernel security. Activate at:
       https://ubuntu.com/livepatch
  
  477 packages can be updated.
  161 updates are security updates.
  ```

- Join token  : hlf02에서 swarm init 했을때 나왔던 명령어를 hlf03에서 실행해야 하는데 복붙이 안될 수 있으므로 ssh를 이용해서 붙어주는 것이다.

  ```
  bcadmin@hlf03:~$ docker swarm join --token SWMTKN-1-5r208h7wp5zcfiozyuzdzt7f1pavbzdpoo39o502n0lrv307vh-4n48p2k549mc5biugetyg9yps 192.168.56.102:2377
  This node joined a swarm as a worker.
  ```

- Network 생성 : `docker network create --attachable --driver overlay my-net`

  ```
  bcadmin@hfl02:~$ docker network create --attachable --driver overlay my-net
  n2k5n8zcrklsnnteh9mrzweho
  ```


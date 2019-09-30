## Fabric car 실습

- 어제 하던것은 backup으로 놔두고 다시 fabric-samples 디렉토리 설치

  - `curl -sSL http://bit.ly/2ysbOFE | bash -s 1.3.0 1.3.0 0.4.13`

  - `cd fabric-samples/fabcar`

  - `npm i`

  - `~/fabcar$ ./startFabric.sh`

    ![image](https://user-images.githubusercontent.com/43080040/65095392-ed22a480-d9fb-11e9-8f5c-95c7b183b9eb.png)

  - 초기화 된 car값

    ![image](https://user-images.githubusercontent.com/43080040/65096001-4ab7f080-d9fe-11e9-97c2-52998537a0cd.png)

  - `/fabcar$ node enrollAdmin.js`

    ![image](https://user-images.githubusercontent.com/43080040/65095409-0592bf00-d9fc-11e9-8b5c-d8539ed1c9cd.png)

  - `node registerUser.js`

  - `node query.js`

    ![image](https://user-images.githubusercontent.com/43080040/65095574-c1ec8500-d9fc-11e9-95ab-d9d5bfa93124.png)

  - `vi query.js`

  - query.js에는 총 5개의 function이 정의되어 있고

    ```
    chaincodeId: 'fabcar',
    fcn: 'queryCar',
    args:['CAR4']
    ```

    라고 수정후에 `node query.js` 를 하게 되면 CAR4의 정보만 보이게 된다.

    ![image](https://user-images.githubusercontent.com/43080040/65095820-a7ff7200-d9fd-11e9-9c84-40ea29068f32.png)

  - `vi invoke.js`

    ![image](https://user-images.githubusercontent.com/43080040/65101839-47bffe80-da04-11e9-9e29-21595030ad8c.png)

  - 수정후 실행 `node invoke.js`

    ![image](https://user-images.githubusercontent.com/43080040/65101784-1e06d780-da04-11e9-8f61-1620bcf9f639.png)

  - 실행하면 CAR1 다음에 CAR12가 삽입되어 있는 것을 볼 수 있다.

    ![image](https://user-images.githubusercontent.com/43080040/65101957-9ec5d380-da04-11e9-9af7-913e766beb04.png)

  - ✔️Owner 바꾸기

  - `vi invoke.js`

    ![image](https://user-images.githubusercontent.com/43080040/65103269-adae8500-da08-11e9-8fdd-6e7ff68da189.png)

  - 수정후 `node invoke.js` 명령 수행 후

  - `node query.js` 를 하면 Owner 소유권이 바뀌어져 있다.

    ![image](https://user-images.githubusercontent.com/43080040/65103326-df275080-da08-11e9-9daf-c843578eeb43.png)

## Command-summary-2 실습

- `./byfn.sh generate` 

  > ##########################################################
  > ##### Generate certificates using cryptogen tool #########
  > ##########################################################
  > + cryptogen generate --config=./crypto-config.yaml
  > org1.example.com
  > org2.example.com
  > + res=0
  > + set +x
  > 
  > /home/parallels/fabric-samples/first-network/../bin/configtxgen
  > ##########################################################
  > #########  Generating Orderer Genesis block ##############
  > ##########################################################
  > + configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
  > 2019-09-18 13:49:54.941 KST [common/tools/configtxgen] main -> WARN 001 Omitting the channel ID for configtxgen for output operations is deprecated.  Explicitly passing the channel ID will be required in the future, defaulting to 'testchainid'.
  > 2019-09-18 13:49:54.942 KST [common/tools/configtxgen] main -> INFO 002 Loading configuration
  > 2019-09-18 13:49:54.970 KST [common/tools/configtxgen] doOutputBlock -> INFO 003 Generating genesis block
  > 2019-09-18 13:49:54.971 KST [common/tools/configtxgen] doOutputBlock -> INFO 004 Writing genesis block
  > + res=0
  > + set +x
  > 
  > #################################################################
  > ### Generating channel configuration transaction 'channel.tx' ###
  > #################################################################
  > + configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mychannel
  > 2019-09-18 13:49:55.009 KST [common/tools/configtxgen] main -> INFO 001 Loading configuration
  > 2019-09-18 13:49:55.028 KST [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 002 Generating new channel configtx
  > 2019-09-18 13:49:55.029 KST [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 003 Writing new channel tx
  > + res=0
  > + set +x
  > 
  > #################################################################
  > #######    Generating anchor peer update for Org1MSP   ##########
  > #################################################################
  > + configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP
  > 2019-09-18 13:49:55.059 KST [common/tools/configtxgen] main -> INFO 001 Loading configuration
  > 2019-09-18 13:49:55.079 KST [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 002 Generating anchor peer update
  > 2019-09-18 13:49:55.079 KST [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 003 Writing anchor peer update
  > + res=0
  > + set +x
  > 
  > #################################################################
  > #######    Generating anchor peer update for Org2MSP   ##########
  > #################################################################
  > + configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP
  > 2019-09-18 13:49:55.117 KST [common/tools/configtxgen] main -> INFO 001 Loading configuration
  > 2019-09-18 13:49:55.138 KST [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 002 Generating anchor peer update
  > 2019-09-18 13:49:55.139 KST [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 003 Writing anchor peer update
  > + res=0
  >
  > + set +x

- `CHANNEL_NAME=mychannel TIMEOUT=10000 docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml up -d` //채널 이름 설정

- `docker exec -it cli bash`  // Docker container에 접근 (Run cli)




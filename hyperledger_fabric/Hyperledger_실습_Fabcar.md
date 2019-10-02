---


layout: post
title: Hyperledger Fabric_실습
subtitle: fabcar
categories: [Hyperledger Fabric]
tags: [Hyperledger Fabric,Smart contract]
comments: true

---

20191001

## Fabcar

***실습환경***

- Nodejs - v8.16.1
- npm - v6.4.1 
- Docker - v19.03.2
- Docker-compose - v1.17.1
- phthon

### Fabcar Download

👉🏻`curl -sSL http://bit.ly/2ysbOFE | bash -s 1.3.0`

👉🏻`cd fabric-samples/fabcar `

👉🏻`npm i`

![image](https://user-images.githubusercontent.com/43080040/65937154-e95e3b80-e459-11e9-902c-445267844348.png)

-> 에러가 나서👉🏻 `npm i make gcc node-gyp` 를 설치해준다.

### Fabcar 실행

👉🏻`./startFabric.sh`

![image](https://user-images.githubusercontent.com/43080040/65937334-8faa4100-e45a-11e9-8c0f-cd6a51d39131.png)

*결과화면*

![image](https://user-images.githubusercontent.com/43080040/65937437-d304af80-e45a-11e9-9fbc-fc79966a4836.png)

- Organization X 1
- Certificate Authority X 1
- Orderer X 1
- Peer X 1
- CouchDB X 1

### 관리 유저 Admin 등록

👉🏻`node enrollAdmin.js` 

![image](https://user-images.githubusercontent.com/43080040/65937733-c7fe4f00-e45b-11e9-846a-42dff48429d7.png)

### 일반 유저 User1 등록

👉🏻`node registerUser.js` 

![image](https://user-images.githubusercontent.com/43080040/65937927-6094cf00-e45c-11e9-9f23-da74ac463f04.png)

### User1로 모든 데이터 테이블 조회  

👉🏻`node query.js` 

> [{"Key":"CAR0", "Record":{"colour":"blue","make":"Toyota","model":"Prius","owner":"Tomoko"}},
>
> {"Key":"CAR1", "Record":{"colour":"red","make":"Ford","model":"Mustang","owner":"Brad"}},
>
> {"Key":"CAR2", "Record":{"colour":"green","make":"Hyundai","model":"Tucson","owner":"Jin Soo"}},
>
> {"Key":"CAR3", "Record":{"colour":"yellow","make":"Volkswagen","model":"Passat","owner":"Max"}},
>
> {"Key":"CAR4", "Record":{"colour":"black","make":"Tesla","model":"S","owner":"Adriana"}},
>
> {"Key":"CAR5", "Record":{"colour":"purple","make":"Peugeot","model":"205","owner":"Michel"}},
>
> {"Key":"CAR6", "Record":{"colour":"white","make":"Chery","model":"S22L","owner":"Aarav"}},
>
> {"Key":"CAR7", "Record":{"colour":"violet","make":"Fiat","model":"Punto","owner":"Pari"}},
>
> {"Key":"CAR8", "Record":{"colour":"indigo","make":"Tata","model":"Nano","owner":"Valeria"}},
>
> {"Key":"CAR9", "Record":{"colour":"brown","make":"Holden","model":"Barina","owner":"Shotaro"}}]

![image](https://user-images.githubusercontent.com/43080040/65938114-05afa780-e45d-11e9-8e72-4c7ea05f120f.png)

### 새로운 자동차 정보 입력

👉🏻`vi invoke.js`

*// 수정 전*

![image](https://user-images.githubusercontent.com/43080040/65938447-ef561b80-e45d-11e9-865d-af227f3d2145.png)

*// 수정 후*

![image](https://user-images.githubusercontent.com/43080040/65938570-3d6b1f00-e45e-11e9-9ee5-f5ae4caa6940.png)

// ~/fabric-samples/chaincode/fabcar/node/fabcar.js 여기에 정의되어있음.

![image](https://user-images.githubusercontent.com/43080040/65938384-cb92d580-e45d-11e9-95ab-866fff9b7e69.png)

### 새로 추가된 자동차 정보 배포

👉🏻`node invoke.js`

![image](https://user-images.githubusercontent.com/43080040/65938661-84591480-e45e-11e9-993e-a386d5e81f9c.png)

### 쿼리 수행

👉🏻`node query.js`

![image](https://user-images.githubusercontent.com/43080040/65943705-19620a80-e46b-11e9-9187-fc9ce84540a5.png)



## Marbles Demo

### Marbles 다운로드

👉🏻`~💲/ git clone https://github.com/IBM-Blockchain/marbles.git --depth 1` // marbles Download

![image](https://user-images.githubusercontent.com/43080040/65946217-9cd22a80-e470-11e9-8820-91dbf29ed904.png)

// 에러가 나서 make를 다운 받아줘야 한다.

👉🏻`npm i make gcc node-gyp` // make, gcc, node-gyp 를 다운받아준다.

![image](https://user-images.githubusercontent.com/43080040/65946287-cdb25f80-e470-11e9-8cc3-15ff4a53d37f.png)

// 또 다시 에러가 난다. 

👉🏻`make init` 한 후 `npm i` 를 하면 에러 없이 다 설치가 된다.

![image](https://user-images.githubusercontent.com/43080040/65946357-f3d7ff80-e470-11e9-8630-e00fe3cd57aa.png)


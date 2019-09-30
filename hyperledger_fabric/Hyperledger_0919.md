## ☝🏼Marbles 예제 실습

### 설치 및 환경설정

- `💲cd $HOME`
- `💲git clone https://git clone https://github.com/IBM-Blockchain/marbles.git --depth 1`
- `💲cd marbles`
- `💲npm i`

### Marbles 네트워크 구성

- fabcar 애플리케이션을 이용해서 네트워크 시작( Marbles를 실행하기 위해 하나의 블록체인이 필요)
  - `💲cd $HOME/fabric-samples/fabcar`
  - `./startFabric.sh`
- Admin, User1 생성
  - `💲npm i`
  - `💲node registerAdmin.js`
  - `💲node registerUser.js`

### Chaincode 설치 및 인스턴스화

- `💲cd $HOME/marbles/scripts`
- `💲node install_chaincode.js`
- `💲node instantiate_chaincode.js`

### 애플리케이션 실행

- `💲cd $HOME/marbles`
- `💲gulp marbles_local`

> Gulp 명령어가 설치 안되어 있을 경우
>
> `💲sudo npm i gulp -g`
>
> `💲npm i`

- Web Brower 에서 http://localhost:3001 접속
- **애플리케이션 테스트**
  - Marble 생성
  - Marble 교환
  - Marble 소유권 이전
  - Marble 삭제

### ❌서버 기동시 오류가 나는 경우❌

- `💲rm -rf $HOME/.hfc-key-store/` 
- `💲cp $HOME/fabric-samples/fabcar/.hfc-key-store/* $HOME/.hfc-key-store/ `

## ✌🏼Tuna 예제 실습

### 설치 및 환경설정

- `💲git colne https://github.com/hyperledger/education.com`
- `💲cd education/LFS171x/fabric-material/tuna-app`
- `💲npm install`
- `💲docker rmi -f ____` //체인 형식으로 되어있는 이미지들 모두 삭제

### 웹서버 띄우기

- `fabric-material/tuna-app/💲node registerAdmin.js`
  - Admin의 key,CA를 생성한 후 fabric Client, CA Server에 등록한다.
- `fabric-material/tuna-app/💲node registerUser.js`
  - User의 key,CA를 생성한 후 fabric Client, CA Server에 등록한다.
- `fabric-material/tuna-app/💲node server.js`
  - middleware를 load,routes.js로 부터 코드를 불러와 실행, port번호를 저장한 후, 서버를 start, listen 한다.

### 웹서버 내리기

- `fabric-material/basic-network/💲./stop.sh`

## 👉🏻Ubuntu Tilix

- 화면분할을 위한 프로그램
  - `💲sudo add-apt-repository ppa:webupd8team/terminix`
  - `💲sudo apt-get update`
  - `💲sudo apt-get install tilix`
  - `💲tilix`
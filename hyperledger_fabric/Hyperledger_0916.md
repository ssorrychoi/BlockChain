## Hyperledger Fabric Architecture

![image](https://user-images.githubusercontent.com/43080040/64929788-6dfb6800-d865-11e9-8f0c-858d35b7b46d.png)

![image](https://user-images.githubusercontent.com/43080040/64929857-245f4d00-d866-11e9-9913-e1c4098be629.png)

### Hyperledger Fabric Component

1. Network
   - 블록체인 네트워크를 구성하는 데이터처리 peer들의 집합
   - 네트워크는 일관되게 복제 된 Ledger를 유지 관리
2. Channel
   - 오직 이해관계자들에게만 트랜젝션을 볼 수 있도록 하는 데이터 파티셔닝 매커니즘
   - 각 채널은 해당 특정 채널에 대한 트랜젝션만 포함하는 독립적인 트랜젝션 블록체인
3. Chaincode
   - 스마트 계약, 자산 정의와 자산 수정을 위한 비즈니스 로직(or 트랜젝션)을 캡슐화
   - 트랜젝션은 Chaincode를 실행함으로써 Ledger를 변경
4. Ledger
   - 네트워크의 현재 상태와 일련의 트랜젝션 호출이 포함
   - 공유되고 권한이 부여된 Ledger는 기록을 추가할 수 있는 시스템이며, 신뢰할 수 있는 단일 소스로 제공
5. World State
   - 네트워크의 모든 자산에 대한 최신 데이터를 반영
   - 데이터는 효율적인 액세스를 위해 데이터베이스에 저장
   - LevelDB, CouchDB 지원
6. Ordering Service
   - 트랜잭션을 블록으로 정렬하는 노드 모음
7. Membership Service Provider(MSP)
   - 클라이언트 및 Peer들에게 ID 및 허가된 액세스를 관리

### Channel

- 채널을 사용하면 여러 블록 체인을 분리하여 동일한 네트워크를 활용 가능
- 트랜젝션이 수행 된 채널의 구성원만 트랜잭션의 세부 사항을 볼 수 있음
- 채널은 이해 관계자에 대한 트랜잭션 가시성만 허용하기 위해 네트워크를 분할
- 피어는 여러 네트워크 또는 채널에 속할 수 있음
  - 여러 채널에 참여한 피어는 서로 다른  원장에게 트랜잭션을 시뮬레이션하고 커밋
  - Ordering Service는 모든 네트워크 또는 채널에서 동일하게 사용

### ChainCode

- 스마트 계약은 트랜잭션을 실행하고 원장(World State) 내에 저장된 자산의 상태를 수정하는 로직이 포함 된 프로그램
- Hyperledger Fabric 스마트 계약은 체인 코드(Go,Node.js,Java로 작성 가능)
- 체인 코드는 Hyperledger Fabric 네트워크의 비즈니스 로직으로 사용되며, 체인 코드는 네트워크 내에서 자산을 조작하는 방법을 제시

### Ledger

- 검증노드(Validation Peer)는 NoSQL DB인 LevelDB나 CouchDB로 Key-value 형식의 데이터베이스가 설치됨
- 분산원장, 트랜잭션, 체인코드 데이터가 저장

### World State

- 현재 World State는 원장의 모든 자산에 대한 최신 값을 저장
- 현재 상태는 채널에서 커밋 된 모든 트랜잭션을 나타내기 때문에 때로는 World State라고 함
- 체인 코드 호출은 현재 상태 데이터에 대해 트랜잭션을 실행
- 상태 데이터베이스는 단순히 체인의 커밋 된 트랜젝션에 대한 인덱싱 된 뷰
  - 체인에서 언제든지 재생성 할 수 있음
  - 상태 데이터베이스는 새로운 트랜젝션이 수락되기 전에 Peer가 시작될 때 자동으로 복구(또는 필요한 경우 생성)
  - 기본 상태 DB는 LevelDB (yaml파일 수정 후 CouchDB로 변경 가능)
- Level DB
  - Hyperledger Fabric의 기본키/값 상태 DB
  - //////
- Couch DB
- Level DB와 Couch DB는 매우 유사
- Chaincode 상태 저장
- Chaincode는 데이터베이스로 Key-Value 쌍으로 데이터를 저장 -> LevelDB,CouchDB 사용
- 전체 검증노드(Validating Peer)에 존재 -> 동일한 데이터가 저장

### Ordering Service

- 트랜잭션을 포함하는 메세지의 Broad Service를 제공하고 트랜잭션의 순서와 블록을 만드는 서비스
- Broad Service를 사용하여 채널 단위로 해당 Peer들에게 블록을 전송
- 또 하나의 블록에 들어갈 수 있는 트랜잭션의 수는 블록의 공간과 시간에서 결정할 수 있음
  - -> 비즈니스 프로세스에서 트랜잭션을 확정 할때까지의 **소요시간 조절 가능**
- Ordering Service가 제공하는 API를 통해 클라이언트와 Peer는 Hyperledger Fabric 네트워크와 통신하고 원장의 갱신과 참조 가능
- Ordering Service API
  - Broadcast(blob)
    - 클라이언트가 broadcast()를 호출하여 채널에 어떤 메시지(blob)를 Broadcast 가능
    - 이러한 blob에는 트랜잭션의 실제 데이터와 클라이언트의 서명이 포함
    - Edorsing Peer와 Ordering Service 트랜잭션을 보낼 때 사용
  - Deliver(seqno, prevhash, blob)
    - Ordering Service가 deliver()를 호출하여 peer에게 임의의 메세지(blob) 전송
- Channel 재구성 및 구축
  - 블록체인 네트워크의 일원이 채널을 다시 구성하려면 채널 구성 정보를 포함하는 트랜잭션을 Ordering Service에 전송
  - Ordering Service는 트랜잭션을 받으면 채널을 재구축
  - 새로 구축 할 때도 동일하게 구성 정보를 포함하는 트랜잭션을 받고, Ordering Service가 채널을 구축
- Client 액세스 제어
  - Ordering Service는 액세스 제어를 실행하는 클라이언트가 특정 채널에 트랜잭션을 보내도 좋은지, 블록 정보를 받아도 좋은지를 확인

## Hyperledger Fabric MSP

### Certificate

- 사용자, Non-validating Peer, Validating Peer등 모든 엔티티에 발행

- ECert(Enrollment Certificate)

  - 사용자의 신원을 확인하기 위해서 장기적으로 사용되는 인증서
  - 사용자, 검증노드 및 비검증노드에 발행

- TCert(Transaction Certificate)

  - 트랜잭션마다 발행되는 단기적으로 사용되는 인증서
  - 사용자, 검증노드 및 비검증노드에게 발행
  - 트랜잭션마다 다른 TCert를 사용하면 여러 트랜잭션이 동일한 사용자에 속하는 것을 숨길 수 있음

- TLS Certificate

  - 통신 채널을 암호화하는데 사용되는 인증서

- **Identities**

  - 멤버십 서비스 공급자는 신원을 확인하고, 인증하고, 네트워크 액세스를 허용하는 규칙을 정의하는 구성요소
  - MSP는 사용자 ID를 관리하고 네트워크에 가입하려는 클라이언트를 전송

- What Does the MSP Do?

  ✔ 시작하기 위하 사용자는 인증 기관을 사용하여 인증

  ✔ 다음으로 서명 확인 알고리즘은 신원, 보증 및 서명을 입력으로 사용

  ✔ Fabric-Certificate Authority (Fabric-CA)

  - ​	일반적으로 인증 기관은 허가 된 블록 체인에 대한 등록 인증서를 관리

  ✔ External-Certicicate Authority 

## Hyperledger Fabric 네트워크 구성

### 사전 준비사항

- 샘플 Fabric 네트워크 환경은 Ubuntu 16.04 환경을 기준으로 테스트 했으며, 다음 항목을 설치해야한다.

✔️ Docker : 17.06.2-ce 이상 > **18.06.1-ce**

```
Docker 특정 version 설치하는 법

https://skylit.tistory.com/415
https://download.docker.com/linux/static/stable/x86_64/
```

✔️ **Docker-compose : v.1.14 이상 > 1.21.2**

Ubuntu linux terminal에서

`~$ sudo curl -L "https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`

입력하고 버젼을 확인하면 Permission denied가 나온다.

`~$ sudo chmod +x /usr/local/bin/docker-compose` 라고 입력하면 접근 가능. 버젼이 나온다.

`~$ docker-compose --version`

결과화면 : docker-compose version 1.21.2, build a133471

✔️ **Go lang : 1.9.x 이상 > 1.10.3**

`sudo tar -C /usr/local -xzf go1.10.3.linux-amd64.tar.gz `

`export PATH=/usr/local/go/bin/:$PATH`

`echo $PATH`

```
//결과화면
/usr/local/go/bin/:/home/parallels/bin:/home/parallels/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```

`mkdir $HOME/go`

` export GOROOT=/usr/lib/go-1.10/`

```
v1.10.3 다운로드
https://golang.org/doc/install?download=go1.10.3.linux-amd64.tar.gz
//go v.1.10.3
```

✔️ **Node.js : 8.9.x 이상 > 8.10.0**

✔️ **Npm : 5.6.x 이상 > 5.6.0**

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

//Node.js v.8.16.1
//npm v.6.4.1
```

## 트랜잭션 흐름

### 트랜잭션

- 배포 트랜잭션(Deploy Transaction)
  - 새로운 체인코드를 생성하고 프로그램을 매개 변수로 사용한다.
  - 성공적으로 실행되면 체인코드가 블록체인 상에 설치 된다.
- 호출 트랜잭션(Invoke Transaction)
  - 이전에 배포된 체인코드의 컨텍스트에서 작업을 수행한다.
  - 호출 트랜잭션은 체인코드와 제공된 기능 중 하나를 참조한다.
  - 성공하면 체인코드는 지정된 함수를 실행하며, 이 함수는 해당 상태를 수정한다.

### Transaction Flow

![image](https://user-images.githubusercontent.com/43080040/64936813-ae250f80-d892-11e9-8dc0-298bea7b0956.png)

1. Hyperledger 패브릭 네트워크에서 트랜잭션은 트랜잭션 제안을 보내는 클라이언트 응용 프로그램에서 시작

   Endorsing Peers에게 트랜잭션을 제안하는 것

   클라이언트 응용 프로그램 -> 일반적으로 응용 프로그램 또는 클라이언트

   - 사람들이 블록체인 네트워크와 통신할 수 있도록 지원

2. 각 Endorsing Peer는 원장을 업데이트하지 않고 제안 된 트랜잭션을 시뮬레이션

   1) RW 세트라는 읽기 및 기록 된 데이터 세트를 수집

   2) RW 세트는 트랜잭션을 시뮬레이션(검증)하는 동안 현재 World State에서 읽은 내용과 트랜잭션이 실행 된 상태로 작성된 내용을 캡처

   3) 그런 다음 이 RW 세트는 Endorsing Peer에 의해 서명

   4) 클라이언트 응용 프로그램에 리턴 되어 트랜잭션 흐름의 다음 단계에서 사용

   - Endorsing Peer는 거래 제안을 시뮬레이션하기 위해 Smart Contract를 갖는다.

   - Transaction에 대한 보증이란 시뮬레이션된 트랜잭션의 결과에 대한 서명 된 응답
   - Transaction 보증 방법은 체인 코드가 배포 될 때 지정되는 보증 정책에 따라 다름
     - 보증 정책의 한 예가 "보증하는 동료의 대다수가 거래를 보증 해야 합니다."
     - 특정 체인 코드에 보증 정책이 지정 되었기 때문에 다른 채널은 다른 보증 정책을 가질 수 있음.

3. 응용 프로그램은 보증 된 트랜잭션과 RW 세트를 Ordering Service에 제출

   Ordering은 승인 된 트랜잭션 및 다른 응용 프로그램에서 제출 한 RW 세트와 함께 네트워크에서 발생

4. Ordering Service는 보증 된  트랜잭션과 RW 세트를 가져 온 다음, 이 정보를 블록으로 Ordering -> 다음 블록을 모든 Committing Peers에게 전달

   - Orderer 클러스터로 구성된 Ordering Service는 Transaction, Smart Contract 또는 공유 원장을 관리하지 않음.
   - Ordering Service는 승인 된 거래를 수락하고 이러한 거래가 원장에게 위탁되는 순서를 지정

5. 트랜잭션이 실패하면

   - Committing Peer가 RW 세트가 현재 World State와 일치하지 않는다는 것을 알게 되면 블록으로 정렬(Ordered)된 트랜잭션은 여전히 해당 블록에 포함되지만 유효하지 않은 것으로 표시
   - World State는 업데이트되지 않음
   - Committing Peers는 공유 된 원장에 트랜잭션 블록을 추가하고 World State를 업데이트 할 책임이 있음
     - Smart Contract을 가질 수 있지만 필수조건은 아님.

## Private Data

- 같은 채널의 다른 조직으로부터 데이터를 보호 (비공개)
- 별도의 채널을 생성할 경우 추가적인 관리 비용 발생
  - 체인코드 버전
  - 합의
  - MSP
- 채널의 모든 멤버에게 트랜잭션의 비밀로 유지 되어야 할 떄 => Channel
- PDC : Private Data Collections


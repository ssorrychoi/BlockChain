# Hyperledger Fabric

- Chaincode === Smart Contract

### Modularity

- Hyperledger Fabric은 모듈러 아키텍처를 갖도록 설계됨.
- ***모듈 구성 요소***
  - Transaction 순서에 대한 합의를 확림한 다음 블록을 Peer에게 Broadcast 한다.
  - **MSP(Membership Service Provider)**는 네트워크의 엔티티를 암호화 ID와 연관시키는 역할을 담당
  - Smart Contract는 Docker와 같은 Container 환경에서 실행된다.
  - **Ledger**(원장) 상태에 직접 Access 할 수는 없다.

### Permissioned & Permissionless Blockchains

- **Permissionless Blockchains**
  - 모든 참가자는 익명
  - 신뢰의 부재를 줄이기 위해 PoW를 기반으로 작업증명을 한다.
  - Byzantine Fault Tolerance의 형태로 참여하는 노드들에게 비용을 상쇄하기 위한 경제적 인센티브를 제공(Tx수수료)
- **Permission Blockchain**
  - 일정 수준의 신뢰를 갖는 거버넌스 모델로 운영됨
  - 확인된 참가자들만으로 구성
  - 공통의 목표를 가지고 있지만 서로를 완전히 신뢰하지 못하기 때문에 엔티티 그룹 간의 상호 작용을 보호하기 위한 방법을 제공
  - 값비싼 mining을 필요로 하지 않음
  - 미리 설정된 보증 정책(Endorsement에 따라 블록체인에 기록됨.

### Smart Contract

- Fabric에선 "**ChainCode**"라고 부름
- 신뢰할 수 있는 분산 응용 프로그램
  - *많은 스마트 컨트랙트가 네트워크에서 동시에 실행됨*
  - *동적으로 누군가에 의해 배치될 수 있다*
  - *유효성 검사 및 주문 트랜잭션은 모든 피어 노드에 트랜잭션을 전달한다*
  - *그런 다음 Peer는 트랜잭션을 순차적으로 실행한다.*
- Ordering 실행 아키텍처는 Ethereum과 같은 공공/무허가 플랫폼에서부터 모든 허가된 플랫폼에서 사용됨
- 모든 트랜잭션이 모든 노드에 의해 순차적으로 진행되므로 성능 및 규모가 제한된다.

### A New Approach

- Execute - Order - Validate 라고 하는 트랜잭션을 위한 새로운 아키텍처를 도입한 Fabric
- **Ordering 실행 모듈**
  - *거래를 실행하고 그 정확성을 확인하고 보증*
  - *합의 프로토콜을 통한 Ordering 거래 시스템*
  - *원장에게 commit하기 전에 애플리케이션 별 보증 정책에 대한 트랜잭션의 유효성을 검사*

### Privacy and Confidentiality

- Permissionless Blockchain에서는 모든 노드에서 트랜잭션이 실행됨
- 따라서 기밀성이 있을 수 없다.
- 비지니스/엔터프라이즈에서는 문제가 될 수 있다.(기밀성이 없다는 것이...)
- 허가된 플랜폼인 **Hyperledger Fabric**은 **기밀성**을 보장함
- Fabric 네트워크의 참가자는 특정 트랜잭션 집합에 대한 가시성을 부여해야 하는 참가자의 하위 집합 사이에 **Channel**을 설정할 수 있다.
- 채널에 참여하는 노드만 chaincode에 access할 수 있고 데이터가 처리되어 privacy와 기밀성이 유지됨

### Consensus

- 합의 : Ledger가 업데이트 될 때 동일한 순서로 동일한 트랜잭션으로 업데이트하는 것

### ChainCode









https://hyperledger-fabric.readthedocs.io/en/release-1.4/peers/peers.html
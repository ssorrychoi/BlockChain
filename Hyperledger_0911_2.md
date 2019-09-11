---
layout: post
title: Hyperledger Fabric_1.2
subtitle: 블록체인 2.0 및 활용 서비스 소개
categories: [Hyperledger Fabric]
tags: [Hyperledger Fabric,Smart contract]
comments: true

---

20190911

## Hyperledger Fabric

## 하이퍼레저 프로젝트

- 리눅스 재단에서 주도하는 블록체인 프로젝트
- 현재 14가지 블록체인 관련 프로젝트 진행중
  - 6개 Framework
  - 8개의 Tools
- 산업계를 위한 블록체인 기술 개발을 위한 글로벌 협업 프로젝트
- 목표 : 기업용 블록체인 기술 생태계 구축

### 하이퍼레저 Sawtooth

- Intel의 'Intel Distrubuted Ledger'기반
- poET(Proof of Elapsed Time) 기반의 컨센서스
- 허가형과 참여형 모두 지원
- 병렬 처리 지원
- 높은 확장성과 모듈화 추구
- Apache 2.0 License 정책을 따름

### 하이퍼레저 Iroha

- 간편한 자산 생성/관리를 위한 블록체인
- Soramitsu, Hitachi, NTT데이타, 콜루 등 기여
- C++ 사용자를 위한 개발 환경
- 모바일과 웹을 위한 인프라 제공
- YAC(Yet Another Consensus) 컨센서스 알고리즘 : 블록해시에 대한 투표
- Apache 2.0 License 정책을 따름

### 하이퍼레저 Fabric

- 모듈화 된 블록체인 엔진
- 가장 활발하게 활동 중
- 초기 IBM이 제공한 코드를 기반으로 현재 30여 조직에서 개발 참여 중
- 모바일과 웹을 위한 인프라 제공
- MSP(Membership Service Provider) 기반의 Identity 관리와 접근 허가
- 블록체인 원장(ledger)과 현재 상태를 나타내는 World State 보관
- Apache 2.0 License 정책을 따름

### 하이퍼레저 Burrow

- 이더리움 Dapp지원 프레임워크
- 모낙스(Monax)가 제안하여 Intel이 공동 지원
- 이더리움 프로그램을 하이퍼레저에서도 동작할 수 있도록 지원
- 이더리움 진영과 하이퍼레저 진영에 공존하는 프로젝트
- Apache 2.0 License 정책을 따름

### 하이퍼레저 Indy

- 분산 신원 증명 프레임워크
- 자주적인 신원 증명 생태계 프레임워크
- Sovrin Foundation이 주도
- Sovrin Foundation
  - 인터넷 환경에서의 신원을 제공하는 플랫폼
  - 변조가 어려운 블록체인 네트워크로 인터넷에 신원 계층 추가
  - 현재 베타 상태로, IBM의 직원 ID 인증을 시범 운영중

### 하이퍼레저 Grid

- 공급망 솔루션 구축 프레임워크
- 공급망 솔루션 구축을 위한 WebAssembly 기반 프로젝트
- 공급망 스마트 컨트랙트
- 클라이언트 인터페이스 라이브러리
- 데이터 모델 및 SDK
- Apache 2.0 License 정책을 따름



### 하이퍼레저 Explorer 

- 모니터링 툴
- 블록체인 애플리케이션 모니터링을 위한 오픈소스 브라우저
- 블록 / 트랜잭션 / 체인코드 / 노드 / 채널 등에 대한 모니터링
- IBM과 DTCC이 주도
- 하이퍼레저  Fabric1.0 지원
-  Apache 2.0 License 정책을 따름

### 하이퍼레저 Composer

- 개발 프레임워크
- 블록체인 애플리케이션 개발을 위한 협업 프레임워크
- Javascript 기반
- Apache 2.0 License 정책을 따름

### 하이퍼레저 Caliper

- 성능 측정 툴
- 블록체인 성능 테스트 툴
- 성공률, 처리량, 트랜잭션 지연(min,max,...), 자원사용(CPU,memory,...) 제공
- Apache 2.0 License 정책을 따름

### 하이퍼레저 Cello

- 블록체인 운영 관리 툴
- 베어메탈, VM, 컨테이너 상의 블록체인 관리를 위한 툴
- 대시보드를 통한 시스템 상태를 확인하고, 자원 확장 등 지원
- Apache 2.0 License 정책을 따름

### 하이퍼레저 Quilt

- ILP 구현으로 블록체인간 상호 운용성 제공
- 분산원장과 기존 원장을 포함한 네트워크 상의 가치 이전 지원
- 기본적으로 지불(payment)기능 제공 예정
- Quilt - Java기반,  Interledger.js - Javascript 기반
- Apache 2.0 License 정책을 따름



### 블록체인 적용 시 고려사항

- 공유 된 공통 데이터베이스가 필요
- 비지니스 프로세스의 데이터가 각 프로세스에 따라 여러 데이터베이스에 입력
  - 데이터가 모든 엔티티에서 일관성을 유지
- 분산 원장 및 처리에 의해 공동 시스템 사용이 불필요함으로, 비용절감 효과가 기대
- 일부 노드가 정지하고 있어도 처리가 계속 있기 때문에 안정한 시스템을 구축 가능
- 각 노드 사이에서 동일한 비즈니스 로직, 데이터 공유, 위변조 할 수 없는 상태에서 거래기록이 유지
- 트랜잭션 빈도는 초당 10,000 트랜잭션을 초과하지 않음

### Hyperledger Fabric 특징

- Configurable Module 구조
  - 많은 컴포넌트와 정책들이 있으며, 그 모든게 '조립식'으로 원하는 비즈니스 모델에 맞게 선택할 수 있음
- 일반개발 언어 사용 가능
  - golang, node.js, java 등을 지원
- Execute-Order-Validate 아키텍처
  - 일반적으로 Execute-validate 처리하는데 반하여  order 단계가 추가되어 있음
- 데이터 기밀을 위한 채널

### 용어

- Transactor : 트랜잭션을 일으키는 엔티티
- Transaction : 블록체인 네트워크에 대해서 비지니스 로직을 수행하기 위한 요청
- Ledger : 원장. 
-  Validating peer (VP) : 블록체인 네트워크에서 원장을 관리 유지하기 위해 트랜잭션의 유효성을 검증하는 합의 프로토콜을 실행하는 노드
- Non-validating peer(NVP) :  TransactorRK Validating peer에 접속 할 수 있도록 프록시 역할을 하는 노드
- [https://yoondoyeon.tistory.com/entry/Hyperledger-Fabric-%EB%B8%94%EB%A1%9D%EC%B2%B4%EC%9D%B8-%EA%B4%80%EB%A0%A8-%EC%9A%A9%EC%96%B4-%EC%A0%95%EB%A6%AC](https://yoondoyeon.tistory.com/entry/Hyperledger-Fabric-블록체인-관련-용어-정리)

### Architecture

![image](https://user-images.githubusercontent.com/43080040/64674388-b6083c80-d4ab-11e9-9496-6859dc6900bc.png)

[https://developer.ibm.com/kr/developer-%EA%B8%B0%EC%88%A0-%ED%8F%AC%EB%9F%BC/2017/03/09/hyperledger_fabric_v1_architecture/](https://developer.ibm.com/kr/developer-기술-포럼/2017/03/09/hyperledger_fabric_v1_architecture/)

### Component - 클라이언트 앱

- 모든 클라이언트는 패브링 SDK를 사용하 Peer에 Proposal을 전송
- 채널을 통해 하나 이상의 Peer와 Orderer에 접속
- Peer로 부터 이벤트 수신

### Component - 채널

- 서로 다른 원장 간의 프라이버시 데이터를 유지
- 원장은 채널 범위로 한정
- 체인코드는 Peer에서 사용될 수 있도록 인스턴스화 됨
- Peer는 여러 채널에 참여 할 수 있음
- 구성원(조직), 구성원 당 앵커 피어, 공유 원장, 체인코드 응용 프로그램 및 주문 서비스 노드(들) 에 의해 정의됨
- 네트워크 상의 각 트랜잭션은 채널에서 실행되며, 각 당사자는 인증되고 해당 채널에서 거래할 권한이 있어야 함.

### Peer(피어), Organization(조직)

- 블록체인 네트워크는 단일 조직 보다 조직 집합에 의해서 관리됨
- 앵커피어(Anchor peer) : 조직 간 통신역할을 담당하는 피어

### Component - Peer(피어)

- 한 개 이상의 채널에 연결됨
- 각 채널에 대해서 한 개 이상의 원장을 관리
- 체인코드는 Docker Container로 분리되어 인스턴스화 됨
- 체인코드는 채널을 통해 공유 됨.
- Local MSP(Membership Services Provider)는 암호화 방식을 제공
- 피어는 보증인 역할 수행
- 클라이언트 어플리케이션에 이벤트 전달
- 트랜잭션을 실행
- 원장 상태 업데이트
- State 유지 관리

### Component - Fabric CA

- 패브릭 네트워크에서 Everts를 발행하는 컴포넌트
- Certificate Authority
- HA를 위한 클러스터링 지원
- 사용자 인증을 위한 LDAP 지원
- 보안을 위한 HSM 지원
- Intermediate CA를 위한 설정 가능

### Component - 오더링 서비스(Ordering Service)

- 트랜잭션들의 순서를 정렬하여 블록으로 패키징 후 Peer(Committer)에게 전달하는 역할
- 채널을 통해 Ordering Service와 통신


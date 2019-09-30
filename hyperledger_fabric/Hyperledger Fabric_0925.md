---
layout: post
title: Hyperledger Fabric_8
subtitle: 
categories: [Hyperledger Fabric]
tags: [Hyperledger Fabric,Smart contract]
comments: true

---

20190925

## SDK for Node.js 

### 개요

- Hyperledger fabric SDK for Node.js 는 두개의 모듈로 구성
  - fabric-client : API를 제공 -> gRPC 프로토콜로 통신
  - Fabric-ca-client : MSP 클라이언트 용 API를 제공 -> HTTPS(REST)로 통신

### SDK for Node.js 체인코드 호출 시 처리 흐름

- 초기화처리 : 채널, 조직/피어, 오더러, MSP, EventHub 설정
- 사용자 설정 : MSP 등록과 컨텍스트 설정
- 체인코드 호출 : 조회/갱신 요청 발행
- 이벤트 결과 수신

### 체인코드 호출의 두가지 유형

- 조회(Query) : 동기적으로 실행됨, return 조회결과
- 갱신(Invoke) : 합의 처리가 필요하기 때문에 비동기적으로 실행됨, 갱신 결과를 받기 위해 이벤트 구조를 이용함


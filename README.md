# Equipment Monitor

React 기반 장비 가동률 모니터링 관리자 화면

> 기존 Vue.js 실무 프로젝트를 React + TypeScript 환경으로 재구현한 프로젝트

---

## Preview

### Dashboard

- 장비별 가동 상태 및 가동률 확인
- 카카오맵 기반 장비 위치 표시
- 장비 상태에 따른 마커 색상 변경
- 장비 클릭 시 상세 정보 확인

### Equipment Detail

- 장비별 일일 상태 정보 확인
- 연료 및 온도 정보 표시
- 가동시간 및 가동률 확인
- 기간별 가동 이력 조회
- 가동시간 데이터 엑셀 다운로드

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### UI

- shadcn/ui
- Radix UI

### Data Visualization

- Recharts

### Map

- Kakao Maps API

### Data / Utility

- Mock Data
- ExcelJS

---

## 주요 기능

### 1. 장비 모니터링

장비 데이터를 기반으로 현재 상태와 위치를 지도에서 확인할 수 있음.

- 지게차 / 고소차 구분
- 장비 상태별 마커 표시
- 장비 위치 기반 마커 렌더링
- 장비 마커 클릭 시 상세 정보 표시
- 지도 영역 외부 클릭 시 팝업 닫기
- 팝업이 지도 영역을 벗어나지 않도록 위치 보정

### 2. 장비 상세 정보

장비별 상세 정보를 팝업 형태로 제공.

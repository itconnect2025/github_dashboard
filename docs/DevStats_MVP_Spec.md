# DevStats MVP 사양서

## 프로젝트 개요
**목표**: 단일 사용자가 자신의 GitHub 활동을 분석하고 가치를 느끼게 하는 가장 단순한 도구

**사용자**: 1명 (본인)
**단계**: MVP (Minimum Viable Product)

---

## 핵심 기능

### 1. GitHub API 연동
- 개인 GitHub 계정 연동
- 리포지토리 목록 조회
- 커밋 및 PR 데이터 수집

### 2. 커밋 통계 분석
- 일별 커밋 수
- 주별 커밋 수
- 월별 커밋 수
- 커밋 시간대 분포

### 3. Pull Request 분석
- PR 생성 시간
- PR 완료 시간
- 평균 처리 시간
- 상태별 PR 수 (Open/Closed/Merged)

### 4. 코드 리뷰 현황
- 리뷰한 PR 수
- 받은 리뷰 수
- 평균 리뷰 응답 시간

### 5. 대시보드
- 간단한 차트 시각화 (막대, 선, 파이)
- 주요 지표 요약 카드
- 기간 필터 (7일/30일/90일)

---

## 기술 스택

### Backend
- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite
- **GitHub API**: Octokit (@octokit/rest)
- **Scheduler**: node-cron
- **Date Library**: date-fns

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Charts**: Chart.js
- **HTTP Client**: SWR 또는 fetch
- **Routing**: React Router (단순 페이지)

### DevOps
- **Container**: Docker + Docker Compose
- **Environment**: .env 파일
- **배포**: 로컬 실행

---

## 아키텍처

```
┌─────────────────┐
│  Frontend       │
│  (React + Vite) │
└────────┬────────┘
         │ HTTP REST API
         ↓
┌─────────────────┐
│  Backend        │
│  (Express.js)   │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ↓          ↓
┌────────┐  ┌──────────┐
│ SQLite │  │ GitHub   │
│  DB    │  │   API    │
└────────┘  └──────────┘
              ↑
              │ Cron (1시간마다)
```

---

## 데이터 수집 전략
- **주기**: 1시간마다 자동 수집 (node-cron)
- **방식**: GitHub API polling
- **저장**: SQLite에 증분 저장
- **실시간 업데이트**: ❌ (제거됨)

---

## 제거된 기능 (MVP 이후로 연기)

| 기능 | 이유 |
|------|------|
| 실시간 데이터 업데이트 (WebSocket) | MVP에 과도한 복잡도 |
| 팀별 기여도 시각화 | 단일 사용자에게 불필요 |
| 이메일 알림 | 핵심 가치와 무관 |
| PostgreSQL | SQLite로 충분 |
| 확장 가능한 복잡한 아키텍처 | YAGNI 원칙 위반 |

---

## 프로젝트 구조

```
devstats/
├── backend/
│   ├── src/
│   │   ├── routes/          # API 라우트
│   │   ├── services/        # GitHub API, 데이터 수집
│   │   ├── models/          # DB 모델
│   │   ├── cron/            # 스케줄러
│   │   └── server.ts        # 진입점
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── pages/           # 페이지
│   │   ├── hooks/           # 커스텀 훅
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

---

## API 엔드포인트 (초안)

### 통계 API
- `GET /api/stats/commits?period=7d` - 커밋 통계
- `GET /api/stats/prs?period=30d` - PR 통계
- `GET /api/stats/reviews?period=90d` - 리뷰 통계
- `GET /api/stats/summary` - 전체 요약

### 설정 API
- `GET /api/config` - 현재 설정
- `POST /api/config` - 설정 업데이트
- `POST /api/sync` - 수동 데이터 동기화

---

## 데이터베이스 스키마 (초안)

### commits 테이블
```sql
CREATE TABLE commits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sha TEXT UNIQUE NOT NULL,
  message TEXT,
  author TEXT,
  committed_at DATETIME,
  repo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### pull_requests 테이블
```sql
CREATE TABLE pull_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pr_number INTEGER,
  title TEXT,
  state TEXT,
  created_at DATETIME,
  merged_at DATETIME,
  closed_at DATETIME,
  repo TEXT,
  author TEXT
);
```

### reviews 테이블
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pr_number INTEGER,
  reviewer TEXT,
  state TEXT,
  submitted_at DATETIME,
  repo TEXT
);
```

---

## 개발 로드맵

### Phase 1: 기본 인프라 (1주)
- [ ] 프로젝트 초기화 (monorepo 또는 별도 repo)
- [ ] Docker 환경 설정
- [ ] Backend: Express + TypeScript 설정
- [ ] Frontend: React + Vite 설정
- [ ] SQLite 연결

### Phase 2: GitHub 연동 (1주)
- [ ] Octokit 설정
- [ ] GitHub OAuth 또는 Personal Access Token
- [ ] 커밋 데이터 수집 API
- [ ] PR 데이터 수집 API
- [ ] Cron 스케줄러 구현

### Phase 3: 데이터 시각화 (1주)
- [ ] 대시보드 레이아웃
- [ ] 커밋 차트 (Chart.js)
- [ ] PR 차트
- [ ] 요약 카드 컴포넌트
- [ ] 기간 필터

### Phase 4: 테스트 및 개선 (1주)
- [ ] 실제 데이터로 테스트
- [ ] UX 개선
- [ ] 에러 핸들링
- [ ] 문서 작성

---

## 환경 변수

```env
# Backend
GITHUB_TOKEN=your_personal_access_token
GITHUB_USERNAME=your_username
PORT=3000
DATABASE_PATH=./data/devstats.db

# Frontend
VITE_API_URL=http://localhost:3000
```

---

## 성공 지표 (MVP)
1. ✅ GitHub 데이터를 성공적으로 수집
2. ✅ 최소 3가지 차트 시각화
3. ✅ 1시간마다 자동 업데이트
4. ✅ 사용자가 본인의 개발 패턴을 파악할 수 있음

---

## Next Steps (MVP 이후)
- 여러 GitHub 계정 지원
- 팀/조직 통계
- 이메일/Slack 알림
- 목표 설정 및 추적
- 실시간 업데이트
- PostgreSQL 마이그레이션 (필요시)
- 배포 (Vercel, Railway, etc.)

---

**최종 검증**: Vibe Check ✅
**상태**: 승인됨
**다음 단계**: Linear에 Epic/Story/Task 등록

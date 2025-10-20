# DevStats - GitHub Development Statistics Dashboard

GitHub 활동을 분석하고 시각화하는 개발 통계 대시보드

## 프로젝트 개요

DevStats는 GitHub API를 활용하여 개인 개발자의 커밋, Pull Request, 코드 리뷰 활동을 수집하고 시각화하는 MVP(Minimum Viable Product) 도구입니다.

### 주요 기능

- ✅ GitHub API 연동
- ✅ 커밋 통계 분석 (일별/주별/월별)
- ✅ Pull Request 분석
- ✅ 코드 리뷰 현황 대시보드
- ✅ 간단한 차트 시각화
- ✅ 1시간마다 자동 데이터 수집

## 기술 스택

### Backend
- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **GitHub API**: Octokit (@octokit/rest)
- **Scheduler**: node-cron
- **Date Library**: date-fns

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Charts**: Chart.js
- **HTTP Client**: SWR 또는 fetch
- **Routing**: React Router

### DevOps
- **Container**: Docker + Docker Compose
- **Environment**: .env 파일

## 프로젝트 구조

```
github_dashboard/
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
├── docs/
│   ├── DevStats_MVP_Spec.md
│   └── DevStats_Linear_Summary.md
├── docker-compose.yml
└── README.md
```

## 시작하기

### 사전 요구사항

- Node.js 20+
- Docker & Docker Compose (선택사항)
- GitHub Personal Access Token

### 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성하고 필요한 값을 입력합니다:

```bash
# Backend
GITHUB_TOKEN=your_personal_access_token
GITHUB_USERNAME=your_username
PORT=3000
DATABASE_PATH=./data/devstats.db

# Frontend
VITE_API_URL=http://localhost:3000
```

### GitHub Personal Access Token 발급

1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. 필요한 권한 선택:
   - `repo` (모든 하위 항목)
   - `read:user`
4. 토큰 생성 후 `.env` 파일에 저장

### 로컬 개발 환경 실행

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker로 실행

```bash
docker-compose up
```

## API 엔드포인트

### 통계 API
- `GET /api/stats/commits?period=7d` - 커밋 통계
- `GET /api/stats/prs?period=30d` - PR 통계
- `GET /api/stats/reviews?period=90d` - 리뷰 통계
- `GET /api/stats/summary` - 전체 요약

### 설정 API
- `GET /api/config` - 현재 설정
- `POST /api/config` - 설정 업데이트
- `POST /api/sync` - 수동 데이터 동기화
- `GET /api/health` - 서버 상태 확인

## 개발 로드맵

프로젝트는 4개의 Phase로 구성됩니다:

### Phase 1: 기본 인프라 구축 (1주)
- [x] 프로젝트 초기화
- [ ] Docker 환경 설정
- [ ] Backend 기본 설정
- [ ] Frontend 기본 설정
- [ ] SQLite 연결

### Phase 2: GitHub 연동 (1주)
- [ ] Octokit 설정
- [ ] 커밋 데이터 수집
- [ ] PR 데이터 수집
- [ ] 리뷰 데이터 수집
- [ ] Cron 스케줄러

### Phase 3: 데이터 시각화 (1주)
- [ ] 대시보드 레이아웃
- [ ] 커밋 차트
- [ ] PR 차트
- [ ] 리뷰 차트
- [ ] 기간 필터

### Phase 4: 테스트 및 개선 (1주)
- [ ] 통합 테스트
- [ ] UX/UI 개선
- [ ] 에러 핸들링
- [ ] 성능 최적화
- [ ] 문서 작성

자세한 내용은 [Linear 프로젝트](https://linear.app/itconnect-dev/project/devstats-e5750329c2b7)를 참조하세요.

## 문서

- [MVP 사양서](./docs/DevStats_MVP_Spec.md)
- [Linear 프로젝트 요약](./docs/DevStats_Linear_Summary.md)

## 라이선스

MIT

## 기여

이 프로젝트는 MVP 단계입니다. 기여를 환영합니다!

## 문의

프로젝트 관련 문의는 Issues를 통해 남겨주세요.

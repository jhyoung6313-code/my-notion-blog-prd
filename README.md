# Fullstack Starter Kit

업무용으로 반복해서 쓰는 풀스택 구성을 그대로 담은 개인 Starter Kit입니다.
새 프로젝트를 시작할 때 인증·라우팅·에러 처리 같은 보일러플레이트를 다시 짜지 않고 바로 기능 개발에 들어갈 수 있습니다.

> 📄 **기획 문서**: 이 Starter Kit를 기반으로 한 Notion CMS 프로젝트 기획서가 [docs/PRD.md](docs/PRD.md)에 있습니다. (개인 개발 블로그 — Next.js 15 + Notion API)

## 기술 스택

| 영역 | 스택 |
|------|------|
| 프론트엔드 | Vite + React 18 + React Router v6 + Zustand + Ant Design 5 + axios + dayjs |
| 백엔드 | Express 4 + Prisma 5 (PostgreSQL) + JWT(jsonwebtoken) + bcrypt |
| 공통 | dotenv 환경 변수, CORS, express-rate-limit |

## 포함된 기능 (3번 이상 반복해서 쓴 것만 담음)

- **JWT 인증 플로우**: 회원가입 / 로그인 / `GET /me`, bcrypt 비밀번호 해싱
- **인증 미들웨어**: `authenticate`가 `req.user` 주입, `adminOnly`로 역할 기반 접근 제어
- **글로벌 에러 핸들러**: `ApiError` + `asyncHandler`로 try/catch 없이 일관된 에러 응답 (개발/운영 분리)
- **Rate Limiting**: 로그인 전용 + 전체 API 제한 (개발 환경에서는 자동 비활성화)
- **헬스체크 엔드포인트**: `/health` (Docker / 로드밸런서용)
- **프론트 axios 인터셉터**: 토큰 자동 첨부 + 401 시 로그인 페이지로 리다이렉트
- **Zustand 전역 상태**: 인증 스토어, 다크모드 스토어(localStorage 영속화)
- **보호 라우트**: `ProtectedRoute`로 미인증 사용자 차단, `ErrorBoundary` 폴백 UI
- **Ant Design 테마**: 한국어 로케일 + 다크/라이트 토글 + 공통 레이아웃(사이드바/헤더)

## 디렉터리 구조

```
fullstack-starter-kit/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # User 모델 (Role enum 포함)
│   │   └── seed.js            # 초기 관리자 계정 시드
│   └── src/
│       ├── app.js             # 앱 진입점 (미들웨어·에러핸들러·헬스체크)
│       ├── lib/prisma.js      # Prisma 클라이언트 싱글턴
│       ├── middlewares/       # auth, adminOnly
│       ├── utils/             # ApiError, asyncHandler
│       ├── controllers/       # authController, userController
│       └── routes/            # index, auth, users
└── frontend/
    └── src/
        ├── main.jsx           # ConfigProvider + 라우터 부트스트랩
        ├── App.jsx            # 라우트 정의
        ├── api/               # axios 인스턴스 + 도메인별 API 모듈
        ├── store/             # authStore, themeStore (Zustand)
        ├── components/        # ErrorBoundary, ProtectedRoute
        ├── layouts/           # MainLayout
        └── pages/             # LoginPage, DashboardPage
```

## 빠른 시작

### 1. 백엔드

```bash
cd backend
cp .env.example .env          # DATABASE_URL, JWT_SECRET 값 채우기
npm install
npm run generate              # prisma client 생성
npm run migrate               # DB 마이그레이션
npm run seed                  # 관리자 계정 생성 (admin / admin1234)
npm run dev                   # http://localhost:4000
```

### 2. 프론트엔드

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

`vite.config.js`의 프록시 설정으로 프론트의 `/api` 요청이 백엔드(4000)로 전달됩니다.
초기 계정 **admin / admin1234** 로 로그인하면 대시보드로 진입합니다.

## 새 기능 추가 패턴

1. `backend/prisma/schema.prisma`에 모델 추가 → `npm run migrate`
2. `controllers/`에 `asyncHandler`로 감싼 핸들러 작성 (검증 실패 시 `throw new ApiError(...)`)
3. `routes/`에 라우터 추가 후 `routes/index.js`에 등록
4. 프론트는 `api/`에 도메인 모듈 추가 → 페이지/스토어에서 호출

## 커스텀 슬래시 커맨드 (Claude Code)

`.claude/commands/`에 자주 하는 작업을 슬래시 커맨드로 정의해 두었습니다.

| 커맨드 | 인자 | 하는 일 |
|--------|------|---------|
| `/add-api` | `[리소스명]` | 백엔드 컨트롤러+라우트(CRUD)를 키트 컨벤션대로 생성·등록 |
| `/add-page` | `[페이지명] [경로]` | 프론트 페이지 생성 + 보호 라우트 + 사이드 메뉴 등록 |
| `/add-component` | `[컴포넌트명]` | 프론트 AntD 재사용 컴포넌트 골격 생성 |

예: `/add-api product`, `/add-page Settings /settings`, `/add-component UserCard`

## 서브에이전트 (Claude Code)

`.claude/agents/`에 작업별 전문 서브에이전트를 정의해 두었습니다. 각 에이전트는 독립된 컨텍스트에서 동작하며 사용 도구가 제한됩니다.

| 에이전트 | 도구 | 역할 |
|----------|------|------|
| `code-reviewer` | Read, Grep, Glob, Bash | 키트 컨벤션 기준으로 변경분을 검토 (읽기 전용, 심각도별 제안) |
| `security-checker` | Read, Grep, Glob, Bash | 인증·토큰·시크릿 노출·입력 검증 등 보안 취약점 진단 |
| `debugger` | Read, Grep, Glob, Bash, Edit | 에러 원인 분석 후 최소 수정으로 해결 |

`/agents` 명령으로 목록을 확인하거나, 상황에 맞으면 자동으로 위임됩니다.

## 훅 (Claude Code Hooks)

`.claude/settings.json`에 프로젝트 전용 자동화 훅을 정의해 두었습니다. 특정 이벤트마다 항상 자동 실행됩니다. 외부 의존성 없이 프로젝트 런타임인 **Node**로만 동작합니다.

| 이벤트 | 매처 | 스크립트 | 하는 일 |
|--------|------|----------|---------|
| PreToolUse | `Edit\|Write` | `protect-env.js` | `.env` 등 시크릿 파일 직접 수정 차단 (`.env.example`은 허용) |
| PreToolUse | `Bash` | `block-dangerous-bash.js` | `rm -rf`·`sudo`·`git push --force`·`dd` 등 위험 명령 차단 |
| PostToolUse | `Edit\|Write` | `log-edits.js` | 수정한 파일 경로를 `.claude/edit-log.txt`에 타임스탬프와 함께 기록 |

차단 훅은 exit code 2로 도구 호출을 막고 그 이유를 Claude에게 전달합니다. 로그 파일(`edit-log.txt`)은 `.gitignore`로 제외됩니다.

## MCP Server (Claude Code)

프로젝트 루트의 `.mcp.json`에 프로젝트 스코프 MCP 서버를 정의해 두었습니다. 저장소를 clone 한 누구나 동일한 외부 도구 연결을 그대로 사용합니다.

| 서버 | 전송 | 용도 |
|------|------|------|
| `context7` | http | Prisma·Express·React·Ant Design 등 라이브러리의 **최신 공식 문서** 실시간 검색 (버전 혼동 방지) |
| `sequential-thinking` | stdio | 복잡한 설계·디버깅을 단계별로 분해해 추론 |
| `playwright` | stdio | React 프론트엔드 **E2E 테스트 / 브라우저 자동화·스크린샷** |

`/mcp` 명령으로 연결 상태를 확인할 수 있습니다. stdio 서버는 첫 실행 시 `npx`로 자동 설치됩니다.

## 라이선스

개인 학습·프로토타이핑용 템플릿입니다.

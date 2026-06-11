---
argument-hint: [리소스명(단수, 예: product)]
description: 백엔드에 새 REST API 리소스(컨트롤러 + 라우트)를 키트 컨벤션대로 생성하고 등록한다
---

`$1` 리소스에 대한 새 REST API를 이 프로젝트의 컨벤션에 맞춰 추가해줘.

대상은 백엔드(`backend/src/`)이며 기존 코드 스타일을 그대로 따른다.

## 작업

1. **컨트롤러 생성** — `backend/src/controllers/$1Controller.js`
   - `prisma`(`../lib/prisma`), `asyncHandler`(`../utils/asyncHandler`), `ApiError`(`../utils/ApiError`)를 import 한다.
   - 모든 핸들러는 `asyncHandler`로 감싸고, 검증 실패 시 `throw new ApiError(상태코드, '한국어 메시지')`를 사용한다(try/catch 금지).
   - 기본 CRUD 5종을 만든다: `list`, `getOne`, `create`, `update`, `remove`.
   - 응답에 노출할 필드는 파일 상단에 `PUBLIC_$1_SELECT` 상수로 정의한다.
   - `404`(없는 리소스), `400`(필수 값 누락)을 적절히 처리한다.

2. **라우트 생성** — `backend/src/routes/$1s.js`
   - `express.Router()`를 사용하고, 모든 라우트에 `authenticate` 미들웨어를 적용한다.
   - 쓰기 작업(`create`/`update`/`remove`)이 관리자 전용이어야 하는지 나에게 물어보고, 필요하면 `adminOnly`를 추가한다.
   - 표준 매핑: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`.

3. **라우트 등록** — `backend/src/routes/index.js`에 `router.use('/$1s', $1Routes)` 한 줄을 추가한다.

4. **Prisma 모델 확인** — `backend/prisma/schema.prisma`에 `$1` 모델이 없으면, 어떤 필드가 필요한지 나에게 묻고 모델을 추가한 뒤 `npm run migrate` 명령을 안내한다.

## 규칙
- 들여쓰기 2칸, camelCase 함수명, 상수는 UPPER_SNAKE_CASE.
- 주석과 에러 메시지는 한국어로, 기존 파일과 같은 밀도로 작성한다.
- 요청하지 않은 다른 파일은 건드리지 않는다.

작업 전에 `backend/src/controllers/userController.js`와 `backend/src/routes/users.js`를 먼저 읽어 패턴을 그대로 맞춰줘.

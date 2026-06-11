---
argument-hint: [페이지명(PascalCase, 예: Settings)] [경로(예: /settings)]
description: 프론트엔드에 새 페이지 컴포넌트를 만들고 보호 라우트와 사이드 메뉴에 등록한다
---

`$1` 페이지를 이 프로젝트의 프론트엔드 컨벤션에 맞춰 추가해줘. 라우트 경로는 `$2`.

## 작업

1. **페이지 생성** — `frontend/src/pages/$1Page.jsx`
   - Ant Design 컴포넌트(`Card` 등)를 사용한 함수형 컴포넌트 기본 골격을 만든다.
   - 사용자 정보가 필요하면 `useAuthStore`(`../store/authStore`)에서 selector로 가져온다.
   - `export default $1Page;`로 끝낸다.

2. **라우트 등록** — `frontend/src/App.jsx`
   - 새 페이지를 import 하고, `MainLayout`을 감싸는 보호 라우트 그룹(`ProtectedRoute`) 안에 `<Route path="$2" element={<$1Page />} />`를 추가한다.
   - 공개 페이지여야 하면(로그인 불필요) 나에게 확인한 뒤 보호 그룹 밖에 등록한다.

3. **사이드 메뉴 추가** — `frontend/src/layouts/MainLayout.jsx`
   - `MENU_ITEMS` 배열에 `{ key: '$2', icon: <적절한 AntD 아이콘>, label: '한국어 메뉴명' }`을 추가한다.
   - 어울리는 `@ant-design/icons` 아이콘을 골라 import 한다.

## 규칙
- 들여쓰기 2칸, 컴포넌트명 PascalCase.
- 메뉴 라벨·주석은 한국어로.
- 작업 전에 `frontend/src/pages/DashboardPage.jsx`, `frontend/src/App.jsx`, `frontend/src/layouts/MainLayout.jsx`를 읽어 기존 패턴을 그대로 따라줘.

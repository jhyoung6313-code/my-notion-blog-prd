---
argument-hint: [컴포넌트명(PascalCase, 예: UserCard)]
description: 프론트엔드 components 폴더에 Ant Design 기반 재사용 컴포넌트 골격을 생성한다
---

`$1` 재사용 컴포넌트를 `frontend/src/components/$1.jsx`에 생성해줘.

## 작업
- Ant Design 컴포넌트를 활용한 함수형 컴포넌트 기본 골격을 만든다.
- props는 구조분해로 받고, 어떤 props가 필요한지 모르면 흔한 기본형(`title`, `children`, `onClick` 등)으로 시작한 뒤 주석으로 표시한다.
- 컴포넌트 상단에 한 줄짜리 한국어 설명 주석을 단다.
- `export default $1;`로 끝낸다.

## 규칙
- 들여쓰기 2칸, 컴포넌트명 PascalCase, 매직 넘버·문자열은 의미 있는 상수로.
- 기존 컴포넌트(`frontend/src/components/ProtectedRoute.jsx`, `ErrorBoundary.jsx`)와 같은 스타일·주석 밀도를 따른다.
- 요청하지 않은 다른 파일은 수정하지 않는다.

생성 후, 이 컴포넌트를 어디서 import 해 쓰면 되는지 한 줄로 안내해줘.

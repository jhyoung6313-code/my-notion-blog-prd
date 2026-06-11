// 상태 코드를 가진 에러 — 글로벌 에러 핸들러가 err.status를 읽어 응답한다.
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

module.exports = ApiError;

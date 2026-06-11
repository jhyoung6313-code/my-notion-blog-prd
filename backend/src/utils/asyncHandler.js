// async 컨트롤러의 reject를 next로 흘려보내 글로벌 에러 핸들러로 위임한다.
// 모든 컨트롤러를 try/catch로 감싸지 않아도 되게 해준다.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

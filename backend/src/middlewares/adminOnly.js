// authenticate 이후에 사용한다. admin 역할만 통과시킨다.
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
  }
  next();
};

module.exports = { adminOnly };

const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Bearer 토큰을 검증하고 req.user에 현재 사용자 정보를 주입한다.
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, displayName: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: '유효하지 않은 계정입니다.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: '토큰이 유효하지 않거나 만료되었습니다.' });
  }
};

module.exports = { authenticate };

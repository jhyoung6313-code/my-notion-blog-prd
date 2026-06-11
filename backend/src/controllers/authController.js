const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const BCRYPT_ROUNDS = 10;
const DEFAULT_JWT_EXPIRES_IN = '7d';

// 로그인 응답에 노출할 사용자 필드
const PUBLIC_USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  role: true,
};

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN,
  });

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password || !displayName) {
    throw new ApiError(400, 'username, password, displayName는 필수입니다.');
  }

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    throw new ApiError(409, '이미 사용 중인 아이디입니다.');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { username, passwordHash, displayName },
    select: PUBLIC_USER_SELECT,
  });

  res.status(201).json({ token: signToken(user.id), user });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, '아이디와 비밀번호를 입력해주세요.');
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.isActive) {
    throw new ApiError(401, '아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  const matched = await bcrypt.compare(password, user.passwordHash);
  if (!matched) {
    throw new ApiError(401, '아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  res.json({
    token: signToken(user.id),
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    },
  });
});

// GET /api/auth/me  (authenticate 미들웨어 통과 후)
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, getMe };

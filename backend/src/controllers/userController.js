const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const PUBLIC_USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  role: true,
  isActive: true,
  createdAt: true,
};

// GET /api/users  (admin 전용)
const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: PUBLIC_USER_SELECT,
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

// GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: PUBLIC_USER_SELECT,
  });
  if (!user) {
    throw new ApiError(404, '사용자를 찾을 수 없습니다.');
  }
  res.json(user);
});

module.exports = { listUsers, getUser };

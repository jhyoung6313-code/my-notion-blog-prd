const { PrismaClient } = require('@prisma/client');

// Prisma 클라이언트 싱글턴 — 앱 전역에서 이 인스턴스 하나만 사용한다.
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

module.exports = prisma;

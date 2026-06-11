require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../src/lib/prisma');

const BCRYPT_ROUNDS = 10;

// 초기 관리자 계정을 생성한다. 이미 있으면 건너뛴다.
async function main() {
  const username = 'admin';
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    console.log('관리자 계정이 이미 존재합니다. 시드를 건너뜁니다.');
    return;
  }

  const passwordHash = await bcrypt.hash('admin1234', BCRYPT_ROUNDS);
  await prisma.user.create({
    data: {
      username,
      passwordHash,
      displayName: '관리자',
      role: 'admin',
    },
  });
  console.log('관리자 계정 생성 완료 (admin / admin1234)');
}

main()
  .catch((err) => {
    console.error('시드 오류:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

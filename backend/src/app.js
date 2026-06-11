require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 4000;
const isDev = process.env.NODE_ENV === 'development';

// Rate Limit 상수
const LOGIN_WINDOW_MS = 5 * 60 * 1000; // 5분
const LOGIN_MAX = 10;
const API_WINDOW_MS = 60 * 1000; // 1분
const API_MAX = 300;

// 프록시(nginx 등) 뒤에서 X-Forwarded-For 신뢰
app.set('trust proxy', 1);

// 헬스체크 (Docker / 로드밸런서용)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// CORS — 허용 출처는 .env의 CORS_ORIGINS에서 읽는다.
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());
app.use(cors({ origin: corsOrigins, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting: 로그인 전용 — 5분에 최대 10회
const loginLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  max: LOGIN_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  skip: () => isDev,
});

// Rate Limiting: 전체 API — 1분에 최대 300회
const apiLimiter = rateLimit({
  windowMs: API_WINDOW_MS,
  max: API_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  skip: () => isDev,
});

app.use('/api/auth/login', loginLimiter);
app.use('/api', apiLimiter);

// API 라우터
app.use('/api', routes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다.' });
});

// 글로벌 에러 핸들러 — 개발 환경은 상세, 운영 환경은 내부 정보 숨김
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (isDev) {
    console.error(err.stack);
    return res.status(status).json({ error: err.message });
  }
  console.error(`[${new Date().toISOString()}] ${status} ${req.method} ${req.path} — ${err.message}`);
  const message = status < 500 ? err.message : '서버 내부 오류가 발생했습니다.';
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`백엔드 서버 실행 중: http://localhost:${PORT}`);
});

module.exports = app;

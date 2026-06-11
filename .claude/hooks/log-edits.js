// PostToolUse(Edit|Write) 훅 — 수정된 파일 경로를 타임스탬프와 함께 기록한다.
// 로깅 실패가 작업을 막지 않도록 모든 오류는 조용히 무시한다.
const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join('.claude', 'edit-log.txt');

let raw = '';
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw || '{}');
    const filePath = data.tool_input?.file_path;
    if (filePath) {
      fs.appendFileSync(LOG_PATH, `${new Date().toISOString()}\t${filePath}\n`);
    }
  } catch {
    // 무시
  }
  process.exit(0);
});

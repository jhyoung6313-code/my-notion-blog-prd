// PreToolUse(Bash) 훅 — 파괴적이거나 위험한 명령을 차단한다.
// exit code 2면 명령 실행이 차단되고 stderr 내용이 Claude에게 전달된다.
const DANGEROUS_PATTERNS = [
  { re: /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i, label: 'rm -rf (재귀 강제 삭제)' },
  { re: /\bsudo\b/, label: 'sudo (권한 상승)' },
  { re: /\bgit\s+push\b[^\n]*(--force|\s-f\b)/, label: 'git push --force (강제 푸시)' },
  { re: /\b(mkfs|dd)\b/, label: '디스크 포맷/덮어쓰기' },
  { re: />\s*\/dev\/sd[a-z]/, label: '블록 디바이스 직접 쓰기' },
];

let raw = '';
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw || '{}');
    const command = data.tool_input?.command || '';
    for (const { re, label } of DANGEROUS_PATTERNS) {
      if (re.test(command)) {
        console.error(
          `차단: 위험한 명령 패턴이 감지되었습니다 — ${label}. 꼭 필요하면 사용자가 직접 터미널에서 실행하세요.`
        );
        process.exit(2);
      }
    }
  } catch {
    // 파싱 실패 시 통과
  }
  process.exit(0);
});

// PreToolUse(Edit|Write) 훅 — .env 류 시크릿 파일의 직접 수정을 차단한다.
// 템플릿인 .env.example은 허용한다. exit code 2면 도구 호출이 차단된다.
let raw = '';
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw || '{}');
    const filePath = data.tool_input?.file_path || '';
    const baseName = filePath.split(/[\\/]/).pop() || '';
    const isProtectedEnv = baseName.startsWith('.env') && baseName !== '.env.example';
    if (isProtectedEnv) {
      console.error(
        `차단: ${baseName} 은(는) 보호된 환경 변수 파일입니다. 비밀 값은 .env.example 템플릿만 수정하세요.`
      );
      process.exit(2);
    }
  } catch {
    // 파싱 실패 시 정상 작업을 막지 않도록 통과시킨다.
  }
  process.exit(0);
});

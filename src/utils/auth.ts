import http from "node:http";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import process from "node:process";
import { clearTimeout, setTimeout } from "node:timers";

export function getAuthCode(
  clientId: string,
  scheme: string = "http",
  host: string = "127.0.0.1",
  port: string | number = 8080,
  path: string = "/"
): Promise<string> {
  const CHZZK_INTERLOCK_URL = "https://chzzk.naver.com/account-interlock";

  // CSRF 공격 방지용 state 생성
  const state = crypto.randomBytes(32).toString("base64url");

  // 운영체제 감지
  const platform = process.platform;

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ? req.url : "", `http://${req.headers.host}`);
      const callbackCode = url.searchParams.get("code");
      const callbackState = url.searchParams.get("state");

      // state 검증
      if (callbackState !== state) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>인증 실패</h1><p>상태 코드 불일치</p>`);
        return;
      }

      // code가 존재하면 반환
      if (callbackCode) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>인증 완료!</h1><p>이 창을 닫고 터미널/프로그램으로 돌아가세요.</p>`);

        // 서버 종료 및 코드 반환
        cleanupAndResolve(callbackCode);
      }
    });

    // 인증이 완료되거나 실패할 때까지 대기 상태를 유지하기 위한 플래그
    let settled = false;

    // 인증 타임아웃 설정 (1분)
    const timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      server.close();

      reject(new Error("인증 시간이 초과되었습니다. 다시 시도해주세요."));
    }, 60000); // 1분 후 타임아웃

    // 인증 완료 시 서버 종료 및 코드 반환
    function cleanupAndResolve(code: string) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      server.close();
      resolve(code);
    }

    // 인증 실패 시 서버 종료 및 에러 반환
    function cleanupAndReject(err: Error) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      server.close();
      reject(err);
    }

    // 서버 시작
    server.listen(port, () => {
      // 치지직 OAuth2 인증 페이지 주소
      const authUrl = `${CHZZK_INTERLOCK_URL}?clientId=${clientId}&redirectUri=${scheme}://${host}:${port}${path}&state=${state}`;

      // 사용자 브라우저 자동 열기
      if (platform === "win32") {
        spawn("cmd", ["/c", "start", "", authUrl], {
          stdio: "ignore",
          detached: true,
          windowsHide: true,
        }).unref();
      } else if (platform === "darwin") {
        spawn("open", [authUrl], { stdio: "ignore", detached: true }).unref();
      } else if (platform === "linux") {
        spawn("xdg-open", [authUrl], { stdio: "ignore", detached: true }).unref();
      } else {
        cleanupAndReject(new Error("지원되지 않는 플랫폼 입니다."));
      }
    });

    // 서버 에러 핸들링
    server.on("error", (err) => {
      cleanupAndReject(err);
    });
  });
}

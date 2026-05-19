import { describe, expect, test } from "@jest/globals";
import process from "node:process";

import { getAuthCode } from "../../../utils/auth";

const RUN = process.env.RUN_MANUAL_TEST === "true";
const CLIENT_ID = process.env.CLIENT_ID || "";

describe("auth.ts 테스트", () => {
  const manualTest = RUN ? test : test.skip;

  manualTest("토큰 인증받기 수동 테스트", async () => {
    const code = await getAuthCode(CLIENT_ID);

    // 인증 코드가 존재하는지 확인
    expect(code).toBeDefined();
    expect(typeof code).toBe("string");
    expect(code.length).toBeGreaterThan(0);
  });
});

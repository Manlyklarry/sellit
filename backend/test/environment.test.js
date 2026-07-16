import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

test("production origins never trust private Expo development hosts", () => {
  const script = `
    import { getAllowedOrigins, isAllowedOrigin } from './src/config/environment.js';
    console.log(JSON.stringify({
      configured: isAllowedOrigin('https://app.sellit.example'),
      privateHost: isAllowedOrigin('http://192.168.1.20:8081'),
      trusted: getAllowedOrigins('http://192.168.1.20:8081'),
    }));
  `;
  const output = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {
      ...process.env,
      BETTER_AUTH_SECRET: "production-test-secret-with-32-characters",
      BETTER_AUTH_URL: "https://api.sellit.example",
      CORS_ORIGIN: "https://app.sellit.example",
      NODE_ENV: "production",
    },
  });
  const result = JSON.parse(output);

  assert.equal(result.configured, true);
  assert.equal(result.privateHost, false);
  assert.deepEqual(result.trusted, ["https://app.sellit.example"]);
});

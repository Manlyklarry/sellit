import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { createApp } from "../src/app.js";
import { prisma } from "../src/prisma.js";
import { API_ENDPOINTS } from "../../shared/apiRoutes.js";

const origin = "http://localhost:8081";
const email = `auth-${randomUUID()}@example.com`;
let baseUrl;
let server;

before(async () => {
  server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("Better Auth creates, verifies, and revokes a cookie session", async () => {
  const signUpResponse = await fetch(
    `${baseUrl}${API_ENDPOINTS.auth.signUpEmail}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({
        email,
        name: "Auth Integration",
        password: "password-123",
      }),
    }
  );
  const signUpBody = await signUpResponse.json();

  assert.equal(signUpResponse.status, 200);
  assert.equal(signUpBody.user.email, email);

  const cookie = getCookieHeader(signUpResponse.headers);
  assert.ok(cookie, "sign-up response should set a session cookie");

  const sessionResponse = await fetch(
    `${baseUrl}${API_ENDPOINTS.auth.getSession}`,
    { headers: { Cookie: cookie, Origin: origin } }
  );
  const sessionBody = await sessionResponse.json();
  assert.equal(sessionResponse.status, 200);
  assert.equal(sessionBody.user.email, email);

  const signOutResponse = await fetch(`${baseUrl}${API_ENDPOINTS.auth.signOut}`, {
    method: "POST",
    headers: { Cookie: cookie, Origin: origin },
  });
  assert.equal(signOutResponse.status, 200);

  const revokedResponse = await fetch(
    `${baseUrl}${API_ENDPOINTS.auth.getSession}`,
    { headers: { Cookie: cookie, Origin: origin } }
  );
  assert.equal(revokedResponse.status, 200);
  assert.equal(await revokedResponse.json(), null);
});

function getCookieHeader(headers) {
  const values = headers.getSetCookie?.() || [headers.get("set-cookie")].filter(Boolean);
  return values.map((value) => value.split(";", 1)[0]).join("; ");
}

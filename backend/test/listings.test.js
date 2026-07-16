import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, test } from "node:test";

import { createApp } from "../src/app.js";
import { prisma } from "../src/prisma.js";
import { API_ENDPOINTS } from "../../shared/apiRoutes.js";

const origin = "http://localhost:8081";

describe("listings API", () => {
  let baseUrl;
  let server;
  let owner;
  let otherUser;
  let seededListing;

  before(async () => {
    server = createApp({
      resolveAuthenticatedUser: async (req) => {
        const userId = req.headers["x-test-user-id"];
        if (!userId) return null;

        return prisma.user.findUnique({
          where: { id: userId },
        });
      },
    }).listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;

    owner = await createUser("owner");
    otherUser = await createUser("other");
    seededListing = await createListing(owner, "Owner listing");
  });

  after(async () => {
    await prisma.listing.deleteMany({
      where: {
        OR: [
          { sellerUserId: owner?.id },
          { sellerUserId: otherUser?.id },
          { title: { startsWith: "Codex integration" } },
        ],
      },
    });
    await prisma.user.deleteMany({
      where: {
        id: {
          in: [owner?.id, otherUser?.id].filter(Boolean),
        },
      },
    });
    await prisma.$disconnect();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  test("health reports database connectivity", async () => {
    const response = await request(API_ENDPOINTS.health);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.database, true);
  });

  test("lists and fetches a listing by id", async () => {
    const listResponse = await request(API_ENDPOINTS.listings.root);
    const listBody = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.ok(
      listBody.listings.some((listing) => listing.id === seededListing.id)
    );

    const detailResponse = await request(API_ENDPOINTS.listings.byId(seededListing.id));
    const detailBody = await detailResponse.json();

    assert.equal(detailResponse.status, 200);
    assert.equal(detailBody.listing.id, seededListing.id);
    assert.equal(detailBody.listing.title, "Owner listing");
    assert.equal("sellerEmail" in detailBody.listing, false);
    assert.equal(detailBody.listing.currency, "GHS");
  });

  test("paginates listings with opaque cursors", async () => {
    await createListing(owner, "Codex integration pagination");
    const firstResponse = await request(`${API_ENDPOINTS.listings.root}?limit=1`);
    const firstBody = await firstResponse.json();

    assert.equal(firstResponse.status, 200);
    assert.equal(firstBody.listings.length, 1);
    assert.ok(firstBody.nextCursor);

    const secondResponse = await request(
      `${API_ENDPOINTS.listings.root}?limit=1&cursor=${encodeURIComponent(firstBody.nextCursor)}`
    );
    const secondBody = await secondResponse.json();
    assert.equal(secondResponse.status, 200);
    assert.equal(secondBody.listings.length, 1);
    assert.notEqual(secondBody.listings[0].id, firstBody.listings[0].id);
  });

  test("does not expose email from the public user endpoint", async () => {
    const response = await request(API_ENDPOINTS.users.byId(owner.id), { user: null });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.user.id, owner.id);
    assert.equal("email" in body.user, false);
  });

  test("updates profile details and rejects duplicate usernames", async () => {
    const updateResponse = await request(API_ENDPOINTS.users.profile, {
      method: "PUT",
      body: createProfileFormData({
        name: "Updated Owner",
        username: "updated_owner",
      }),
    });
    const updateBody = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updateBody.user.name, "Updated Owner");
    assert.equal(updateBody.user.username, "updated_owner");

    const duplicateResponse = await request(API_ENDPOINTS.users.profile, {
      method: "PUT",
      body: createProfileFormData({
        name: "Other User",
        username: "updated_owner",
      }),
      user: otherUser,
    });
    const duplicateBody = await duplicateResponse.json();

    assert.equal(duplicateResponse.status, 409);
    assert.match(duplicateBody.error, /taken/i);
  });

  test("uploads and removes a profile image", async () => {
    const uploadResponse = await request(API_ENDPOINTS.users.profile, {
      method: "PUT",
      body: createProfileFormData({
        image: true,
        name: "Updated Owner",
        username: "updated_owner",
      }),
    });
    const uploadBody = await uploadResponse.json();

    assert.equal(uploadResponse.status, 200);
    assert.match(uploadBody.user.image, /^\/uploads\/profiles\/.+\.png$/);

    const removeResponse = await request(API_ENDPOINTS.users.profile, {
      method: "PUT",
      body: createProfileFormData({
        name: "Updated Owner",
        removeImage: true,
        username: "updated_owner",
      }),
    });
    const removeBody = await removeResponse.json();

    assert.equal(removeResponse.status, 200);
    assert.equal(removeBody.user.image, null);
  });

  test("includes current seller profile data on listings", async () => {
    const listing = await createListing(owner, "Codex integration seller profile");
    const response = await request(API_ENDPOINTS.listings.byId(listing.id));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.listing.sellerName, "Updated Owner");
    assert.equal(body.listing.sellerUsername, "updated_owner");
  });

  test("rejects listing creation without an authenticated session", async () => {
    const response = await request(API_ENDPOINTS.listings.root, {
      method: "POST",
      body: createListingFormData(),
      user: null,
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.match(body.error, /sign in/i);
  });

  test("creates a listing for a signed-in seller", async () => {
    const response = await request(API_ENDPOINTS.listings.root, {
      method: "POST",
      body: createListingFormData({
        title: "Codex integration create",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.listing.title, "Codex integration create");
    assert.equal(body.listing.sellerUserId, owner.id);
  });

  test("rejects spoofed image content", async () => {
    const response = await request(API_ENDPOINTS.listings.root, {
      method: "POST",
      body: createListingFormData({ validImage: false }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.match(body.error, /supported JPEG, PNG, or WebP/i);
  });

  test("rejects self inquiries and duplicate buyer inquiries", async () => {
    const listing = await createListing(owner, "Codex integration inquiry");
    const selfResponse = await request(API_ENDPOINTS.listings.inquiries(listing.id), {
      method: "POST",
      json: { message: "Is this available?" },
    });
    assert.equal(selfResponse.status, 400);

    const buyerRequest = {
      method: "POST",
      json: { message: "Is this available?" },
      user: otherUser,
    };
    const firstResponse = await request(
      API_ENDPOINTS.listings.inquiries(listing.id),
      buyerRequest
    );
    assert.equal(firstResponse.status, 201);
    const duplicateResponse = await request(
      API_ENDPOINTS.listings.inquiries(listing.id),
      buyerRequest
    );
    assert.equal(duplicateResponse.status, 409);
  });

  test("only unregisters push tokens owned by the authenticated user", async () => {
    const token = `ExpoPushToken[test-${randomUUID()}]`;
    await prisma.pushToken.create({
      data: { token, userId: otherUser.id, platform: "ios" },
    });

    const ownerResponse = await request(API_ENDPOINTS.pushTokens.byToken(token), {
      method: "DELETE",
    });
    assert.equal(ownerResponse.status, 204);
    assert.ok(await prisma.pushToken.findUnique({ where: { token } }));

    const otherResponse = await request(API_ENDPOINTS.pushTokens.byToken(token), {
      method: "DELETE",
      user: otherUser,
    });
    assert.equal(otherResponse.status, 204);
    assert.equal(await prisma.pushToken.findUnique({ where: { token } }), null);
  });

  test("protects listing deletion by owner", async () => {
    const listing = await createListing(owner, "Codex integration protected");

    const anonymousResponse = await request(API_ENDPOINTS.listings.byId(listing.id), {
      method: "DELETE",
      json: {},
      user: null,
    });
    assert.equal(anonymousResponse.status, 401);

    const otherUserResponse = await request(API_ENDPOINTS.listings.byId(listing.id), {
      method: "DELETE",
      json: {
        user: owner,
      },
      user: otherUser,
    });
    assert.equal(otherUserResponse.status, 403);

    const ownerResponse = await request(API_ENDPOINTS.listings.byId(listing.id), {
      method: "DELETE",
      json: {},
    });
    assert.equal(ownerResponse.status, 204);
  });

  async function request(path, options = {}) {
    const { user = owner, ...requestOptions } = options;
    const headers = {
      Origin: origin,
      ...(requestOptions.headers || {}),
    };
    let body = requestOptions.body;

    if (user?.id) {
      headers["X-Test-User-Id"] = user.id;
    }

    if (requestOptions.json) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(requestOptions.json);
    }

    return fetch(`${baseUrl}${path}`, {
      ...requestOptions,
      body,
      headers,
    });
  }
});

async function createUser(label) {
  const id = `test-user-${randomUUID()}`;

  return prisma.user.create({
    data: {
      email: `${id}@example.com`,
      id,
      name: `Test ${label}`,
    },
  });
}

async function createListing(owner, title) {
  return prisma.listing.create({
    data: {
      categoryId: 6,
      categoryLabel: "Others",
      description: "A listing created by the integration test.",
      price: 12,
      sellerUserId: owner.id,
      title,
      images: {
        create: {
          filename: `${randomUUID()}.png`,
          mimetype: "image/png",
          path: `uploads/listings/${randomUUID()}.png`,
          size: 4,
        },
      },
    },
    include: {
      images: true,
    },
  });
}

function createListingFormData({
  title = "Codex integration upload",
  validImage = true,
} = {}) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("price", "12");
  formData.append("category", JSON.stringify({ label: "Other", value: 6 }));
  formData.append(
    "description",
    "A listing created by the integration test upload path."
  );
  formData.append("location", "null");
  formData.append(
    "images",
    new Blob([validImage ? pngBytes() : "not-an-image"], { type: "image/png" }),
    "item.png"
  );

  return formData;
}

function createProfileFormData({
  image = false,
  name,
  removeImage = false,
  username,
}) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("removeImage", String(removeImage));
  formData.append("username", username);

  if (image) {
    formData.append(
      "image",
      new Blob([pngBytes()], { type: "image/png" }),
      "profile.png"
    );
  }

  return formData;
}

function pngBytes() {
  return Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
}

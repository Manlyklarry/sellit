import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, test } from "node:test";

import { createApp } from "../src/app.js";
import { prisma } from "../src/prisma.js";

const origin = "http://localhost:8081";

describe("listings API", () => {
  let baseUrl;
  let server;
  let owner;
  let otherUser;
  let seededListing;

  before(async () => {
    server = createApp().listen(0, "127.0.0.1");
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
    const response = await request("/health");
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.database, true);
  });

  test("lists and fetches a listing by id", async () => {
    const listResponse = await request("/api/listings");
    const listBody = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.ok(
      listBody.listings.some((listing) => listing.id === seededListing.id)
    );

    const detailResponse = await request(`/api/listings/${seededListing.id}`);
    const detailBody = await detailResponse.json();

    assert.equal(detailResponse.status, 200);
    assert.equal(detailBody.listing.id, seededListing.id);
    assert.equal(detailBody.listing.title, "Owner listing");
  });

  test("updates profile details and rejects duplicate usernames", async () => {
    const updateResponse = await request("/api/users/profile", {
      method: "PUT",
      body: createProfileFormData({
        name: "Updated Owner",
        user: owner,
        username: "updated_owner",
      }),
    });
    const updateBody = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updateBody.user.name, "Updated Owner");
    assert.equal(updateBody.user.username, "updated_owner");

    const duplicateResponse = await request("/api/users/profile", {
      method: "PUT",
      body: createProfileFormData({
        name: "Other User",
        user: otherUser,
        username: "updated_owner",
      }),
    });
    const duplicateBody = await duplicateResponse.json();

    assert.equal(duplicateResponse.status, 409);
    assert.match(duplicateBody.error, /taken/i);
  });

  test("uploads and removes a profile image", async () => {
    const uploadResponse = await request("/api/users/profile", {
      method: "PUT",
      body: createProfileFormData({
        image: true,
        name: "Updated Owner",
        user: owner,
        username: "updated_owner",
      }),
    });
    const uploadBody = await uploadResponse.json();

    assert.equal(uploadResponse.status, 200);
    assert.match(uploadBody.user.image, /^\/uploads\/profiles\/.+\.png$/);

    const removeResponse = await request("/api/users/profile", {
      method: "PUT",
      body: createProfileFormData({
        name: "Updated Owner",
        removeImage: true,
        user: owner,
        username: "updated_owner",
      }),
    });
    const removeBody = await removeResponse.json();

    assert.equal(removeResponse.status, 200);
    assert.equal(removeBody.user.image, null);
  });

  test("includes current seller profile data on listings", async () => {
    const listing = await createListing(owner, "Codex integration seller profile");
    const response = await request(`/api/listings/${listing.id}`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.listing.sellerName, "Updated Owner");
    assert.equal(body.listing.sellerUsername, "updated_owner");
  });

  test("rejects listing creation without a signed-in seller snapshot", async () => {
    const response = await request("/api/listings", {
      method: "POST",
      body: createListingFormData({ seller: null }),
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.match(body.error, /sign in/i);
  });

  test("creates a listing for a signed-in seller", async () => {
    const response = await request("/api/listings", {
      method: "POST",
      body: createListingFormData({
        seller: {
          email: owner.email,
          id: owner.id,
          name: owner.name,
        },
        title: "Codex integration create",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.listing.title, "Codex integration create");
    assert.equal(body.listing.sellerUserId, owner.id);
  });

  test("protects listing deletion by owner", async () => {
    const listing = await createListing(owner, "Codex integration protected");

    const anonymousResponse = await request(`/api/listings/${listing.id}`, {
      method: "DELETE",
      json: {},
    });
    assert.equal(anonymousResponse.status, 401);

    const otherUserResponse = await request(`/api/listings/${listing.id}`, {
      method: "DELETE",
      json: {
        user: {
          email: otherUser.email,
          id: otherUser.id,
        },
      },
    });
    assert.equal(otherUserResponse.status, 403);

    const ownerResponse = await request(`/api/listings/${listing.id}`, {
      method: "DELETE",
      json: {
        user: {
          email: owner.email,
          id: owner.id,
        },
      },
    });
    assert.equal(ownerResponse.status, 204);
  });

  async function request(path, options = {}) {
    const headers = {
      Origin: origin,
      ...(options.headers || {}),
    };
    let body = options.body;

    if (options.json) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.json);
    }

    return fetch(`${baseUrl}${path}`, {
      ...options,
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
      sellerEmail: owner.email,
      sellerName: owner.name,
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

function createListingFormData({ seller, title = "Codex integration upload" }) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("price", "12");
  formData.append("category", JSON.stringify({ label: "Others", value: 6 }));
  formData.append(
    "description",
    "A listing created by the integration test upload path."
  );
  formData.append("location", "null");
  formData.append("seller", JSON.stringify(seller));
  formData.append("images", new Blob(["test"], { type: "image/png" }), "item.png");

  return formData;
}

function createProfileFormData({
  image = false,
  name,
  removeImage = false,
  user,
  username,
}) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("removeImage", String(removeImage));
  formData.append("user", JSON.stringify(user));
  formData.append("username", username);

  if (image) {
    formData.append("image", new Blob(["test"], { type: "image/png" }), "profile.png");
  }

  return formData;
}

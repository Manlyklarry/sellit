import assert from "node:assert/strict";
import test from "node:test";

import { API_ENDPOINTS, API_ROUTES } from "../../shared/apiRoutes.js";
import {
  normalizeDisplayName,
  normalizeUsername,
  validateDisplayName,
  validateUsername,
} from "../../shared/profileValidation.js";
import {
  normalizeListingText,
  validateListingDescription,
  validateListingTitle,
} from "../../shared/listingValidation.js";

test("shared API endpoints encode dynamic path segments", () => {
  assert.equal(API_ENDPOINTS.listings.root, API_ROUTES.listings);
  assert.equal(
    API_ENDPOINTS.listings.byId("item/with spaces"),
    `${API_ROUTES.listings}/item%2Fwith%20spaces`
  );
  assert.equal(
    API_ENDPOINTS.pushTokens.byToken("ExponentPushToken[a/b]"),
    `${API_ROUTES.pushTokens}/ExponentPushToken%5Ba%2Fb%5D`
  );
});

test("shared profile validation normalizes and validates consistently", () => {
  assert.equal(normalizeDisplayName("  Ada   Mensah  "), "Ada Mensah");
  assert.equal(normalizeUsername("  ADA_1  "), "ada_1");
  assert.equal(validateDisplayName("A"), "Display name must be at least 2 characters.");
  assert.equal(validateDisplayName("Ada Mensah"), null);
  assert.equal(validateUsername("not-valid!"), "Username must be 3-24 characters using letters, numbers, or underscores.");
  assert.equal(validateUsername("ada_1"), null);
});

test("shared listing validation rejects missing and oversized content", () => {
  assert.equal(normalizeListingText("  Solid   wood chair "), "Solid wood chair");
  assert.equal(validateListingTitle(""), "Name of item must be at least 3 characters.");
  assert.equal(validateListingTitle("Solid chair"), null);
  assert.equal(validateListingDescription("Too short"), "Description must be at least 10 characters.");
  assert.equal(validateListingDescription("A clean chair in very good condition."), null);
});

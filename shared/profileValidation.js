export const PROFILE_LIMITS = Object.freeze({
  displayNameMax: 80,
  displayNameMin: 2,
  usernameMax: 24,
  usernameMin: 3,
});

export function normalizeDisplayName(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

export function validateDisplayName(value) {
  const name = normalizeDisplayName(value);

  if (name.length < PROFILE_LIMITS.displayNameMin) {
    return `Display name must be at least ${PROFILE_LIMITS.displayNameMin} characters.`;
  }
  if (name.length > PROFILE_LIMITS.displayNameMax) {
    return `Display name must be ${PROFILE_LIMITS.displayNameMax} characters or less.`;
  }
  return null;
}

export function validateUsername(value) {
  const username = normalizeUsername(value);
  if (!username) return null;

  const pattern = new RegExp(
    `^[a-z0-9_]{${PROFILE_LIMITS.usernameMin},${PROFILE_LIMITS.usernameMax}}$`
  );
  return pattern.test(username)
    ? null
    : `Username must be ${PROFILE_LIMITS.usernameMin}-${PROFILE_LIMITS.usernameMax} characters using letters, numbers, or underscores.`;
}

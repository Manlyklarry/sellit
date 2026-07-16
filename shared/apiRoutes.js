const API_ROOT = "/api";

export const API_ROUTES = Object.freeze({
  auth: `${API_ROOT}/auth`,
  health: "/health",
  listings: `${API_ROOT}/listings`,
  pushTokens: `${API_ROOT}/push-tokens`,
  uploads: "/uploads",
  users: `${API_ROOT}/users`,
});

const segment = (value) => encodeURIComponent(String(value));

export const API_ENDPOINTS = Object.freeze({
  auth: {
    root: API_ROUTES.auth,
    getSession: `${API_ROUTES.auth}/get-session`,
    wildcard: `${API_ROUTES.auth}/{*any}`,
    signInEmail: `${API_ROUTES.auth}/sign-in/email`,
    signOut: `${API_ROUTES.auth}/sign-out`,
    signUpEmail: `${API_ROUTES.auth}/sign-up/email`,
  },
  health: API_ROUTES.health,
  listings: {
    root: API_ROUTES.listings,
    byId: (id) => `${API_ROUTES.listings}/${segment(id)}`,
    inquiries: (id) => `${API_ROUTES.listings}/${segment(id)}/inquiries`,
  },
  pushTokens: {
    root: API_ROUTES.pushTokens,
    byToken: (token) => `${API_ROUTES.pushTokens}/${segment(token)}`,
  },
  uploads: API_ROUTES.uploads,
  users: {
    root: API_ROUTES.users,
    byId: (id) => `${API_ROUTES.users}/${segment(id)}`,
    profile: `${API_ROUTES.users}/profile`,
  },
});

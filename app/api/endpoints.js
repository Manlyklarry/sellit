export const API_ENDPOINTS = {
  auth: {
    root: "/api/auth",
    signInEmail: "/api/auth/sign-in/email",
    signOut: "/api/auth/sign-out",
    signUpEmail: "/api/auth/sign-up/email",
  },
  listings: {
    root: "/api/listings",
    byId: (id) => `/api/listings/${encodeURIComponent(id)}`,
    inquiries: (id) => `/api/listings/${encodeURIComponent(id)}/inquiries`,
  },
  pushTokens: {
    root: "/api/push-tokens",
    byToken: (token) => `/api/push-tokens/${encodeURIComponent(token)}`,
  },
  users: {
    byId: (id) => `/api/users/${encodeURIComponent(id)}`,
    profile: "/api/users/profile",
  },
};

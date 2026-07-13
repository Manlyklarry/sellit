import { API_ENDPOINTS, API_ROUTES } from "../../../shared/apiRoutes.js";

export const ROUTES = Object.freeze({
  auth: API_ENDPOINTS.auth.wildcard,
  health: API_ROUTES.health,
  listings: API_ROUTES.listings,
  pushTokens: API_ROUTES.pushTokens,
  uploads: API_ROUTES.uploads,
  users: API_ROUTES.users,
});

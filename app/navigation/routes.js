export const ROOT_ROUTES = {
  APP: "Root/App",
  AUTH: "Root/Auth",
};

export const AUTH_ROUTES = {
  LOGIN: "Auth/Login",
  REGISTER: "Auth/Register",
  WELCOME: "Auth/Welcome",
};

export const TAB_ROUTES = {
  ACCOUNT: "Tabs/Account",
  FEED: "Tabs/Feed",
  SELL: "Tabs/Sell",
};

export const FEED_ROUTES = {
  DETAILS: "Feed/Details",
  LISTINGS: "Feed/Listings",
};

const routes = {
  AUTH: AUTH_ROUTES,
  FEED: FEED_ROUTES,
  ROOT: ROOT_ROUTES,
  TABS: TAB_ROUTES,
};

export default routes;

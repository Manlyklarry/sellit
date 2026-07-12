export const ROOT_ROUTES = {
  APP: "Root/App",
  AUTH: "Root/Auth",
};

export const AUTH_ROUTES = {
  HOW_IT_WORKS: "Auth/HowItWorks",
  LOGIN: "Auth/Login",
  ONBOARDING_SUCCESS: "Auth/OnboardingSuccess",
  REGISTER: "Auth/Register",
  SELLING_TYPE: "Auth/SellingType",
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

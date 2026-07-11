# Environment

Sellit is built on Expo SDK 54, which targets Node.js 20.19.x. Use the pinned
version in `.nvmrc` or `.node-version` before running the Expo CLI.

## App

- `EXPO_PUBLIC_API_URL`: Full backend base URL. Use this for deployed or
  non-standard local backends, for example `http://192.168.1.20:8000`.
- `EXPO_PUBLIC_API_PORT`: Backend port used when the app derives the host from
  Expo dev server metadata. Defaults to `8000`.
- `EXPO_PUBLIC_APP_ORIGIN`: Origin sent to the backend for CORS/auth checks.
- `EXPO_PUBLIC_EXPO_PORT`: Expo dev server port used for derived origins.
  Defaults to `8081`.

## Backend

- `HOST`: API bind host. Defaults to `127.0.0.1`.
- `PORT`: API port. Defaults to `8000`.
- `DATABASE_URL`: PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: Better Auth signing secret.
- `BETTER_AUTH_URL`: Public backend auth URL.
- `CORS_ORIGIN`: Comma-separated trusted app origins.
- `EXPO_PUSH_URL`: Expo push API URL. Defaults to Expo's push endpoint.

## Web

Web support requires `react-dom` and `react-native-web`, installed with:

```sh
npx expo install react-dom react-native-web
```

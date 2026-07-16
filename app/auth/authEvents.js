const listeners = new Set();

export function publishAuthenticationState(user) {
  listeners.forEach((listener) => listener(user || null));
}

export function subscribeToAuthenticationState(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

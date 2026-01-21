const AUTH_ERROR_MAP = {
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/user-not-found": "No account found for that email.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/email-already-in-use": "That email is already registered.",
  "auth/weak-password": "Password is too weak.",
};

export function mapAuthError(code) {
  return AUTH_ERROR_MAP[code] || "";
}

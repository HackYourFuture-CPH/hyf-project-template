// Minimal JWT helper: safely decode payload without validating signature
// We'll extract the `sub` or `id` claim commonly used for user id
export function getUserIdFromToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    // token format: header.payload.signature
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // base64url decode
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const json = atob(padded);
    const obj = JSON.parse(json);
    return obj?.id || obj?.sub || obj?.user_id || obj?.userId || null;
  } catch (err) {
    return null;
  }
}

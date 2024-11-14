import * as jose from 'jose';

function verifyJWT(token) {
  // Convert the NEXT_PUBLIC_JWT_SECRET to a Uint8Array,
  // avoid issue HS256 algorithm must be one of type CryptoKey, Uint8Array, or JSON Web Key
  const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
  return jose.jwtVerify(token, secretKey, { algorithms: ['HS256'] });
}

export async function decodeJWT(token) {
  return (await verifyJWT(token)).payload;
}

import jwt from 'jsonwebtoken'

export function verifyToken(token: string) {
  const decoded = jwt.verify(token, process.env.VERCEL_OIDC_SECRET as string) as { sub: string }
  return decoded.sub.includes('express-js-on-vercel')
}

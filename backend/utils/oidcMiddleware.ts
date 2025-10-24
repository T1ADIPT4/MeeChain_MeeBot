import { Request, Response, NextFunction } from 'express'
import { verifyToken } from './verifyToken'

export function oidcAuth(requiredSubIncludes?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const token = authHeader.replace('Bearer ', '')
    try {
      const valid = verifyToken(token)
      if (requiredSubIncludes && !valid) {
        return res.status(403).json({ error: 'Forbidden: insufficient OIDC scope' })
      }
      next()
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired OIDC token' })
    }
  }
}

import { db } from './firebase-admin'
import { Request, Response, NextFunction } from 'express'

export async function writeAuditLog({ sub, scope, wallet, action, meta }: {
  sub: string,
  scope: string,
  wallet?: string,
  action: string,
  meta?: any
}) {
  const ref = db.collection('audit_logs').doc()
  await ref.set({
    sub,
    scope,
    wallet: wallet || null,
    action,
    meta: meta || null,
    timestamp: new Date()
  })
}

export function auditLogMiddleware(action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { sub, scope } = (req as any).oidc || {}
    const wallet = req.body?.wallet || req.query?.wallet
    await writeAuditLog({ sub, scope, wallet, action, meta: { path: req.path, method: req.method } })
    next()
  }
}

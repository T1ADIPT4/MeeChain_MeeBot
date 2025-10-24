import React from 'react';
// ...existing code...import { verifyBadgeExists, mintBadge } from './badgeMinter'
import type { SupportedNetwork, BadgeTransaction } from './badgeMinter'

/**
 * ตรวจสอบ badge ซ้ำ + mint badge พร้อม fallback-aware
 * @returns { success, tx?, fallback?, reason? }
 */
export async function verifyAndMintBadge(
  userId: string,
  questId: string,
  network?: SupportedNetwork
): Promise<
  | { success: true; tx: BadgeTransaction; fallback?: boolean }
  | { success: false; fallback?: boolean; reason: string }
> {
  try {
    // 1. ตรวจสอบ badge ซ้ำ
    const exists = await verifyBadgeExists(userId, questId)
    if (exists) {
      return { success: false, reason: 'Badge already minted' }
    }
    // 2. Mint badge (badgeMinter จะ handle fallback ในตัว)
    const tx = await mintBadge(userId, questId, network)
    return { success: true, tx, fallback: tx.chain === 'fallback' }
  } catch (e: any) {
    // fallback-aware: badgeMinter จะ handle fallback ในตัว
    return { success: false, reason: e.message, fallback: /fallback/i.test(e.message) }
  }
}

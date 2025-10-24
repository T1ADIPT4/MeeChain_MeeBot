// backend/api/claim.ts (Express.js example)
import type { Request, Response } from "express";
import { mintMEE } from "../minting/mintMEE";
import { getUserPoint, deductUserPoint } from "../utils/point";
import { notifyMeeBot } from "../utils/meebotNotify";
import fetch from 'node-fetch';

export default async function handler(req: Request, res: Response) {
  const { wallet, amount } = req.body;
  if (!wallet || !amount) return res.status(400).json({ success: false, error: "Missing wallet or amount" });
  // ตรวจสอบ point คงเหลือ
  const point = await getUserPoint(wallet);
  if (point < amount) return res.status(400).json({ success: false, error: "Point ไม่พอ" });
  try {
  const txHash = await mintMEE(wallet, amount);
  await deductUserPoint(wallet, amount); // หัก point หลัง mint
    await notifyMeeBot(wallet, amount, txHash); // แจ้งเตือน MeeBot

    // POST activity to MeeBot Webhook server for Activity Feed
    try {
      await fetch('http://localhost:3001/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          message: `เคลม MEE สำเร็จ จำนวน ${amount} MEE`,
          type: 'claim',
          txHash
        })
      });
    } catch (err) {
      console.warn('MeeBot Activity Feed webhook failed:', err);
    }
  // ...update Firestore, leaderboard...
  res.json({ success: true, txHash });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

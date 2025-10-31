import { Request, Response } from 'express';

import logs from '../data/logs.json';

type LogEntry = typeof logs extends Array<infer T> ? T : never;
// Mock: import fetchOnChainLogs (replace with real import if implemented)
const fetchOnChainLogs = async (): Promise<LogEntry[]> => [];

export const getLogs = async (req: Request, res: Response) => {
  const { status, userAddress, action } = req.query;

  // Local logs
  let localLogs = logs;

  // On-chain logs (mocked, replace with real fetchOnChainLogs)
  let onChainLogs: LogEntry[] = [];
  try {
    onChainLogs = await fetchOnChainLogs();
  } catch (e) {
    // ignore on-chain error for now
  }

  let combined = [...localLogs, ...onChainLogs];

  if (status) {
    combined = combined.filter(log => log.status === status);
  }
  if (userAddress) {
    combined = combined.filter(log => log.userAddress?.toLowerCase() === userAddress.toString().toLowerCase());
  }

  res.json({ success: true, count: combined.length, data: combined });
};

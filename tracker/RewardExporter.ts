// tracker/RewardExporter.ts

import { getAllRewards } from './RewardTracker.js'
import fs from 'fs'

export function exportRewardLog(path = './reward-log.json') {
  const data = getAllRewards()
  const json = JSON.stringify(data, null, 2)
  fs.writeFileSync(path, json)
  console.log(`📦 Exported reward log to ${path}`)
}

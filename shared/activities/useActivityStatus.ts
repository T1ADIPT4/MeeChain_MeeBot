import { useState } from 'react'
import { Activity } from './types'

export const useActivityStatus = () => {
  const [activities, setActivities] = useState<Activity[]>([])

  const updateStatus = (id: string, status: Activity['status']) => {
    setActivities(prev =>
      prev.map(act => (act.id === id ? { ...act, status } : act))
    )
  }

  return { activities, updateStatus }
}
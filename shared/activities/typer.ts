export type Activity = {
  id: string
  title: string
  description?: string
  status: 'pending' | 'completed' | 'failed'
  timestamp?: number
  action?: () => void
}
import { Activity } from './types'

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <div className="card">
      <h3>{activity.title}</h3>
      <p>{activity.status === 'completed' ? '✅ เสร็จแล้ว' : '⏳ รอดำเนินการ'}</p>
      {activity.action && (
        <button onClick={activity.action}>ดำเนินการ</button>
      )}
    </div>
  )
}
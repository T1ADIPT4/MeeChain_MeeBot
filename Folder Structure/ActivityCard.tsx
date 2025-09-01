export const ActivityCard = ({ activity }) => (
  <div className="card">
    <h3>{activity.title}</h3>
    <p>{activity.status === 'completed' ? '✅ เสร็จแล้ว' : '⏳ รอดำเนินการ'}</p>
    {activity.action && <button onClick={activity.action}>ดำเนินการ</button>}
  </div>
)
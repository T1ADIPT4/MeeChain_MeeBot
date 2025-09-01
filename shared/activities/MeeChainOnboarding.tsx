import { activityList } from '@shared/activities/activityList'
import { ActivityCard } from '@shared/activities/ActivityCard'
import { useActivityStatus } from '@shared/activities/useActivityStatus'

const ActivityPage = () => {
  const { activities, updateStatus } = useActivityStatus()

  return (
    <div>
      {activityList.map(activity => (
        <ActivityCard
          key={activity.id}
          activity={{ ...activity, action: () => updateStatus(activity.id, 'completed') }}
        />
      ))}
    </div>
  )
}
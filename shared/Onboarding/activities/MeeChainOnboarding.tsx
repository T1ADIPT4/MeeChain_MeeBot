import { activityList } from './activityList'
import { ActivityCard } from './ActivityCard'
import { useActivityStatus } from './useActivityStatus'

const MeeChainOnboarding = () => {
  const { activities, updateStatus } = useActivityStatus()

  return (
    <div>
      {activityList.map(activity => (
        <ActivityCard
          key={activity.id}
          activity={{
            ...activity,
            action: () => updateStatus(activity.id, 'completed'),
          }}
        />
      ))}
    </div>
  )
}
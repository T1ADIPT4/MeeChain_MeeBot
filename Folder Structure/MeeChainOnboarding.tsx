const MeeChainOnboarding = () => {
  const { updateStatus } = useActivityStatus()
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
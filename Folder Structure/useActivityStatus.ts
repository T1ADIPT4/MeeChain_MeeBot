export const useActivityStatus = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const updateStatus = (id, status) => {
    setActivities(prev => prev.map(act => act.id === id ? { ...act, status } : act))
  }
  return { activities, updateStatus }
}
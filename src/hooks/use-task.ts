import { useTaskStore } from "@/stores/task-store"

export const useTask = () => {
  const tasks = useTaskStore((state) => state.tasks)
  const isLoading = useTaskStore((state) => state.isLoading)
  const displayMode = useTaskStore((state) => state.displayMode)
  const setDisplayMode = useTaskStore((state) => state.setDisplayMode)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus)
  const toggleStarred = useTaskStore((state) => state.toggleStarred)
  const uploadAttachment = useTaskStore((state) => state.uploadAttachment)
  const deleteAttachment = useTaskStore((state) => state.deleteAttachment)
  const getTasksByGroup = useTaskStore((state) => state.getTasksByGroup)

  return {
    tasks,
    isLoading,
    displayMode,
    setDisplayMode,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleStarred,
    uploadAttachment,
    deleteAttachment,
    getTasksByGroup,
  }
}

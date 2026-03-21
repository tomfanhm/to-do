import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

import { useAuthStore } from "@/features/auth/store"
import type { Attachment, Task, TaskGroup } from "@/features/tasks/schemas"
import { taskService } from "@/services/task.service"

interface TaskState {
  tasks: Array<Task>
  isLoading: boolean
  displayMode: "list" | "grid"
}

interface TaskActions {
  setTasks: (tasks: Array<Task>) => void
  setLoading: (loading: boolean) => void
  setDisplayMode: (mode: "list" | "grid") => void
  addTask: (
    task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<string>
  updateTask: (
    id: string,
    task: Partial<Omit<Task, "id" | "userId">>
  ) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskStatus: (
    id: string,
    status: "completed" | "incomplete"
  ) => Promise<void>
  toggleStarred: (id: string, isStarred: boolean) => Promise<void>
  uploadAttachment: (taskId: string, file: File) => Promise<Attachment>
  deleteAttachment: (taskId: string, attachmentId: string) => Promise<void>
  getTasksByGroup: (group: TaskGroup) => Array<Task>
}

type TaskStore = TaskState & TaskActions

export const useTaskStore = create<TaskStore>()(
  subscribeWithSelector((set, get) => ({
    tasks: [],
    isLoading: true,
    displayMode: "list",

    setTasks: (tasks) => set({ tasks }),
    setLoading: (isLoading) => set({ isLoading }),
    setDisplayMode: (displayMode) => set({ displayMode }),

    addTask: async (
      task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
    ) => {
      const { currentUser } = useAuthStore.getState()
      if (!currentUser) throw new Error("User not authenticated")
      return taskService.create(currentUser.uid, task)
    },

    updateTask: async (
      id: string,
      taskUpdate: Partial<Omit<Task, "id" | "userId">>
    ) => {
      const { currentUser } = useAuthStore.getState()
      if (!currentUser) throw new Error("User not authenticated")
      await taskService.update(id, taskUpdate)
    },

    deleteTask: async (id: string) => {
      const { currentUser } = useAuthStore.getState()
      const { tasks } = get()
      if (!currentUser) throw new Error("User not authenticated")

      const task = tasks.find((t) => t.id === id)
      await taskService.delete(id, currentUser.uid, task?.attachments || [])
    },

    toggleTaskStatus: async (
      id: string,
      status: "completed" | "incomplete"
    ) => {
      const { updateTask } = get()
      await updateTask(id, { status })

      if (status === "completed") {
        const audio = new Audio("/completion-sound.mp3")
        audio.play().catch((error) => {
          console.error(error)
        })
      }
    },

    toggleStarred: async (id: string, isStarred: boolean) => {
      const { updateTask } = get()
      await updateTask(id, { isStarred })
    },

    uploadAttachment: async (
      taskId: string,
      file: File
    ): Promise<Attachment> => {
      const { currentUser } = useAuthStore.getState()
      const { tasks, updateTask } = get()
      if (!currentUser) throw new Error("User not authenticated")

      const attachment = await taskService.uploadAttachment(
        currentUser.uid,
        taskId,
        file
      )

      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        const updatedAttachments = [...(task.attachments || []), attachment]
        await updateTask(taskId, { attachments: updatedAttachments })
      }

      return attachment
    },

    deleteAttachment: async (taskId: string, attachmentId: string) => {
      const { currentUser } = useAuthStore.getState()
      const { tasks, updateTask } = get()
      if (!currentUser) throw new Error("User not authenticated")

      const task = tasks.find((t) => t.id === taskId)
      if (!task) throw new Error("Task not found")

      await taskService.deleteAttachment(currentUser.uid, taskId, attachmentId)

      const updatedAttachments = task.attachments.filter(
        (a) => a.id !== attachmentId
      )
      await updateTask(taskId, { attachments: updatedAttachments })
    },

    getTasksByGroup: (group: TaskGroup): Array<Task> => {
      const { tasks } = get()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayTimestamp = today.getTime()

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowTimestamp = tomorrow.getTime()

      switch (group) {
        case "today":
          return tasks.filter((task) => {
            if (!task.dueDate) return false
            const taskDate = new Date(task.dueDate)
            taskDate.setHours(0, 0, 0, 0)
            return taskDate.getTime() === todayTimestamp
          })
        case "important":
          return tasks.filter((task) => task.isStarred)
        case "earlier":
          return tasks.filter((task) => {
            if (!task.dueDate) return false
            return task.dueDate < todayTimestamp
          })
        case "tomorrow":
          return tasks.filter((task) => {
            if (!task.dueDate) return false
            const taskDate = new Date(task.dueDate)
            taskDate.setHours(0, 0, 0, 0)
            return taskDate.getTime() === tomorrowTimestamp
          })
        case "future":
          return tasks.filter((task) => {
            if (!task.dueDate) return false
            return task.dueDate > tomorrowTimestamp
          })
        case "incomplete":
          return tasks.filter((task) => task.status === "incomplete")
        case "completed":
          return tasks.filter((task) => task.status === "completed")
        default:
          return tasks
      }
    },
  }))
)

// Task subscription management
let taskUnsubscribe: (() => void) | null = null

export const initializeTasks = () => {
  const { currentUser } = useAuthStore.getState()
  const { setTasks, setLoading } = useTaskStore.getState()

  if (taskUnsubscribe) {
    taskUnsubscribe()
    taskUnsubscribe = null
  }

  if (!currentUser) {
    setTasks([])
    setLoading(false)
    return
  }

  setLoading(true)

  taskUnsubscribe = taskService.subscribeToTasks(currentUser.uid, (tasks) => {
    setTasks(tasks)
    setLoading(false)
  })
}

export const cleanupTasks = () => {
  if (taskUnsubscribe) {
    taskUnsubscribe()
    taskUnsubscribe = null
  }
}

// Subscribe to auth changes to reinitialize tasks
useAuthStore.subscribe(
  (state) => state.currentUser,
  (currentUser) => {
    if (currentUser) {
      initializeTasks()
    } else {
      cleanupTasks()
      useTaskStore.getState().setTasks([])
      useTaskStore.getState().setLoading(false)
    }
  }
)

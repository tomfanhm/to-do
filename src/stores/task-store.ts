import type { Attachment, Task, TaskGroup } from "@/schemas"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import type { DocumentData } from "firebase/firestore"
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

import { db, storage } from "@/lib/firebase/firebase-config"
import { useAuthStore } from "@/stores/auth-store"

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

const transformFirestoreTask = (doc: DocumentData): Task => {
  const data = doc.data()
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    createdAt: data.createdAt?.toMillis() || Date.now(),
    updatedAt: data.updatedAt?.toMillis() || Date.now(),
    dueDate: data.dueDate?.toMillis() || null,
    reminder: data.reminder?.toMillis() || null,
    status: data.status,
    priority: data.priority,
    isStarred: data.isStarred,
    color: data.color,
    category: data.category,
    attachments: data.attachments || [],
    userId: data.userId,
  }
}

export const useTaskStore = create<TaskStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    tasks: [],
    isLoading: true,
    displayMode: "list",

    // Actions
    setTasks: (tasks) => set({ tasks }),
    setLoading: (isLoading) => set({ isLoading }),
    setDisplayMode: (displayMode) => set({ displayMode }),

    addTask: async (
      task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
    ) => {
      const { currentUser } = useAuthStore.getState()
      if (!currentUser) throw new Error("User not authenticated")

      const taskData = {
        ...task,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        attachments: [],
      }

      const docRef = await addDoc(collection(db, "tasks"), taskData)
      return docRef.id
    },

    updateTask: async (
      id: string,
      taskUpdate: Partial<Omit<Task, "id" | "userId">>
    ) => {
      const { currentUser } = useAuthStore.getState()
      if (!currentUser) throw new Error("User not authenticated")

      const taskRef = doc(db, "tasks", id)

      const updates: any = {
        ...taskUpdate,
        updatedAt: serverTimestamp(),
      }

      if (taskUpdate.dueDate) {
        updates.dueDate = Timestamp.fromMillis(taskUpdate.dueDate)
      }

      if (taskUpdate.reminder) {
        updates.reminder = Timestamp.fromMillis(taskUpdate.reminder)
      }

      await updateDoc(taskRef, updates)
    },

    deleteTask: async (id: string) => {
      const { currentUser } = useAuthStore.getState()
      const { tasks } = get()
      if (!currentUser) throw new Error("User not authenticated")

      // Find the task to get attachments
      const task = tasks.find((t) => t.id === id)

      // Delete all attachments from storage
      if (task && task.attachments && task.attachments.length > 0) {
        await Promise.all(
          task.attachments.map(async (attachment) => {
            const fileRef = ref(
              storage,
              `attachments/${currentUser.uid}/${id}/${attachment.id}`
            )
            try {
              await deleteObject(fileRef)
            } catch (error) {
              console.error(error)
            }
          })
        )
      }

      // Then delete the task document
      const taskRef = doc(db, "tasks", id)
      await deleteDoc(taskRef)
    },

    toggleTaskStatus: async (
      id: string,
      status: "completed" | "incomplete"
    ) => {
      const { updateTask } = get()
      await updateTask(id, { status })

      // Play sound when task is completed
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

      const attachmentId = Math.random().toString(36).substring(2, 15)
      const fileRef = ref(
        storage,
        `attachments/${currentUser.uid}/${taskId}/${attachmentId}`
      )

      await uploadBytes(fileRef, file)
      const downloadUrl = await getDownloadURL(fileRef)

      const attachment: Attachment = {
        id: attachmentId,
        name: file.name,
        url: downloadUrl,
        type: file.type,
        size: file.size,
        createdAt: Date.now(),
      }

      // Update the task with the new attachment
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

      // Find the task
      const task = tasks.find((t) => t.id === taskId)
      if (!task) throw new Error("Task not found")

      // Delete from storage
      const fileRef = ref(
        storage,
        `attachments/${currentUser.uid}/${taskId}/${attachmentId}`
      )
      await deleteObject(fileRef)

      // Update task document
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

  // Clean up previous subscription
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

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", currentUser.uid),
    orderBy("createdAt", "desc")
  )

  taskUnsubscribe = onSnapshot(q, (snapshot) => {
    const tasksData = snapshot.docs.map(transformFirestoreTask)

    // Sort to ensure starred tasks are on top
    const sortedTasks = [...tasksData].sort((a, b) => {
      if (a.isStarred && !b.isStarred) return -1
      if (!a.isStarred && b.isStarred) return 1
      return 0
    })

    setTasks(sortedTasks)
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

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

import type { Attachment, Task } from "@/features/tasks/schemas"
import { storageService } from "@/services/storage.service"
import { db } from "@/lib/firebase/firebase-config"

const TASKS_COLLECTION = "tasks"

function safeTimestampToMillis(timestamp: any): number | null {
  if (!timestamp) return null
  if (timestamp instanceof Timestamp) return timestamp.toMillis()
  if (typeof timestamp === "number") return timestamp
  if (timestamp instanceof Date) return timestamp.getTime()
  if (timestamp && typeof timestamp.toMillis === "function")
    return timestamp.toMillis()
  if (timestamp && typeof timestamp.seconds === "number") {
    return timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000
  }
  return null
}

function transformFirestoreTask(docSnap: DocumentData): Task {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    title: data.title,
    description: data.description,
    createdAt: safeTimestampToMillis(data.createdAt) || Date.now(),
    updatedAt: safeTimestampToMillis(data.updatedAt) || Date.now(),
    dueDate: safeTimestampToMillis(data.dueDate),
    reminder: safeTimestampToMillis(data.reminder),
    status: data.status,
    priority: data.priority,
    isStarred: data.isStarred,
    color: data.color,
    category: data.category,
    attachments: data.attachments || [],
    userId: data.userId,
  }
}

export const taskService = {
  async create(
    userId: string,
    task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const taskData = {
      ...task,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      attachments: [],
    }
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData)
    return docRef.id
  },

  async update(
    id: string,
    updates: Partial<Omit<Task, "id" | "userId">>
  ): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, id)
    const firestoreUpdates: any = {
      ...updates,
      updatedAt: serverTimestamp(),
    }

    if (updates.dueDate) {
      firestoreUpdates.dueDate = Timestamp.fromMillis(updates.dueDate)
    }
    if (updates.reminder) {
      firestoreUpdates.reminder = Timestamp.fromMillis(updates.reminder)
    }

    await updateDoc(taskRef, firestoreUpdates)
  },

  async delete(
    id: string,
    userId: string,
    attachments: Array<Attachment>
  ): Promise<void> {
    if (attachments.length > 0) {
      await Promise.all(
        attachments.map(async (attachment) => {
          const path = storageService.buildAttachmentPath(
            userId,
            id,
            attachment.id
          )
          try {
            await storageService.delete(path)
          } catch (error) {
            console.error(error)
          }
        })
      )
    }
    const taskRef = doc(db, TASKS_COLLECTION, id)
    await deleteDoc(taskRef)
  },

  async uploadAttachment(
    userId: string,
    taskId: string,
    file: File
  ): Promise<Attachment> {
    const attachmentId = Math.random().toString(36).substring(2, 15)
    const path = storageService.buildAttachmentPath(
      userId,
      taskId,
      attachmentId
    )
    const downloadUrl = await storageService.upload(path, file)

    return {
      id: attachmentId,
      name: file.name,
      url: downloadUrl,
      type: file.type,
      size: file.size,
      createdAt: Date.now(),
    }
  },

  async deleteAttachment(
    userId: string,
    taskId: string,
    attachmentId: string
  ): Promise<void> {
    const path = storageService.buildAttachmentPath(
      userId,
      taskId,
      attachmentId
    )
    await storageService.delete(path)
  },

  subscribeToTasks(
    userId: string,
    callback: (tasks: Array<Task>) => void
  ): () => void {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(transformFirestoreTask)
      const sorted = [...tasks].sort((a, b) => {
        if (a.isStarred && !b.isStarred) return -1
        if (!a.isStarred && b.isStarred) return 1
        return 0
      })
      callback(sorted)
    })
  },
}

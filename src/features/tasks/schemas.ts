import { z } from "zod"

export const taskPriority = z.enum(["low", "medium", "high"])
export type TaskPriority = z.infer<typeof taskPriority>

export const taskColor = z.enum([
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "default",
])
export type TaskColor = z.infer<typeof taskColor>

export const taskCategory = z.string()
export type TaskCategory = z.infer<typeof taskCategory>

export const taskStatus = z.enum(["incomplete", "completed"])
export type TaskStatus = z.infer<typeof taskStatus>

export const taskGroup = z.enum([
  "today",
  "important",
  "earlier",
  "tomorrow",
  "future",
  "incomplete",
  "completed",
  "default",
])
export type TaskGroup = z.infer<typeof taskGroup>

export const attachment = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.string(),
  size: z.number(),
  createdAt: z.number(),
})
export type Attachment = z.infer<typeof attachment>

export const task = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  dueDate: z.number().nullable(),
  reminder: z.number().nullable(),
  status: taskStatus,
  priority: taskPriority,
  isStarred: z.boolean(),
  color: taskColor,
  category: taskCategory,
  attachments: z.array(attachment),
  userId: z.string(),
})
export type Task = z.infer<typeof task>

export const editTask = task.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})
export type EditTask = z.infer<typeof editTask>

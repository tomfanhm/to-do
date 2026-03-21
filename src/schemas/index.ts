// Barrel re-exports from feature modules
// Source of truth lives in src/features/*/schemas.ts
export {
  taskPriority,
  taskColor,
  taskCategory,
  taskStatus,
  taskGroup,
  attachment,
  task,
  editTask,
} from "@/features/tasks/schemas"
export type {
  TaskPriority,
  TaskColor,
  TaskCategory,
  TaskStatus,
  TaskGroup,
  Attachment,
  Task,
  EditTask,
} from "@/features/tasks/schemas"

export { user, email, password, login, register } from "@/features/auth/schemas"
export type { User, Email, Password, Login, Register } from "@/features/auth/schemas"

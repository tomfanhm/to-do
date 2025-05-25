import React, { Fragment } from "react"
import type { Task } from "@/schemas"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, Check, MoreVertical, Paperclip, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteConfirmDialog from "@/components/delete-confirm-dialog"
import { useTask } from "@/hooks/use-task"
import { cn } from "@/lib/utils"

import TaskDetail from "./task-detail"

type TaskCardProps = {
  task: Task
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskStatus, toggleStarred } = useTask()

  const handleToggleStatus = () => {
    toggleTaskStatus(
      task.id,
      task.status === "completed" ? "incomplete" : "completed"
    )
  }

  const handleToggleStar = () => {
    toggleStarred(task.id, !task.isStarred)
  }

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative"
      >
        <Card>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-1 overflow-hidden">
                <h3
                  className={cn(
                    "truncate font-medium",
                    task.status === "completed"
                      ? "text-muted-foreground line-through"
                      : ""
                  )}
                >
                  {task.title}
                </h3>
                {/* Task description and details */}
                {task.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {task.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap space-x-2">
                  {task.category && (
                    <Badge variant="outline">{task.category}</Badge>
                  )}
                  {task.priority === "high" && (
                    <Badge variant="destructive">High Priority</Badge>
                  )}
                  {task.dueDate && (
                    <Badge variant="outline">
                      <Calendar />
                      {format(new Date(task.dueDate), "MMM d")}
                    </Badge>
                  )}
                  {task.attachments.length > 0 && (
                    <Badge variant="outline">
                      <Paperclip />
                      {task.attachments.length}
                    </Badge>
                  )}
                </div>
              </div>
              {/* Context Menu */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleStatus}
                  className={
                    task.status === "completed"
                      ? "fill-green-400 text-green-400"
                      : "text-muted-foreground"
                  }
                >
                  <Check />
                </Button>
                <Button
                  className="text-transparent"
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleStar}
                >
                  <Star
                    className={
                      task.isStarred
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <TaskDetail task={task} />
                    <DeleteConfirmDialog taskId={task.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Fragment>
  )
}
export default TaskCard

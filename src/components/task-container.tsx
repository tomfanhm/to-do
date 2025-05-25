import React, { useState } from "react"
import type { TaskGroup } from "@/schemas"
import { AnimatePresence } from "framer-motion"
import { GridIcon, ListFilter, ListIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TaskCard from "@/components/task-card"
import TaskForm from "@/components/task-form"
import { useTask } from "@/hooks/use-task"

type TaskContainerProps = {
  title: string
  group: TaskGroup | "default"
}

const TaskContainer: React.FC<TaskContainerProps> = ({ title, group }) => {
  const { getTasksByGroup, displayMode, setDisplayMode } = useTask()
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "dueDate">(
    "newest"
  )

  const tasks = getTasksByGroup(group)

  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by starred status
    if (a.isStarred && !b.isStarred) return -1
    if (!a.isStarred && b.isStarred) return 1

    // Then sort by the selected option
    switch (sortOption) {
      case "newest":
        return b.createdAt - a.createdAt
      case "oldest":
        return a.createdAt - b.createdAt
      case "dueDate": {
        if (a.dueDate === null && b.dueDate === null) return 0
        if (a.dueDate === null) return 1
        if (b.dueDate === null) return -1
        return a.dueDate - b.dueDate
      }
      default:
        return 0
    }
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ListFilter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={(v: any) => setSortOption(v)}
              >
                <DropdownMenuRadioItem value="newest">
                  Newest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">
                  Oldest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dueDate">
                  Due Date
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Toggle Display Mode */}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setDisplayMode(displayMode === "list" ? "grid" : "list")
            }
          >
            {displayMode === "list" ? <GridIcon /> : <ListIcon />}
          </Button>
        </div>
      </div>
      {tasks.length > 0 && (
        <div
          className={
            displayMode === "grid"
              ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-3"
          }
        >
          <AnimatePresence>
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      )}
      <Button
        className="w-full"
        variant="outline"
        onClick={() => setIsAddTaskOpen(true)}
      >
        <Plus />
        Add Task
      </Button>
      <TaskForm
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />
    </div>
  )
}
export default TaskContainer

import React, { Fragment, useState } from "react"
import type { TaskGroup } from "@/schemas"
import { Link } from "@tanstack/react-router"
import {
  Calendar,
  CheckSquare,
  Clock12,
  ClockArrowDown,
  ClockArrowUp,
  Menu,
  Plus,
  Square,
  Star,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import TaskForm from "@/components/task-form"
import { useTask } from "@/hooks/use-task"

const navigationItems = [
  {
    title: "Today",
    icon: Calendar,
    group: "today" as const,
  },
  {
    title: "Important",
    icon: Star,
    group: "important" as const,
  },
]

const plannedItems = [
  {
    title: "Earlier",
    icon: ClockArrowDown,
    group: "earlier" as const,
  },
  {
    title: "Tomorrow",
    icon: Clock12,
    group: "tomorrow" as const,
  },
  {
    title: "Future",
    icon: ClockArrowUp,
    group: "future" as const,
  },
]

const taskItems = [
  {
    title: "Incomplete",
    icon: Square,
    group: "incomplete" as const,
  },
  {
    title: "Completed",
    icon: CheckSquare,
    group: "completed" as const,
  },
]

const Sidebar: React.FC = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const { getTasksByGroup } = useTask()

  const getTaskCount = (group: TaskGroup) => {
    return getTasksByGroup(group).length
  }
  return (
    <Fragment>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
            <span className="sr-only">Open Task Groups</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[480px]">
          <SheetHeader>
            <SheetTitle className="sr-only">Task Groups</SheetTitle>
            <SheetDescription className="sr-only">
              Select a task group to view tasks.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4">
            <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const count = getTaskCount(item.group)
                return (
                  <Link
                    key={item.group}
                    to="/$group"
                    params={{ group: item.group }}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Icon />
                      {item.title}
                      {count > 0 && <Badge className="ml-auto">{count}</Badge>}
                    </Button>
                  </Link>
                )
              })}
            </div>
            <Separator />
            <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
              {plannedItems.map((item) => {
                const Icon = item.icon
                const count = getTaskCount(item.group)
                return (
                  <Link
                    key={item.group}
                    to="/$group"
                    params={{ group: item.group }}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Icon />
                      {item.title}
                      {count > 0 && <Badge className="ml-auto">{count}</Badge>}
                    </Button>
                  </Link>
                )
              })}
            </div>
            <Separator />
            <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
              {taskItems.map((item) => {
                const Icon = item.icon
                const count = getTaskCount(item.group)
                return (
                  <Link
                    key={item.group}
                    to="/$group"
                    params={{ group: item.group }}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Icon />
                      {item.title}
                      {count > 0 && <Badge className="ml-auto">{count}</Badge>}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
          <SheetFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAddTaskOpen(true)}
            >
              <Plus />
              Add Task
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <TaskForm
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />
    </Fragment>
  )
}
export default Sidebar

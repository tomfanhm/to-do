import React from "react"
import type { Task, TaskColor, TaskPriority } from "@/schemas"
import { task } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Clock } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTask } from "@/hooks/use-task"
import { cn } from "@/lib/utils"

type NewTaskValues = Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">

const PRIORITY_OPTIONS: Array<{
  value: TaskPriority
  label: string
  color: string
}> = [
  { value: "low", label: "Low", color: "text-green-400" },
  { value: "medium", label: "Medium", color: "text-yellow-400" },
  { value: "high", label: "High", color: "text-red-400" },
]

const COLOR_OPTIONS: Array<{ value: TaskColor; label: string; color: string }> =
  [
    { value: "default", label: "Default", color: "bg-gray-400" },
    { value: "red", label: "Red", color: "bg-red-400" },
    { value: "orange", label: "Orange", color: "bg-orange-400" },
    { value: "yellow", label: "Yellow", color: "bg-yellow-400" },
    { value: "green", label: "Green", color: "bg-green-400" },
    { value: "blue", label: "Blue", color: "bg-blue-400" },
    { value: "purple", label: "Purple", color: "bg-purple-400" },
    { value: "pink", label: "Pink", color: "bg-pink-400" },
  ]

type TaskFormProps = {
  isOpen: boolean
  onClose: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTask()

  const form = useForm<NewTaskValues>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
      reminder: null,
      status: "incomplete",
      priority: "medium",
      isStarred: false,
      category: "",
      attachments: [],
    },
    resolver: zodResolver(
      task.omit({
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      })
    ),
  })

  async function onSubmit(values: NewTaskValues) {
    try {
      await addTask(values)
      form.reset()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add task")
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Content */}
            <div className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Task description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g., Work, Personal, Shopping"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Priority and Color Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className={cn("font-medium", option.color)}>
                                {option.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COLOR_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    "size-2.5 rounded-full",
                                    option.color
                                  )}
                                />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP 'at' p")
                            ) : (
                              <span>Set due date</span>
                            )}
                            <Clock className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="space-y-3 p-3">
                          {/* Date Selection */}
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const currentDueDate = field.value
                                  ? new Date(field.value)
                                  : new Date()
                                const newDueDate = new Date(date)

                                // Preserve existing time or set default to 6 PM
                                if (field.value) {
                                  newDueDate.setHours(currentDueDate.getHours())
                                  newDueDate.setMinutes(
                                    currentDueDate.getMinutes()
                                  )
                                } else {
                                  newDueDate.setHours(18, 0, 0, 0) // 6 PM default
                                }

                                field.onChange(newDueDate.getTime())
                              } else {
                                field.onChange(null)
                              }
                            }}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                          {/* Time Selection */}
                          {field.value && (
                            <div className="border-t pt-3">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={new Date(field.value).getHours()}
                                    onChange={(e) => {
                                      const newDueDate = new Date(field.value!)
                                      newDueDate.setHours(
                                        parseInt(e.target.value) || 0
                                      )
                                      field.onChange(newDueDate.getTime())
                                    }}
                                    className="w-16 text-center"
                                    placeholder="HH"
                                  />
                                  <span>:</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="59"
                                    step="5"
                                    value={new Date(field.value).getMinutes()}
                                    onChange={(e) => {
                                      const newDueDate = new Date(field.value!)
                                      newDueDate.setMinutes(
                                        parseInt(e.target.value) || 0
                                      )
                                      field.onChange(newDueDate.getTime())
                                    }}
                                    className="w-16 text-center"
                                    placeholder="MM"
                                  />
                                </div>

                                {/* Quick time presets for due dates */}
                                <div className="ml-2 flex gap-1">
                                  {[
                                    { label: "9AM", time: [9, 0] },
                                    { label: "12PM", time: [12, 0] },
                                    { label: "5PM", time: [17, 0] },
                                    { label: "EOD", time: [23, 59] }, // End of day
                                  ].map(({ label, time }) => (
                                    <Button
                                      key={label}
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => {
                                        const newDueDate = new Date(
                                          field.value!
                                        )
                                        newDueDate.setHours(
                                          time[0],
                                          time[1],
                                          0,
                                          0
                                        )
                                        field.onChange(newDueDate.getTime())
                                      }}
                                    >
                                      {label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Clear due date button */}
                          {field.value && (
                            <div className="border-t pt-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => field.onChange(null)}
                                className="text-muted-foreground w-full"
                              >
                                Clear due date
                              </Button>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Reminder */}
              <FormField
                control={form.control}
                name="reminder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "text-left",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP 'at' p")
                            ) : (
                              <span>Set reminder</span>
                            )}
                            <Clock className="ml-auto" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="space-y-2 p-2">
                          {/* Date Selection */}
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const currentReminder = field.value
                                  ? new Date(field.value)
                                  : new Date()
                                const newReminder = new Date(date)

                                // Preserve existing time or set default to 9 AM
                                if (field.value) {
                                  newReminder.setHours(
                                    currentReminder.getHours()
                                  )
                                  newReminder.setMinutes(
                                    currentReminder.getMinutes()
                                  )
                                } else {
                                  newReminder.setHours(9, 0, 0, 0)
                                }

                                field.onChange(newReminder.getTime())
                              } else {
                                field.onChange(null)
                              }
                            }}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                          {/* Time Selection */}
                          {field.value && (
                            <div className="border-t pt-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={new Date(field.value).getHours()}
                                    onChange={(e) => {
                                      const newReminder = new Date(field.value!)
                                      newReminder.setHours(
                                        parseInt(e.target.value) || 0
                                      )
                                      field.onChange(newReminder.getTime())
                                    }}
                                    className="w-16 text-center"
                                    placeholder="HH"
                                  />
                                  <span>:</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="59"
                                    step="5"
                                    value={new Date(field.value).getMinutes()}
                                    onChange={(e) => {
                                      const newReminder = new Date(field.value!)
                                      newReminder.setMinutes(
                                        parseInt(e.target.value) || 0
                                      )
                                      field.onChange(newReminder.getTime())
                                    }}
                                    className="w-16 text-center"
                                    placeholder="MM"
                                  />
                                </div>
                                {/* Quick time presets */}
                                <div className="ml-2 flex gap-1">
                                  {[
                                    { label: "9AM", time: [9, 0] },
                                    { label: "12PM", time: [12, 0] },
                                    { label: "3PM", time: [15, 0] },
                                    { label: "6PM", time: [18, 0] },
                                  ].map(({ label, time }) => (
                                    <Button
                                      key={label}
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => {
                                        const newReminder = new Date(
                                          field.value!
                                        )
                                        newReminder.setHours(
                                          time[0],
                                          time[1],
                                          0,
                                          0
                                        )
                                        field.onChange(newReminder.getTime())
                                      }}
                                    >
                                      {label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Clear reminder button */}
                          {field.value && (
                            <div className="border-t pt-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => field.onChange(null)}
                                className="text-muted-foreground w-full"
                              >
                                Clear reminder
                              </Button>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Star Important */}
              <FormField
                control={form.control}
                name="isStarred"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Mark as important</FormLabel>
                  </FormItem>
                )}
              />
              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <LoadingSpinner /> : "Confirm"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default TaskForm

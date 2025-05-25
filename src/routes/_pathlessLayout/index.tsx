import { createFileRoute } from "@tanstack/react-router"

import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import TaskContainer from "@/components/task-container"

export const Route = createFileRoute("/_pathlessLayout/")({
  component: App,
  ssr: false, // Disable SSR for this route
  head: () => ({
    meta: [
      {
        title: "Tasks",
      },
    ],
  }),
})

function App() {
  return (
    <ProtectedRoute>
      <Header />
      <div className="mx-auto flex max-w-7xl flex-1 overflow-hidden p-6 lg:px-8">
        <TaskContainer title="All" group="default" />
      </div>
    </ProtectedRoute>
  )
}

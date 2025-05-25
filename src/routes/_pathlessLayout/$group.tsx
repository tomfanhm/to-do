import { taskGroup } from "@/schemas"
import { createFileRoute, useParams } from "@tanstack/react-router"

import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import TaskContainer from "@/components/task-container"
import { upperFirstLetter } from "@/lib/utils"

export const Route = createFileRoute("/_pathlessLayout/$group")({
  component: RouteComponent,
  ssr: false, // Disable SSR for this route
  head: ({ params }) => ({
    meta: [
      {
        title: `Tasks - ${upperFirstLetter(params.group)}`,
      },
    ],
  }),
})

function RouteComponent() {
  const { group } = useParams({ from: "/_pathlessLayout/$group" })

  const validGroup = taskGroup.parse(group)

  return (
    <ProtectedRoute>
      <Header />
      <div className="mx-auto flex max-w-7xl flex-1 overflow-hidden p-6 lg:px-8">
        <TaskContainer title={upperFirstLetter(group)} group={validGroup} />
      </div>
    </ProtectedRoute>
  )
}

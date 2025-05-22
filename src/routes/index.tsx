import { createFileRoute } from "@tanstack/react-router"

import { ProtectedRoute } from "@/components/protected-route"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  return (
    <ProtectedRoute>
      <div></div>
    </ProtectedRoute>
  )
}

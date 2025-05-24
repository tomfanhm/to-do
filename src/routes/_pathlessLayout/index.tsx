import { createFileRoute } from "@tanstack/react-router"

import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export const Route = createFileRoute("/_pathlessLayout/")({
  component: App,
})

function App() {
  return (
    <ProtectedRoute>
      <Header />
      <div></div>
    </ProtectedRoute>
  )
}

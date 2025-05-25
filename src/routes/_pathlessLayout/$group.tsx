import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_pathlessLayout/$group")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_pathlessLayout/$group"!</div>
}

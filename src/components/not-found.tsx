import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-background grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-primary text-base font-semibold">404</p>
        <h1 className="text-foreground mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-6 text-lg font-medium text-pretty sm:text-xl/8">
          {children || "The page you are looking for does not exist."}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => window.history.back()}>Go back</Button>
          <Link to="/">
            <Button variant="outline">Start Over</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Link, createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import LoginForm from "@/components/login-form"

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Login",
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Logo" />
        </Link>
        <h2 className="text-foreground mt-6 text-center text-2xl leading-9 font-bold tracking-tight">
          Login to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <LoginForm />
      </div>
      <p className="text-muted-foreground mt-10 text-center text-sm">
        Not a member?
        <Link to="/register">
          <Button variant="link" className="ml-1">
            Register now
          </Button>
        </Link>
      </p>
    </div>
  )
}

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { Login } from "@/schemas"
import { login } from "@/schemas"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import GoogleLogin from "@/components/google-login"
import { useAuth } from "@/hooks/use-auth"

const LoginForm: React.FC = () => {
  const { signIn } = useAuth()

  const router = useRouter()

  const form = useForm<Login>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(login),
  })

  async function onSubmit(values: Login) {
    try {
      await signIn(values.email, values.password)
      router.navigate({ to: "/" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <LoadingSpinner /> : "Login"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <GoogleLogin />
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
export default LoginForm

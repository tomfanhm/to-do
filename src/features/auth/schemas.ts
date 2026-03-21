import { z } from "zod"

export const user = z.object({
  uid: z.string(),
  email: z.string(),
  displayName: z.string().nullable(),
  photoURL: z.string().nullable(),
})
export type User = z.infer<typeof user>

export const email = z.string().email({
  message: "Invalid email address.",
})
export type Email = z.infer<typeof email>

export const password = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character.",
  })
export type Password = z.infer<typeof password>

export const login = z.object({
  email: email,
  password: password,
})
export type Login = z.infer<typeof login>

export const register = z
  .object({
    email: email,
    password: password,
    confirmPassword: password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  })
export type Register = z.infer<typeof register>

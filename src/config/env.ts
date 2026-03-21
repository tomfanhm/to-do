import { z } from "zod"

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, "Firebase API key is required"),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, "Firebase auth domain is required"),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, "Firebase project ID is required"),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, "Firebase storage bucket is required"),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, "Firebase messaging sender ID is required"),
  VITE_FIREBASE_APP_ID: z.string().min(1, "Firebase app ID is required"),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const result = envSchema.safeParse({
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  })

  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors
    const missing = Object.entries(formatted)
      .map(([key, errors]) => `  ${key}: ${errors?.join(", ")}`)
      .join("\n")

    throw new Error(
      `Invalid environment variables:\n${missing}\n\nCheck your .env file against .env.example`
    )
  }

  return result.data
}

export const env = validateEnv()

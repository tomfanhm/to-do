import { clsx } from "clsx"
import type { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function upperFirstLetter(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

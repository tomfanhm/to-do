import { expect, test } from "@playwright/test"

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible()
  })

  test("should show register page", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible()
  })
})

test.describe("Navigation", () => {
  test("should redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("/")
    await page.waitForURL("**/login")
    await expect(page).toHaveURL(/\/login/)
  })
})

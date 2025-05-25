import { Link } from "@tanstack/react-router"
import { LogOut, MoonIcon, SunIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import site from "@/config/site"
import Sidebar from "@/components/sidebar"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/hooks/use-auth"

export const Header = () => {
  const { currentUser, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-6">
          <Sidebar />
          <Link to="/">
            <span className="sr-only">{site.name}</span>
            <img alt={site.name} src="/logo.png" className="h-8 w-auto" />
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={currentUser.photoURL || ""}
                    alt={currentUser.displayName || ""}
                  />
                  <AvatarFallback>
                    {currentUser.displayName?.charAt(0) ||
                      currentUser.email.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {currentUser.displayName || "User"}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  )
}

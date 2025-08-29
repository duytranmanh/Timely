"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { TimerResetIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import type { Dispatch, SetStateAction } from "react"
import { Button } from "./ui/button"
import type { DashboardView } from "@/types/DashboardView"

type NavBarProps = {
  setView: Dispatch<SetStateAction<DashboardView>>
  view: DashboardView
}

export function Navbar({ setView, view }: NavBarProps) {
  const API_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/users/logout/`, {
        method: "POST",
        credentials: "include",
      })

      if (res.ok) {
        navigate("/login")
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      navigate("/login")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border bg-background px-4 py-3">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          <TimerResetIcon className="h-6 w-6" />
          Timely
        </div>

        {/* Right: Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    view === "insights" && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setView("insights")}
                >
                  Insights
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    view === "activities" && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setView("activities")}
                >
                  Manage Activities
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Button
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-destructive"
                  )}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}

export default Navbar


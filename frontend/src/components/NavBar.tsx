"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Clock, ContainerIcon, TimerResetIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"


export function Navbar() {
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
                <Link
                  to="/activities"
                  className={cn("text-sm font-medium transition-colors hover:text-primary")}
                >
                  View Activities
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <button
                  onClick={() => {
                    // add your logout logic here
                    console.log("Logging out...")
                  }}
                  className={cn("text-sm font-medium transition-colors hover:text-destructive")}
                >
                  Logout
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}

export default Navbar


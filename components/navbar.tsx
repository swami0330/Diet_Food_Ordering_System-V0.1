"use client"

import Link from "next/link"
import { Search, ShoppingCart, Leaf, User, LogOut, Bell, Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "../lib/store-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { cart, user, logout, notifications } = useStore()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const unreadNotifications = notifications?.filter((n) => !n.read).length || 0

  const navLinks = [
    { href: "/menu", label: "Menu" },
    { href: "/recommendations", label: "AI Picks", icon: Sparkles },
    { href: "/diet-plans", label: "Diet Plans" },
    { href: "/track-order", label: "Track Order" },
    { href: "/progress", label: "Progress" },
    { href: "/support", label: "Support" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <div className="flex items-center gap-2 mb-8">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">NutriDash</span>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="h-4 w-4 text-green-600" />}
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <>
                    <div className="border-t my-2" />
                    <Link href="/profile" className="px-4 py-2 hover:bg-muted transition-colors">
                      Profile
                    </Link>
                    <Link href="/dashboard" className="px-4 py-2 hover:bg-muted transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/billing" className="px-4 py-2 hover:bg-muted transition-colors">
                      Billing & Payments
                    </Link>
                    <Link href="/ratings" className="px-4 py-2 hover:bg-muted transition-colors">
                      Ratings
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-xl tracking-tight font-serif">NutriDash</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {link.icon && <link.icon className="h-3 w-3 text-green-600" />}
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search meals..." className="w-[200px] bg-muted/50 pl-9" />
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <div className="px-2 py-1.5 text-sm font-semibold">Notifications</div>
                <DropdownMenuSeparator />
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3">
                      <span className="font-medium">{notif.title}</span>
                      <span className="text-xs text-muted-foreground">{notif.message}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing">Billing & Payments</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ratings">My Ratings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="hidden md:flex">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

"use client"

import { useStore } from "@/lib/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Package, ChevronRight, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, orders } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  // Calculate stats from orders
  const totalCalories = orders.reduce(
    (sum, order) => sum + order.items.reduce((mSum, item) => mSum + item.calories * item.quantity, 0),
    0,
  )
  const totalProtein = orders.reduce(
    (sum, order) => sum + order.items.reduce((mSum, item) => mSum + item.protein * item.quantity, 0),
    0,
  )

  const calorieGoal = 14000
  const proteinGoal = 900

  const calProgress = Math.min((totalCalories / calorieGoal) * 100, 100)
  const proteinProgress = Math.min((totalProtein / proteinGoal) * 100, 100)

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="grid gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Here is your nutritional overview for this month.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Calories</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mb-4">Goal: {calorieGoal.toLocaleString()} cal</p>
              <Progress value={calProgress} className="h-2 bg-slate-100" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Protein Intake</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProtein}g</div>
              <p className="text-xs text-muted-foreground mb-4">Goal: {proteinGoal}g</p>
              <Progress value={proteinProgress} className="h-2 bg-slate-100" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Order history active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Diet Type</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Personalized</div>
              <p className="text-xs text-muted-foreground">Based on order history</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                  <Link href="/menu">
                    <Button variant="link" className="text-green-600">
                      Start browsing the menu
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold">₹{order.total.toFixed(2)}</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 capitalize">
                            {order.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Scheduled Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-green-50 flex flex-col items-center justify-center text-green-600 border border-green-100">
                  <span className="text-xs font-bold uppercase">Next</span>
                  <span className="text-xl font-bold leading-none">Day</span>
                </div>
                <div>
                  <p className="font-bold">Standard Delivery</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>8:00 AM - 10:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">Meal Summary:</p>
                <p className="text-sm text-muted-foreground">Order meals to see your next delivery schedule here.</p>
              </div>
              <Link href="/menu">
                <Button className="w-full bg-green-600 hover:bg-green-700">Browse Menu</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

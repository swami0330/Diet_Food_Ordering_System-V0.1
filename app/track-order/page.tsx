"use client"

import { useStore } from "@/lib/store-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package, Truck, ChefHat, CheckCircle2, MapPin, Phone, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

const orderStatusSteps = [
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "out-for-delivery", label: "Out for Delivery", icon: Truck },
  { status: "in-transit", label: "In Transit", icon: MapPin },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
]

export default function TrackOrderPage() {
  const { orders, user } = useStore()

  const activeOrders = orders.filter((o) => o.status !== "delivered")
  const completedOrders = orders.filter((o) => o.status === "delivered")

  const getStatusIndex = (status: string) => {
    return orderStatusSteps.findIndex((s) => s.status === status)
  }

  const getStatusProgress = (status: string) => {
    const index = getStatusIndex(status)
    return ((index + 1) / orderStatusSteps.length) * 100
  }

  if (!user) {
    return (
      <div className="container px-4 py-20 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
        <h1 className="text-2xl font-bold mb-2">Track Your Orders</h1>
        <p className="text-muted-foreground mb-6">Please sign in to view your orders.</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold font-serif">Order Tracking</h1>
        <p className="text-muted-foreground">Track your meals in real-time.</p>
      </div>

      {activeOrders.length > 0 ? (
        <div className="space-y-6 mb-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Active Orders
          </h2>
          {activeOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>{order.id}</CardTitle>
                    <CardDescription>
                      Ordered on{" "}
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`capitalize ${
                      order.status === "preparing"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "in-transit" || order.status === "out-for-delivery"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status.replace("-", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Order Progress</span>
                      <span className="font-medium">{Math.round(getStatusProgress(order.status))}%</span>
                    </div>
                    <Progress value={getStatusProgress(order.status)} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    {orderStatusSteps.map((step, idx) => {
                      const currentIdx = getStatusIndex(order.status)
                      const isActive = idx <= currentIdx
                      const Icon = step.icon

                      return (
                        <div key={step.status} className="flex flex-col items-center gap-2">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={`text-xs ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {order.estimatedDelivery && (
                    <div className="flex items-center gap-2 p-4 bg-primary/5 border border-primary/20">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Estimated Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.estimatedDelivery).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.deliveryStaff && (
                    <div className="flex items-center justify-between p-4 border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{order.deliveryStaff.name}</p>
                          <p className="text-sm text-muted-foreground">Delivery Partner</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-muted/50 text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="px-3 py-2 bg-muted/50 text-sm text-muted-foreground">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-12">
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
            <h3 className="text-lg font-semibold mb-2">No Active Orders</h3>
            <p className="text-muted-foreground mb-4">You don't have any orders in progress.</p>
            <Link href="/menu">
              <Button className="gap-2">
                Browse Menu <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {completedOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Completed Orders
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedOrders.slice(0, 6).map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Delivered
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                    </span>
                    <span className="font-bold">₹{order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, MapPin, Phone, Clock, CheckCircle2, Truck, Navigation, LogOut, User, ChefHat } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DeliveryOrder {
  id: string
  customerName: string
  customerPhone: string
  address: string
  items: { name: string; quantity: number }[]
  total: number
  status: "assigned" | "picked-up" | "in-transit" | "delivered"
  estimatedDelivery: string
  distance: string
  mealType?: string
}

const mockOrders: DeliveryOrder[] = [
  {
    id: "ORD-001",
    customerName: "Sarah Johnson",
    customerPhone: "+1 (555) 123-4567",
    address: "123 Oak Street, Apt 4B, New York, NY 10001",
    items: [
      { name: "Grilled Salmon Bowl", quantity: 2 },
      { name: "Quinoa Power Bowl", quantity: 1 },
    ],
    total: 47.97,
    status: "assigned",
    estimatedDelivery: "12:30 PM",
    distance: "2.3 km",
    mealType: "Lunch",
  },
  {
    id: "ORD-002",
    customerName: "Michael Chen",
    customerPhone: "+1 (555) 987-6543",
    address: "456 Maple Ave, Suite 200, New York, NY 10002",
    items: [
      { name: "Keto Beef Stir-fry", quantity: 1 },
      { name: "Green Detox Smoothie", quantity: 2 },
    ],
    total: 32.48,
    status: "picked-up",
    estimatedDelivery: "1:00 PM",
    distance: "3.1 km",
    mealType: "Lunch",
  },
  {
    id: "ORD-003",
    customerName: "Emily Davis",
    customerPhone: "+1 (555) 456-7890",
    address: "789 Pine Road, New York, NY 10003",
    items: [{ name: "Mediterranean Salad", quantity: 3 }],
    total: 38.97,
    status: "in-transit",
    estimatedDelivery: "1:30 PM",
    distance: "1.8 km",
    mealType: "Lunch",
  },
]

export default function DeliveryDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [orders, setOrders] = useState<DeliveryOrder[]>(mockOrders)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [staffName] = useState("John Driver")

  const activeOrders = orders.filter((o) => o.status !== "delivered")
  const completedOrders = orders.filter((o) => o.status === "delivered")
  const todayEarnings = completedOrders.length * 5 // ₹5 per delivery

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login
    if (email && password) {
      setIsLoggedIn(true)
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: DeliveryOrder["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const openNavigation = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank")
  }

  const getStatusColor = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800"
      case "picked-up":
        return "bg-blue-100 text-blue-800"
      case "in-transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
    }
  }

  const getNextStatus = (status: DeliveryOrder["status"]): DeliveryOrder["status"] | null => {
    switch (status) {
      case "assigned":
        return "picked-up"
      case "picked-up":
        return "in-transit"
      case "in-transit":
        return "delivered"
      default:
        return null
    }
  }

  const getStatusAction = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "assigned":
        return "Mark as Picked Up"
      case "picked-up":
        return "Start Delivery"
      case "in-transit":
        return "Mark as Delivered"
      default:
        return null
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">NutriDash</span>
            </div>
            <CardTitle className="text-2xl">Delivery Staff Login</CardTitle>
            <CardDescription>Access your delivery dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Staff ID / Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="driver@nutridash.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl">NutriDash Delivery</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{staffName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsLoggedIn(false)}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 px-4">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{completedOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
                  <p className="text-2xl font-bold">28 min</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">$</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Earnings</p>
                  <p className="text-2xl font-bold">${todayEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Orders</h3>
                  <p className="text-muted-foreground">New orders will appear here when assigned.</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {order.id}
                          <Badge className={getStatusColor(order.status)}>{order.status.replace("-", " ")}</Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {order.estimatedDelivery}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {order.distance}
                          </span>
                          {order.mealType && (
                            <span className="flex items-center gap-1">
                              <ChefHat className="h-3 w-3" /> {order.mealType}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <span className="text-lg font-bold text-green-600">₹{order.total.toFixed(2)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Customer Info */}
                    <div className="flex items-start justify-between bg-muted/50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {order.address}
                        </p>
                      </div>
                      <a href={`tel:${order.customerPhone}`}>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" /> Call
                        </Button>
                      </a>
                    </div>

                    {/* Order Items */}
                    <div>
                      <p className="text-sm font-medium mb-2">Order Items</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground flex justify-between">
                            <span>{item.name}</span>
                            <span>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => openNavigation(order.address)}
                      >
                        <Navigation className="h-4 w-4 mr-2" /> Navigate
                      </Button>
                      {getNextStatus(order.status) && (
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                        >
                          {getStatusAction(order.status)}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Orders Yet</h3>
                  <p className="text-muted-foreground">Completed deliveries will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              completedOrders.map((order) => (
                <Card key={order.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                        <p className="text-sm font-medium mt-1">₹{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

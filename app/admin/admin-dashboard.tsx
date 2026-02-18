"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_MEALS } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
} from "lucide-react"

// Mock admin data
const mockStats = {
  totalUsers: 1247,
  activeSubscriptions: 892,
  ordersToday: 156,
  revenue: 12450,
}

const mockOrders = [
  { id: "ORD-001", user: "John Doe", items: 3, total: 45.5, status: "preparing" },
  { id: "ORD-002", user: "Jane Smith", items: 2, total: 32.0, status: "in-transit" },
  { id: "ORD-003", user: "Mike Johnson", items: 4, total: 58.0, status: "delivered" },
  { id: "ORD-004", user: "Sarah Williams", items: 1, total: 18.5, status: "preparing" },
]

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", plan: "Premium", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", plan: "Basic", status: "active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", plan: "Standard", status: "inactive" },
]

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
]

const planDistribution = [
  { name: "Basic", value: 300, color: "#94a3b8" },
  { name: "Standard", value: 450, color: "#3b82f6" },
  { name: "Premium", value: 142, color: "#10b981" },
]

export default function AdminDashboard() {
  const [meals, setMeals] = useState(MOCK_MEALS)
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your NutriDash platform.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 flex-wrap h-auto p-1">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="meals" className="gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Meals
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((mockStats.activeSubscriptions / mockStats.totalUsers) * 100)}% of users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.ordersToday}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +8% from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.revenue.toLocaleString()}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +15% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Active subscriptions by plan type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {planDistribution.map((plan) => (
                    <div key={plan.name} className="flex items-center gap-2">
                      <div className="h-3 w-3" style={{ backgroundColor: plan.color }} />
                      <span className="text-sm">{plan.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all registered users.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-9 w-[200px]" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Plan</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4 font-medium">{user.name}</td>
                        <td className="p-4 text-muted-foreground">{user.email}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{user.plan}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meals">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meal Management</CardTitle>
                  <CardDescription>Add, edit, or remove meals from the menu.</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Meal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {meals.map((meal) => (
                  <div key={meal.id} className="border p-4 space-y-3">
                    <img src={meal.image || "/placeholder.svg"} alt={meal.name} className="w-full h-32 object-cover" />
                    <div>
                      <h3 className="font-medium">{meal.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{meal.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{meal.calories} cal</Badge>
                      <Badge variant="outline">{meal.protein}g protein</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive gap-1 bg-transparent">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>View and manage all customer orders.</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Order ID</th>
                      <th className="text-left p-4 font-medium">Customer</th>
                      <th className="text-left p-4 font-medium">Items</th>
                      <th className="text-left p-4 font-medium">Total</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="p-4 font-medium">{order.id}</td>
                        <td className="p-4">{order.user}</td>
                        <td className="p-4">{order.items} items</td>
                        <td className="p-4">₹{order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "in-transit"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Select defaultValue={order.status}>
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="in-transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Blog & Articles</CardTitle>
                <CardDescription>Manage health and diet content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Article
                </Button>
                <div className="space-y-3">
                  {[
                    { title: "10 Benefits of Keto Diet", status: "published" },
                    { title: "How to Start Meal Prepping", status: "draft" },
                    { title: "Understanding Macros", status: "published" },
                  ].map((article, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border">
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {article.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diet Plans</CardTitle>
                <CardDescription>Create and manage diet plans.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Create Diet Plan
                </Button>
                <div className="space-y-3">
                  {[
                    { name: "Weight Loss Starter", users: 234 },
                    { name: "Muscle Building Pro", users: 156 },
                    { name: "Diabetic Friendly", users: 89 },
                  ].map((plan, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border">
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-muted-foreground">{plan.users} users assigned</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

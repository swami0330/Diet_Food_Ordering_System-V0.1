"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  MessageSquare,
  ClipboardList,
  TrendingUp,
  Send,
  Plus,
  LogOut,
  User,
  Salad,
  Target,
  Activity,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Client {
  id: string
  name: string
  email: string
  age: number
  weight: number
  height: number
  goal: string
  healthConditions: string[]
  currentPlan?: string
  progress: number
  lastActive: string
}

interface ChatMessage {
  id: string
  sender: "nutritionist" | "client"
  message: string
  timestamp: string
}

interface DietPlan {
  id: string
  name: string
  description: string
  targetCalories: number
  meals: {
    type: string
    items: string[]
    calories: number
  }[]
  assignedTo: string[]
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    age: 32,
    weight: 68,
    height: 165,
    goal: "Weight Loss",
    healthConditions: ["None"],
    currentPlan: "Low Carb Plan",
    progress: 75,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    age: 45,
    weight: 82,
    height: 175,
    goal: "Diabetic Control",
    healthConditions: ["Type 2 Diabetes"],
    currentPlan: "Diabetic Friendly",
    progress: 60,
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@example.com",
    age: 28,
    weight: 58,
    height: 160,
    goal: "Muscle Gain",
    healthConditions: ["None"],
    currentPlan: "High Protein Plan",
    progress: 45,
    lastActive: "30 minutes ago",
  },
]

const mockDietPlans: DietPlan[] = [
  {
    id: "1",
    name: "Low Carb Plan",
    description: "Ideal for weight loss with controlled carbohydrate intake",
    targetCalories: 1500,
    meals: [
      { type: "Breakfast", items: ["Scrambled eggs", "Avocado", "Green smoothie"], calories: 350 },
      { type: "Lunch", items: ["Grilled chicken salad", "Olive oil dressing"], calories: 450 },
      { type: "Dinner", items: ["Salmon", "Steamed vegetables", "Cauliflower rice"], calories: 500 },
      { type: "Snacks", items: ["Nuts", "Cheese cubes"], calories: 200 },
    ],
    assignedTo: ["1"],
  },
  {
    id: "2",
    name: "Diabetic Friendly",
    description: "Low glycemic index foods for blood sugar management",
    targetCalories: 1800,
    meals: [
      { type: "Breakfast", items: ["Oatmeal with berries", "Greek yogurt"], calories: 400 },
      { type: "Lunch", items: ["Quinoa bowl", "Grilled fish", "Leafy greens"], calories: 500 },
      { type: "Dinner", items: ["Lean beef stir-fry", "Brown rice", "Vegetables"], calories: 550 },
      { type: "Snacks", items: ["Apple slices", "Almond butter"], calories: 350 },
    ],
    assignedTo: ["2"],
  },
]

export default function NutritionistDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [clients] = useState<Client[]>(mockClients)
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(mockDietPlans)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "client", message: "Hi, I have a question about my meal plan", timestamp: "10:30 AM" },
    {
      id: "2",
      sender: "nutritionist",
      message: "Of course! How can I help you today?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "client",
      message: "Can I substitute the salmon with chicken for dinner?",
      timestamp: "10:35 AM",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [showCreatePlan, setShowCreatePlan] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    targetCalories: 1800,
    goalType: "weight-loss",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoggedIn(true)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "nutritionist",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setChatMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const createDietPlan = () => {
    const plan: DietPlan = {
      id: Date.now().toString(),
      name: newPlan.name,
      description: newPlan.description,
      targetCalories: newPlan.targetCalories,
      meals: [
        { type: "Breakfast", items: ["To be customized"], calories: Math.round(newPlan.targetCalories * 0.25) },
        { type: "Lunch", items: ["To be customized"], calories: Math.round(newPlan.targetCalories * 0.35) },
        { type: "Dinner", items: ["To be customized"], calories: Math.round(newPlan.targetCalories * 0.3) },
        { type: "Snacks", items: ["To be customized"], calories: Math.round(newPlan.targetCalories * 0.1) },
      ],
      assignedTo: [],
    }
    setDietPlans((prev) => [...prev, plan])
    setShowCreatePlan(false)
    setNewPlan({ name: "", description: "", targetCalories: 1800, goalType: "weight-loss" })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Salad className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">NutriDash</span>
            </div>
            <CardTitle className="text-2xl">Nutritionist Portal</CardTitle>
            <CardDescription>Access your client management dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nutritionist@nutridash.com"
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
            <Salad className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl">NutriDash Nutritionist</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Dr. Jane Smith</span>
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
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diet Plans</p>
                  <p className="text-2xl font-bold">{dietPlans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unread Messages</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Progress</p>
                  <p className="text-2xl font-bold">60%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="clients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="diet-plans">Diet Plans</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{client.name}</CardTitle>
                          <CardDescription>{client.email}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Target className="h-3 w-3" /> Goal
                      </span>
                      <Badge variant="outline">{client.goal}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <ClipboardList className="h-3 w-3" /> Plan
                      </span>
                      <span className="font-medium">{client.currentPlan || "Not assigned"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Activity className="h-3 w-3" /> Progress
                      </span>
                      <span className="font-medium">{client.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${client.progress}%` }} />
                    </div>
                    {client.healthConditions.length > 0 && client.healthConditions[0] !== "None" && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {client.healthConditions.map((condition) => (
                          <Badge key={condition} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedClient(client)}
                      >
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <MessageSquare className="h-4 w-4 mr-1" /> Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Diet Plans Tab */}
          <TabsContent value="diet-plans" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Manage Diet Plans</h2>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowCreatePlan(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Plan
              </Button>
            </div>

            {showCreatePlan && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Diet Plan</CardTitle>
                  <CardDescription>Design a custom diet plan for your clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="planName">Plan Name</Label>
                      <Input
                        id="planName"
                        placeholder="e.g., High Protein Plan"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calories">Target Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={newPlan.targetCalories}
                        onChange={(e) => setNewPlan((p) => ({ ...p, targetCalories: Number.parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goalType">Goal Type</Label>
                    <Select value={newPlan.goalType} onValueChange={(v) => setNewPlan((p) => ({ ...p, goalType: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="diabetic-control">Diabetic Control</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the diet plan..."
                      value={newPlan.description}
                      onChange={(e) => setNewPlan((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCreatePlan(false)} className="bg-transparent">
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={createDietPlan}>
                      Create Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {dietPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <Badge>{plan.targetCalories} cal</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.meals.map((meal) => (
                        <div key={meal.type} className="flex justify-between text-sm">
                          <span className="font-medium">{meal.type}</span>
                          <span className="text-muted-foreground">{meal.calories} cal</span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Assigned to {plan.assignedTo.length} client(s)
                      </span>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Edit Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-700">SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">Sarah Johnson</CardTitle>
                    <CardDescription>Online</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[420px] p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "nutritionist" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.sender === "nutritionist" ? "bg-green-600 text-white" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === "nutritionist" ? "text-green-100" : "text-muted-foreground"
                            }`}
                          >
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button className="bg-green-600 hover:bg-green-700" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

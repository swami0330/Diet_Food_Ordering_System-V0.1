"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Scale, TrendingUp, TrendingDown, Flame, Zap, Target, Plus, Calendar } from "lucide-react"

export default function ProgressPage() {
  const { user, orders, weightHistory, addWeightEntry } = useStore()
  const [newWeight, setNewWeight] = useState("")

  const handleAddWeight = () => {
    if (!newWeight) return
    addWeightEntry({
      date: new Date().toISOString(),
      weight: Number.parseFloat(newWeight),
    })
    setNewWeight("")
  }

  // Calculate weekly calorie data from orders
  const weeklyCalories = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayOrders = orders.filter((o) => new Date(o.date).toDateString() === date.toDateString())
    const calories = dayOrders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.calories * item.quantity, 0),
      0,
    )
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      calories,
      target: user?.targetCalories || 2000,
    }
  })

  // Calculate weekly macros
  const weeklyMacros = orders
    .filter((o) => {
      const orderDate = new Date(o.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return orderDate >= weekAgo
    })
    .reduce(
      (acc, order) => {
        order.items.forEach((item) => {
          acc.protein += item.protein * item.quantity
          acc.carbs += item.carbs * item.quantity
          acc.fats += item.fats * item.quantity
          acc.calories += item.calories * item.quantity
        })
        return acc
      },
      { protein: 0, carbs: 0, fats: 0, calories: 0 },
    )

  const weightChartData = weightHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: entry.weight,
  }))

  const weightTrend =
    weightHistory.length >= 2 ? weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight : 0

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold font-serif">Health Progress</h1>
        <p className="text-muted-foreground">Track your nutritional intake and weight progress.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Calories</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyMacros.calories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Target: {((user?.targetCalories || 2000) * 7).toLocaleString()} cal
            </p>
            <Progress
              value={(weeklyMacros.calories / ((user?.targetCalories || 2000) * 7)) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Protein</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyMacros.protein}g</div>
            <p className="text-xs text-muted-foreground">Target: {(user?.targetProtein || 120) * 7}g</p>
            <Progress value={(weeklyMacros.protein / ((user?.targetProtein || 120) * 7)) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Scale className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weightHistory.length > 0 ? `${weightHistory[weightHistory.length - 1].weight} kg` : "—"}
            </div>
            {weightHistory.length >= 2 && (
              <p className={`text-xs flex items-center gap-1 ${weightTrend < 0 ? "text-green-600" : "text-red-600"}`}>
                {weightTrend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {Math.abs(weightTrend).toFixed(1)} kg {weightTrend < 0 ? "lost" : "gained"}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.goalType?.replace("-", " ") || "Not Set"}</div>
            <p className="text-xs text-muted-foreground">{user?.goalType ? "On track" : "Set a goal in profile"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calories" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="calories">Calorie Intake</TabsTrigger>
          <TabsTrigger value="weight">Weight Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="calories">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Calorie Intake</CardTitle>
              <CardDescription>Your daily calorie consumption over the past week.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyCalories}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weight History</CardTitle>
                <CardDescription>Track your weight changes over time.</CardDescription>
              </CardHeader>
              <CardContent>
                {weightChartData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weightChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis domain={["dataMin - 2", "dataMax + 2"]} className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Scale className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No weight entries yet.</p>
                      <p className="text-sm">Add your first entry to start tracking.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log Weight</CardTitle>
                <CardDescription>Record your current weight.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Enter weight"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <Button onClick={handleAddWeight} className="w-full gap-2" disabled={!newWeight}>
                  <Plus className="h-4 w-4" />
                  Add Entry
                </Button>

                {weightHistory.length > 0 && (
                  <div className="pt-4 border-t space-y-2">
                    <p className="text-sm font-medium">Recent Entries</p>
                    {weightHistory
                      .slice(-5)
                      .reverse()
                      .map((entry, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                          <span className="font-medium">{entry.weight} kg</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_MEALS } from "@/lib/mock-data"
import { CalendarDays, Clock, Plus, Trash2, Utensils, Flame, Zap, Check, Sparkles } from "lucide-react"

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    mealsPerDay: 2,
    daysPerWeek: 5,
    price: 149,
    features: ["2 meals daily", "5 days a week", "Standard delivery", "Basic meal customization"],
  },
  {
    id: "standard",
    name: "Standard Plan",
    mealsPerDay: 3,
    daysPerWeek: 6,
    price: 249,
    features: [
      "3 meals daily",
      "6 days a week",
      "Priority delivery",
      "Full meal customization",
      "Nutritionist consultation",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    mealsPerDay: 3,
    daysPerWeek: 7,
    price: 349,
    features: [
      "3 meals daily",
      "7 days a week",
      "Express delivery",
      "Custom diet plan",
      "Weekly nutritionist calls",
      "Snacks included",
    ],
  },
]

export default function DietPlansPage() {
  const { mealSchedules, addMealSchedule, removeMealSchedule, subscription, setSubscription, user } = useStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner">("breakfast")
  const [selectedMealId, setSelectedMealId] = useState<string>("")

  const handleScheduleMeal = () => {
    if (!selectedDate || !selectedMealId) return

    addMealSchedule({
      mealId: selectedMealId,
      date: selectedDate.toISOString(),
      mealType: selectedMealType,
      status: "scheduled",
    })
    setSelectedMealId("")
  }

  const handleSubscribe = (plan: (typeof subscriptionPlans)[0]) => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    setSubscription({
      id: `SUB-${Date.now()}`,
      name: plan.name,
      mealsPerDay: plan.mealsPerDay,
      daysPerWeek: plan.daysPerWeek,
      price: plan.price,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      active: true,
    })
  }

  const scheduledForDate = mealSchedules.filter(
    (s) => selectedDate && new Date(s.date).toDateString() === selectedDate.toDateString(),
  )

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold font-serif">Diet Plans & Scheduling</h1>
        <p className="text-muted-foreground">Choose a subscription plan or schedule individual meals.</p>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-8">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="subscriptions" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Subscription Plans
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Meal Scheduler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          {subscription?.active ? (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{subscription.name}</CardTitle>
                    <CardDescription>Your active subscription</CardDescription>
                  </div>
                  <Badge className="bg-primary">{subscription.mealsPerDay} meals/day</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center p-4 bg-background border">
                    <p className="text-2xl font-bold">₹{subscription.price}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                  <div className="text-center p-4 bg-background border">
                    <p className="text-2xl font-bold">{subscription.daysPerWeek}</p>
                    <p className="text-sm text-muted-foreground">days per week</p>
                  </div>
                  <div className="text-center p-4 bg-background border">
                    <p className="text-2xl font-bold">
                      {new Date(subscription.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <p className="text-sm text-muted-foreground">renewal date</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setSubscription(null)} className="w-full">
                  Cancel Subscription
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {subscriptionPlans.map((plan, idx) => (
                <Card key={plan.id} className={`relative ${idx === 1 ? "border-primary shadow-lg scale-105" : ""}`}>
                  {idx === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">₹{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full ${idx === 1 ? "bg-primary hover:bg-primary/90" : ""}`}
                      variant={idx === 1 ? "default" : "outline"}
                    >
                      Subscribe Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule a Meal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meal Type</label>
                    <Select value={selectedMealType} onValueChange={(v: any) => setSelectedMealType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Meal</label>
                    <Select value={selectedMealId} onValueChange={setSelectedMealId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a meal" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_MEALS.map((meal) => (
                          <SelectItem key={meal.id} value={meal.id}>
                            {meal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleScheduleMeal} className="w-full gap-2" disabled={!selectedMealId}>
                    <Plus className="h-4 w-4" />
                    Add to Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <CardDescription>Scheduled meals for this day</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduledForDate.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Utensils className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No meals scheduled for this date.</p>
                      <p className="text-sm">Select a meal and add it to your schedule.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {["breakfast", "lunch", "dinner"].map((mealType) => {
                        const meals = scheduledForDate.filter((s) => s.mealType === mealType)
                        if (meals.length === 0) return null

                        return (
                          <div key={mealType}>
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {mealType}
                            </h4>
                            {meals.map((schedule) => {
                              const meal = MOCK_MEALS.find((m) => m.id === schedule.mealId)
                              if (!meal) return null

                              return (
                                <div key={schedule.id} className="flex items-center gap-4 p-4 border bg-card">
                                  <img
                                    src={meal.image || "/placeholder.svg"}
                                    alt={meal.name}
                                    className="h-16 w-16 object-cover"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium">{meal.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <Flame className="h-3 w-3 text-orange-500" />
                                        {meal.calories} cal
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Zap className="h-3 w-3 text-blue-500" />
                                        {meal.protein}g protein
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeMealSchedule(schedule.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, ShoppingCart, Zap, Flame, Info, Sun, Utensils, Moon } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { MOCK_MEALS } from "@/lib/mock-data"

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [mealTimeFilter, setMealTimeFilter] = useState("All")
  const [dietTypeFilter, setDietTypeFilter] = useState("All")
  const [planTypeFilter, setPlanTypeFilter] = useState("All")
  const { addToCart } = useStore()

  const filteredMeals = MOCK_MEALS.filter((meal) => {
    const matchesTab =
      activeTab === "All" || meal.dietaryTags.includes(activeTab.toLowerCase()) || meal.goals.includes(activeTab)

    const matchesSearch =
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesMealTime = mealTimeFilter === "All" || meal.mealTime === mealTimeFilter
    const matchesDietType = dietTypeFilter === "All" || meal.dietType === dietTypeFilter
    const matchesPlanType = planTypeFilter === "All" || meal.planType === planTypeFilter

    return matchesTab && matchesSearch && matchesMealTime && matchesDietType && matchesPlanType
  })

  const getMealTimeIcon = (mealTime?: string) => {
    switch (mealTime) {
      case "Breakfast":
        return <Sun className="h-3 w-3" />
      case "Lunch":
        return <Utensils className="h-3 w-3" />
      case "Dinner":
        return <Moon className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Our Nutritious Menu</h1>
            <p className="text-muted-foreground">Expertly crafted meals for your fitness goals.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dishes..."
                className="pl-9 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={mealTimeFilter} onValueChange={setMealTimeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Meal Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Times</SelectItem>
              <SelectItem value="Breakfast">Breakfast</SelectItem>
              <SelectItem value="Lunch">Lunch</SelectItem>
              <SelectItem value="Dinner">Dinner</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dietTypeFilter} onValueChange={setDietTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Diet Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Diets</SelectItem>
              <SelectItem value="Veg">Vegetarian</SelectItem>
              <SelectItem value="Non-Veg">Non-Veg</SelectItem>
              <SelectItem value="Vegan">Vegan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planTypeFilter} onValueChange={setPlanTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Plan Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Plans</SelectItem>
              <SelectItem value="WeightLoss">Weight Loss</SelectItem>
              <SelectItem value="WeightGain">Weight Gain</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          {(mealTimeFilter !== "All" || dietTypeFilter !== "All" || planTypeFilter !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMealTimeFilter("All")
                setDietTypeFilter("All")
                setPlanTypeFilter("All")
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <Tabs defaultValue="All" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="h-auto p-1 bg-muted flex-wrap justify-start">
            {["All", "Keto", "Vegan", "Muscle Gain", "Weight Loss", "Maintenance"].map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-md px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredMeals.length} meal{filteredMeals.length !== 1 ? "s" : ""}
          </div>

          <div className="grid gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMeals.map((meal) => (
              <Card key={meal.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={meal.image || "/placeholder.svg"}
                    alt={meal.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                    {meal.dietaryTags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-background/90 text-foreground hover:bg-background/90 border-none backdrop-blur-sm capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1">
                    {meal.mealTime && (
                      <Badge variant="secondary" className="backdrop-blur-sm flex items-center gap-1">
                        {getMealTimeIcon(meal.mealTime)}
                        {meal.mealTime}
                      </Badge>
                    )}
                  </div>
                  {meal.dietType && (
                    <Badge
                      className={`absolute bottom-3 left-3 backdrop-blur-sm ${
                        meal.dietType === "Veg"
                          ? "bg-green-600 hover:bg-green-700"
                          : meal.dietType === "Vegan"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {meal.dietType}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight">{meal.name}</h3>
                    <span className="font-bold text-green-700">₹{meal.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{meal.description}</p>

                  <div className="grid grid-cols-4 gap-2 border-y py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                        <Flame className="h-3 w-3" />
                        <span>Cal</span>
                      </div>
                      <span className="text-foreground text-xs">{meal.calories}</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Zap className="h-3 w-3" />
                        <span>Prot</span>
                      </div>
                      <span className="text-foreground text-xs">{meal.protein}g</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <Info className="h-3 w-3" />
                        <span>Carb</span>
                      </div>
                      <span className="text-foreground text-xs">{meal.carbs}g</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                        <Info className="h-3 w-3" />
                        <span>Fat</span>
                      </div>
                      <span className="text-foreground text-xs">{meal.fats}g</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button onClick={() => addToCart(meal)} className="w-full bg-green-600 hover:bg-green-700 gap-2">
                    <ShoppingCart className="h-4 w-4" /> Add to Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No meals found matching your criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setActiveTab("All")
                  setMealTimeFilter("All")
                  setDietTypeFilter("All")
                  setPlanTypeFilter("All")
                  setSearchQuery("")
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  )
}

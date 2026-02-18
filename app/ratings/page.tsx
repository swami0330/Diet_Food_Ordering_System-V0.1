"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MOCK_MEALS } from "@/lib/mock-data"
import { Star, MessageSquare, ThumbsUp } from "lucide-react"

export default function RatingsPage() {
  const { ratings, addRating, orders } = useStore()
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)

  // Get unique meals from orders
  const orderedMealIds = [...new Set(orders.flatMap((o) => o.items.map((i) => i.id)))]
  const orderedMeals = MOCK_MEALS.filter((m) => orderedMealIds.includes(m.id))

  const handleSubmitRating = () => {
    if (!selectedMeal || rating === 0) return

    addRating({
      mealId: selectedMeal,
      rating,
      review,
      date: new Date().toISOString(),
    })

    setSelectedMeal(null)
    setRating(0)
    setReview("")
  }

  const getMealRating = (mealId: string) => {
    return ratings.find((r) => r.mealId === mealId)
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold font-serif">Ratings & Reviews</h1>
        <p className="text-muted-foreground">Share your feedback on the meals you've ordered.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Ordered Meals</CardTitle>
              <CardDescription>Rate and review meals you've received.</CardDescription>
            </CardHeader>
            <CardContent>
              {orderedMeals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No meals to review yet.</p>
                  <p className="text-sm">Order some meals to start reviewing them.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderedMeals.map((meal) => {
                    const existingRating = getMealRating(meal.id)

                    return (
                      <div
                        key={meal.id}
                        className={`flex items-start gap-4 p-4 border transition-colors ${
                          selectedMeal === meal.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <img
                          src={meal.image || "/placeholder.svg"}
                          alt={meal.name}
                          className="h-20 w-20 object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{meal.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{meal.description}</p>
                            </div>
                            {existingRating ? (
                              <Badge variant="secondary" className="gap-1">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                {existingRating.rating}
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant={selectedMeal === meal.id ? "default" : "outline"}
                                onClick={() => setSelectedMeal(selectedMeal === meal.id ? null : meal.id)}
                              >
                                Rate
                              </Button>
                            )}
                          </div>

                          {existingRating && existingRating.review && (
                            <p className="mt-2 text-sm text-muted-foreground italic">"{existingRating.review}"</p>
                          )}

                          {selectedMeal === meal.id && !existingRating && (
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="p-1"
                                  >
                                    <Star
                                      className={`h-6 w-6 transition-colors ${
                                        star <= (hoveredStar || rating)
                                          ? "fill-yellow-500 text-yellow-500"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  </button>
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}
                                </span>
                              </div>
                              <Textarea
                                placeholder="Write your review (optional)"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows={2}
                              />
                              <Button onClick={handleSubmitRating} disabled={rating === 0} className="w-full">
                                Submit Review
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Reviews</CardTitle>
              <CardDescription>Summary of your feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 bg-muted/50">
                  <p className="text-4xl font-bold">{ratings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </div>
                {ratings.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Average Rating</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        {(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>5 Star Reviews</span>
                      <span>{ratings.filter((r) => r.rating === 5).length}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <ThumbsUp className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-medium">Your Feedback Matters</h3>
                <p className="text-sm text-muted-foreground">
                  Help us improve by rating your meals. Your reviews help other customers make better choices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

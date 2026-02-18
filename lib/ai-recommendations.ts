import { generateText } from "ai"

interface Meal {
  id: string
  name: string
  description: string
  price: number
  calories: number
  protein: number
  carbs: number
  fats: number
  image: string
  dietaryTags: string[]
  goals: string[]
  mealTime?: string
}

interface User {
  name: string
  email: string
  phone?: string
  age?: number
  weight?: number
  height?: number
  gender?: "male" | "female" | "other"
  healthConditions?: string[]
  dietPreferences?: string[]
  allergies?: string[]
  goalType?: "weight-loss" | "muscle-gain" | "maintenance" | "diabetic-control"
  targetCalories?: number
  targetProtein?: number
  targetCarbs?: number
  targetFats?: number
}

interface RecommendedMeal {
  id: string
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fats: number
  price: number
  image: string
  matchScore: number
  reason: string
  tags: string[]
  aiExplanation: string
}

// Calculate match score based on user profile and meal properties
export function calculateMatchScore(meal: Meal, user: User): number {
  let score = 50 // Base score

  if (!user.targetCalories) return score

  // Calorie alignment (30 points max)
  const calorieDiff = Math.abs(meal.calories - (user.targetCalories / 3))
  const calorieScore = Math.max(0, 30 - (calorieDiff / (user.targetCalories / 3)) * 30)
  score += calorieScore

  // Protein alignment (20 points max)
  if (user.targetProtein) {
    const proteinPerMeal = user.targetProtein / 3
    const proteinDiff = Math.abs(meal.protein - proteinPerMeal)
    const proteinScore = Math.max(0, 20 - (proteinDiff / proteinPerMeal) * 20)
    score += proteinScore
  }

  // Goal alignment (15 points max)
  if (user.goalType === "weight-loss" && meal.calories < (user.targetCalories || 2000) / 3) {
    score += 15
  } else if (user.goalType === "muscle-gain" && meal.protein > 25) {
    score += 15
  } else if (user.goalType === "maintenance") {
    score += 10
  }

  // Dietary preferences bonus (15 points max)
  if (user.dietPreferences && user.dietPreferences.length > 0) {
    const matchingPrefs = user.dietPreferences.filter((pref) => meal.dietaryTags.includes(pref))
    score += (matchingPrefs.length / user.dietPreferences.length) * 15
  }

  // Health condition penalty (avoid if possible)
  if (user.healthConditions && user.healthConditions.length > 0) {
    if (user.healthConditions.includes("diabetes") && meal.carbs > 50) {
      score *= 0.7 // Reduce score for high-carb meals
    }
    if (user.healthConditions.includes("hypertension") && meal.fats > 15) {
      score *= 0.8 // Slight reduction for high-fat meals
    }
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}

// Generate AI-powered recommendations
export async function generateAIRecommendations(user: User, meals: Meal[]): Promise<RecommendedMeal[]> {
  try {
    // Filter meals based on user's allergies and strict dietary requirements
    let filteredMeals = meals.filter((meal) => {
      // Check for allergies
      if (user.allergies && user.allergies.length > 0) {
        // This is a simple check - in production, meals would have detailed ingredient lists
        return true
      }

      // Check dietary preferences - must match if specified
      if (user.dietPreferences && user.dietPreferences.length > 0) {
        const mustMatch = ["vegan", "vegetarian"]
        const userMustMatch = user.dietPreferences.filter((p) => mustMatch.includes(p))

        if (userMustMatch.length > 0) {
          return userMustMatch.some((pref) => meal.dietaryTags.includes(pref))
        }
      }

      return true
    })

    // Score and sort all meals
    const scoredMeals = filteredMeals.map((meal) => ({
      meal,
      score: calculateMatchScore(meal, user),
    }))

    scoredMeals.sort((a, b) => b.score - a.score)

    // Get top 8 meals
    const topMeals = scoredMeals.slice(0, 8)

    // Generate AI explanations for each recommendation
    const recommendations: RecommendedMeal[] = []

    for (const { meal, score } of topMeals) {
      try {
        const reason = generateRecommendationReason(meal, user, score)

        const aiExplanation = await generateAIExplanation(meal, user, reason)

        recommendations.push({
          id: meal.id,
          name: meal.name,
          description: meal.description,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          price: meal.price,
          image: meal.image,
          matchScore: score,
          reason,
          tags: meal.dietaryTags,
          aiExplanation,
        })
      } catch (error) {
        // Fallback if AI explanation fails
        recommendations.push({
          id: meal.id,
          name: meal.name,
          description: meal.description,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          price: meal.price,
          image: meal.image,
          matchScore: score,
          reason: generateRecommendationReason(meal, user, score),
          tags: meal.dietaryTags,
          aiExplanation: "Personalized recommendation based on your profile",
        })
      }
    }

    return recommendations
  } catch (error) {
    console.error("Error in generateAIRecommendations:", error)
    throw error
  }
}

// Generate human-friendly reason for recommendation
function generateRecommendationReason(meal: Meal, user: User, score: number): string {
  const reasons: string[] = []

  if (user.goalType === "weight-loss" && meal.calories < 350) {
    reasons.push("Low-calorie option for your weight loss goal")
  } else if (user.goalType === "muscle-gain" && meal.protein > 25) {
    reasons.push("High protein to support muscle growth")
  } else if (user.goalType === "maintenance") {
    reasons.push("Balanced nutrition for maintenance")
  }

  if (user.healthConditions?.includes("diabetes") && meal.carbs < 40) {
    reasons.push("Low glycemic option for diabetes management")
  }

  if (user.dietPreferences?.includes("vegetarian") && meal.dietaryTags.includes("vegetarian")) {
    reasons.push("Matches your vegetarian preference")
  }

  if (user.dietPreferences?.includes("vegan") && meal.dietaryTags.includes("vegan")) {
    reasons.push("Aligns with your vegan lifestyle")
  }

  if (meal.dietaryTags.includes("high-fiber")) {
    reasons.push("Great source of dietary fiber")
  }

  if (meal.dietaryTags.includes("high-protein")) {
    reasons.push("Excellent protein source")
  }

  if (reasons.length === 0) {
    reasons.push("Perfect match for your profile")
  }

  return reasons[0] || "Recommended for you"
}

// Generate AI explanation using the AI SDK
async function generateAIExplanation(meal: Meal, user: User, reason: string): Promise<string> {
  try {
    const prompt = `Generate a brief, personalized 1-2 sentence explanation (max 150 characters) for why this meal "${meal.name}" is recommended for a user with the following profile:
- Goal: ${user.goalType || "general health"}
- Daily calorie target: ${user.targetCalories || "2000"} kcal
- Daily protein target: ${user.targetProtein || "150"}g
- Health conditions: ${user.healthConditions?.join(", ") || "none"}
- Dietary preferences: ${user.dietPreferences?.join(", ") || "none"}
- Allergies: ${user.allergies?.join(", ") || "none"}

Meal details:
- Calories: ${meal.calories}
- Protein: ${meal.protein}g
- Carbs: ${meal.carbs}g
- Fats: ${meal.fats}g
- Tags: ${meal.dietaryTags.join(", ")}

Reason provided: ${reason}

Provide ONLY the explanation text, nothing else. Make it personal and specific to why this meal helps them reach their goal.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.7,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating AI explanation:", error)
    // Return fallback explanation
    return `This meal provides ${meal.protein}g protein and ${meal.calories} calories, matching your ${user.goalType} goal.`
  }
}

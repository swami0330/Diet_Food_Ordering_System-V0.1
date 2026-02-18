"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  RefreshCw,
  ShoppingCart,
  Flame,
  Target,
  Heart,
  Mic,
  MicOff,
  Barcode,
  Languages,
  TrendingUp,
  Clock,
  Zap,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_MEALS } from "@/lib/mock-data"
import { generateAIRecommendations, calculateMatchScore } from "@/lib/ai-recommendations"

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

const translations: Record<string, Record<string, string>> = {
  en: {
    title: "AI-Powered Recommendations",
    subtitle: "Personalized meal suggestions based on your health profile and goals",
    forYou: "For You",
    trending: "Trending",
    quickMeals: "Quick Meals",
    refresh: "Refresh Suggestions",
    addToCart: "Add to Cart",
    match: "Match",
    voiceOrder: "Voice Ordering",
    speakToOrder: "Tap to speak your order",
    listening: "Listening...",
    barcodeScanner: "Barcode Scanner",
    scanToCheck: "Scan food barcode to check calories",
    language: "Language",
    generating: "Generating AI recommendations...",
    loadingProfile: "Loading your health profile...",
    noProfile: "Please complete your profile to get personalized recommendations",
  },
  es: {
    title: "Recomendaciones con IA",
    subtitle: "Sugerencias de comidas personalizadas basadas en tu perfil de salud",
    forYou: "Para Ti",
    trending: "Tendencias",
    quickMeals: "Comidas Rápidas",
    refresh: "Actualizar Sugerencias",
    addToCart: "Añadir al Carrito",
    match: "Coincidencia",
    voiceOrder: "Pedido por Voz",
    speakToOrder: "Toca para decir tu pedido",
    listening: "Escuchando...",
    barcodeScanner: "Escáner de Código de Barras",
    scanToCheck: "Escanea el código de barras para verificar calorías",
    language: "Idioma",
  },
  fr: {
    title: "Recommandations par IA",
    subtitle: "Suggestions de repas personnalisées basées sur votre profil de santé",
    forYou: "Pour Vous",
    trending: "Tendances",
    quickMeals: "Repas Rapides",
    refresh: "Actualiser les Suggestions",
    addToCart: "Ajouter au Panier",
    match: "Correspondance",
    voiceOrder: "Commande Vocale",
    speakToOrder: "Appuyez pour dicter votre commande",
    listening: "Écoute...",
    barcodeScanner: "Scanner de Code-Barres",
    scanToCheck: "Scannez le code-barres pour vérifier les calories",
    language: "Langue",
  },
  hi: {
    title: "AI-संचालित सिफारिशें",
    subtitle: "आपके स्वास्थ्य प्रोफाइल और लक्ष्यों के आधार पर व्यक्तिगत भोजन सुझाव",
    forYou: "आपके लिए",
    trending: "ट्रेंडिंग",
    quickMeals: "त्वरित भोजन",
    refresh: "सुझाव रीफ्रेश करें",
    addToCart: "कार्ट में डालें",
    match: "मैच",
    voiceOrder: "वॉइस ऑर्डरिंग",
    speakToOrder: "अपना ऑर्डर बोलने के लिए टैप करें",
    listening: "सुन रहा है...",
    barcodeScanner: "बारकोड स्कैनर",
    scanToCheck: "कैलोरी जांचने के लिए फूड बारकोड स्कैन करें",
    language: "भाषा",
  },
}

export default function RecommendationsPage() {
  const { user, addToCart } = useStore()
  const [recommendations, setRecommendations] = useState<RecommendedMeal[]>([])
  const [loading, setLoading] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")
  const [scannedFood, setScannedFood] = useState<{ name: string; calories: number } | null>(null)
  const [language, setLanguage] = useState("en")

  const t = translations[language]

  useEffect(() => {
    generateRecommendations()
  }, [user])

  const generateRecommendations = async () => {
    setLoading(true)

    try {
      if (!user || !user.targetCalories) {
        setRecommendations([])
        setLoading(false)
        return
      }

      // Get AI-powered recommendations
      const aiRecs = await generateAIRecommendations(user, MOCK_MEALS)
      setRecommendations(aiRecs)
    } catch (err) {
      console.error("Error generating recommendations:", err)
      // Fallback to basic recommendations if AI fails
      const fallbackRecs = generateFallbackRecommendations(user)
      setRecommendations(fallbackRecs)
    } finally {
      setLoading(false)
    }
  }

  const generateFallbackRecommendations = (user: any) => {
    if (!user) return []

    return MOCK_MEALS.slice(0, 12)
      .map((meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        price: meal.price,
        image: meal.image,
        matchScore: calculateMatchScore(meal, user),
        reason: `Great choice for ${user.goalType || "your goals"}`,
        tags: meal.dietaryTags,
        aiExplanation: "Recommendation based on your profile",
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  const handleVoiceOrder = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in your browser")
      return
    }

    setIsListening(true)
    setTimeout(() => {
      setVoiceText("I would like to order a grilled salmon bowl and a quinoa salad")
      setIsListening(false)
    }, 3000)
  }

  const handleBarcodeScan = () => {
    if (!barcodeInput) return

    const mockFoods: Record<string, { name: string; calories: number }> = {
      "123456789": { name: "Greek Yogurt", calories: 150 },
      "987654321": { name: "Protein Bar", calories: 220 },
      "456789123": { name: "Almond Milk", calories: 30 },
    }

    const food = mockFoods[barcodeInput] || { name: "Unknown Food", calories: Math.floor(Math.random() * 300 + 100) }
    setScannedFood(food)
  }

  if (!user) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
          <p className="text-muted-foreground">You need to be logged in to access personalized recommendations.</p>
        </div>
      </div>
    )
  }

  const trendingMeals = recommendations.slice(0, 2)
  const quickMeals = recommendations.filter((m) => m.calories < 400)

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-green-600" />
              {t.title}
            </h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[140px]">
                <Languages className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={generateRecommendations} disabled={loading} className="bg-transparent">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? t.generating : t.refresh}
            </Button>
          </div>
        </div>

        {/* User Profile Summary */}
        {user && (
          <Card className="mb-8 border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-muted-foreground">Your Goal</p>
                  <p className="font-semibold capitalize">{user.goalType?.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Calorie Target</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" /> {user.targetCalories} kcal
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Protein Target</p>
                  <p className="font-semibold">{user.targetProtein}g / day</p>
                </div>
                {user.allergies && user.allergies.length > 0 && (
                  <div className="col-span-full">
                    <p className="text-sm text-muted-foreground mb-1">Allergies to Avoid</p>
                    <div className="flex gap-2 flex-wrap">
                      {user.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-xs">
                          ⚠️ {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Smart Features Row */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {/* Voice Ordering */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="h-5 w-5 text-green-600" />
                {t.voiceOrder}
              </CardTitle>
              <CardDescription>{t.speakToOrder}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  className={`h-16 w-16 rounded-full ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
                  onClick={handleVoiceOrder}
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                {isListening && (
                  <div className="flex items-center gap-2 text-red-500">
                    <span className="animate-pulse">{t.listening}</span>
                  </div>
                )}
                {voiceText && (
                  <div className="w-full p-3 bg-muted rounded-lg">
                    <p className="text-sm italic">"{voiceText}"</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Barcode Scanner */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Barcode className="h-5 w-5 text-green-600" />
                {t.barcodeScanner}
              </CardTitle>
              <CardDescription>{t.scanToCheck}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter barcode number..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                />
                <Button onClick={handleBarcodeScan} className="bg-green-600 hover:bg-green-700">
                  Scan
                </Button>
              </div>
              {scannedFood && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium">{scannedFood.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Flame className="h-3 w-3" /> {scannedFood.calories} calories
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Tabs */}
        <Tabs defaultValue="for-you" className="space-y-6">
          <TabsList>
            <TabsTrigger value="for-you" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> {t.forYou}
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> {t.trending}
            </TabsTrigger>
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> {t.quickMeals}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="for-you">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">{t.noProfile}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {recommendations.map((meal) => (
                  <Card key={meal.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <Badge className="bg-green-600">
                          <Zap className="h-3 w-3 mr-1" />
                          {meal.matchScore}% {t.match}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{meal.name}</h3>
                          <p className="text-sm text-muted-foreground">{meal.description}</p>
                        </div>
                        <span className="text-lg font-bold text-green-600">₹{meal.price}</span>
                      </div>

                      <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                        <p className="font-medium flex items-start gap-1">
                          <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{meal.reason}</span>
                        </p>
                        <p className="text-blue-600 mt-1 ml-4">{meal.aiExplanation}</p>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {meal.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs mb-4">
                        <div className="p-2 bg-muted rounded">
                          <Flame className="h-3 w-3 mx-auto mb-1 text-orange-500" />
                          <span className="font-medium">{meal.calories}</span>
                          <p className="text-muted-foreground">cal</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <span className="font-medium">{meal.protein}g</span>
                          <p className="text-muted-foreground">protein</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <span className="font-medium">{meal.carbs}g</span>
                          <p className="text-muted-foreground">carbs</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <span className="font-medium">{meal.fats}g</span>
                          <p className="text-muted-foreground">fats</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Heart className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            addToCart({
                              id: meal.id,
                              name: meal.name,
                              description: meal.description,
                              price: meal.price,
                              calories: meal.calories,
                              protein: meal.protein,
                              carbs: meal.carbs,
                              fats: meal.fats,
                              image: meal.image,
                              dietaryTags: meal.tags,
                              goals: [],
                            })
                          }
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" /> {t.addToCart}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending">
            <div className="grid gap-6 md:grid-cols-2">
              {trendingMeals.map((meal) => (
                <Card key={meal.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500">
                        <TrendingUp className="h-3 w-3 mr-1" /> Trending
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600">₹{meal.price}</span>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          addToCart({
                            id: meal.id,
                            name: meal.name,
                            description: meal.description,
                            price: meal.price,
                            calories: meal.calories,
                            protein: meal.protein,
                            carbs: meal.carbs,
                            fats: meal.fats,
                            image: meal.image,
                            dietaryTags: meal.tags,
                            goals: [],
                          })
                        }
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" /> {t.addToCart}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quick">
            <div className="grid gap-6 md:grid-cols-2">
              {quickMeals.map((meal) => (
                <Card key={meal.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-500">
                        <Clock className="h-3 w-3 mr-1" /> Under 400 cal
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">₹{meal.price}</span>
                        <span className="text-sm text-muted-foreground">{meal.calories} cal</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          addToCart({
                            id: meal.id,
                            name: meal.name,
                            description: meal.description,
                            price: meal.price,
                            calories: meal.calories,
                            protein: meal.protein,
                            carbs: meal.carbs,
                            fats: meal.fats,
                            image: meal.image,
                            dietaryTags: meal.tags,
                            goals: [],
                          })
                        }
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" /> {t.addToCart}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Heart, Target, AlertCircle, Save, Calculator } from "lucide-react"

const healthConditions = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "High Blood Pressure" },
  { id: "thyroid", label: "Thyroid" },
  { id: "cholesterol", label: "High Cholesterol" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "kidney-disease", label: "Kidney Disease" },
]

const dietPreferences = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
]

const commonAllergies = [
  { id: "nuts", label: "Nuts" },
  { id: "shellfish", label: "Shellfish" },
  { id: "eggs", label: "Eggs" },
  { id: "soy", label: "Soy" },
  { id: "wheat", label: "Wheat" },
  { id: "dairy", label: "Dairy" },
]

export default function ProfilePage() {
  const { user, updateUserProfile } = useStore()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    weight: "",
    height: "",
    gender: "" as "male" | "female" | "other" | "",
    healthConditions: [] as string[],
    dietPreferences: [] as string[],
    allergies: [] as string[],
    goalType: "" as "weight-loss" | "muscle-gain" | "maintenance" | "diabetic-control" | "",
    targetCalories: "",
    targetProtein: "",
    targetCarbs: "",
    targetFats: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      age: user.age?.toString() || "",
      weight: user.weight?.toString() || "",
      height: user.height?.toString() || "",
      gender: user.gender || "",
      healthConditions: user.healthConditions || [],
      dietPreferences: user.dietPreferences || [],
      allergies: user.allergies || [],
      goalType: user.goalType || "",
      targetCalories: user.targetCalories?.toString() || "",
      targetProtein: user.targetProtein?.toString() || "",
      targetCarbs: user.targetCarbs?.toString() || "",
      targetFats: user.targetFats?.toString() || "",
    })
  }, [user, router])

  const calculateMacros = () => {
    if (!formData.weight || !formData.height || !formData.age || !formData.gender || !formData.goalType) return

    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height)
    const age = Number.parseInt(formData.age)

    // Mifflin-St Jeor Equation for BMR
    let bmr: number
    if (formData.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Activity multiplier (assuming moderate activity)
    const tdee = bmr * 1.55

    // Adjust based on goal
    let calories: number
    switch (formData.goalType) {
      case "weight-loss":
        calories = tdee - 500
        break
      case "muscle-gain":
        calories = tdee + 300
        break
      case "diabetic-control":
        calories = tdee - 200
        break
      default:
        calories = tdee
    }

    // Calculate macros
    const protein = weight * (formData.goalType === "muscle-gain" ? 2.2 : 1.6)
    const fats = (calories * 0.25) / 9
    const carbs = (calories - protein * 4 - fats * 9) / 4

    setFormData((prev) => ({
      ...prev,
      targetCalories: Math.round(calories).toString(),
      targetProtein: Math.round(protein).toString(),
      targetCarbs: Math.round(carbs).toString(),
      targetFats: Math.round(fats).toString(),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    updateUserProfile({
      name: formData.name,
      phone: formData.phone,
      age: formData.age ? Number.parseInt(formData.age) : undefined,
      weight: formData.weight ? Number.parseFloat(formData.weight) : undefined,
      height: formData.height ? Number.parseFloat(formData.height) : undefined,
      gender: formData.gender || undefined,
      healthConditions: formData.healthConditions,
      dietPreferences: formData.dietPreferences,
      allergies: formData.allergies,
      goalType: formData.goalType || undefined,
      targetCalories: formData.targetCalories ? Number.parseInt(formData.targetCalories) : undefined,
      targetProtein: formData.targetProtein ? Number.parseInt(formData.targetProtein) : undefined,
      targetCarbs: formData.targetCarbs ? Number.parseInt(formData.targetCarbs) : undefined,
      targetFats: formData.targetFats ? Number.parseInt(formData.targetFats) : undefined,
    })

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const toggleArrayItem = (array: string[], item: string, field: keyof typeof formData) => {
    const newArray = array.includes(item) ? array.filter((i) => i !== item) : [...array, item]
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  if (!user) return null

  return (
    <div className="container px-4 py-8 md:px-6 max-w-4xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold font-serif">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal details and health information.</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="diet" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Diet</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic personal details for delivery and communication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: "male" | "female" | "other") =>
                      setFormData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>
                Help us personalize your meal recommendations based on your health needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                    placeholder="175"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Health Conditions</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {healthConditions.map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition.id}
                        checked={formData.healthConditions.includes(condition.id)}
                        onCheckedChange={() =>
                          toggleArrayItem(formData.healthConditions, condition.id, "healthConditions")
                        }
                      />
                      <Label htmlFor={condition.id} className="text-sm font-normal cursor-pointer">
                        {condition.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Food Allergies
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {commonAllergies.map((allergy) => (
                    <div key={allergy.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`allergy-${allergy.id}`}
                        checked={formData.allergies.includes(allergy.id)}
                        onCheckedChange={() => toggleArrayItem(formData.allergies, allergy.id, "allergies")}
                      />
                      <Label htmlFor={`allergy-${allergy.id}`} className="text-sm font-normal cursor-pointer">
                        {allergy.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diet">
          <Card>
            <CardHeader>
              <CardTitle>Diet Preferences</CardTitle>
              <CardDescription>Select your dietary preferences to filter meal recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Dietary Preferences</Label>
                <div className="flex flex-wrap gap-2">
                  {dietPreferences.map((pref) => (
                    <Badge
                      key={pref.id}
                      variant={formData.dietPreferences.includes(pref.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        formData.dietPreferences.includes(pref.id) ? "bg-primary hover:bg-primary/90" : "hover:bg-muted"
                      }`}
                      onClick={() => toggleArrayItem(formData.dietPreferences, pref.id, "dietPreferences")}
                    >
                      {pref.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Goal Type</Label>
                <Select
                  value={formData.goalType}
                  onValueChange={(value: "weight-loss" | "muscle-gain" | "maintenance" | "diabetic-control") =>
                    setFormData((prev) => ({ ...prev, goalType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="diabetic-control">Diabetic Control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Macro Goals</CardTitle>
              <CardDescription>Set your daily nutritional targets or let us calculate them for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button type="button" variant="outline" onClick={calculateMacros} className="w-full gap-2 bg-transparent">
                <Calculator className="h-4 w-4" />
                Auto-Calculate Based on My Profile
              </Button>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetCalories">Daily Calories</Label>
                  <Input
                    id="targetCalories"
                    type="number"
                    value={formData.targetCalories}
                    onChange={(e) => setFormData((prev) => ({ ...prev, targetCalories: e.target.value }))}
                    placeholder="2000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetProtein">Protein (g)</Label>
                  <Input
                    id="targetProtein"
                    type="number"
                    value={formData.targetProtein}
                    onChange={(e) => setFormData((prev) => ({ ...prev, targetProtein: e.target.value }))}
                    placeholder="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetCarbs">Carbs (g)</Label>
                  <Input
                    id="targetCarbs"
                    type="number"
                    value={formData.targetCarbs}
                    onChange={(e) => setFormData((prev) => ({ ...prev, targetCarbs: e.target.value }))}
                    placeholder="250"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetFats">Fats (g)</Label>
                  <Input
                    id="targetFats"
                    type="number"
                    value={formData.targetFats}
                    onChange={(e) => setFormData((prev) => ({ ...prev, targetFats: e.target.value }))}
                    placeholder="65"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        {success && <p className="text-sm text-primary">Profile saved successfully!</p>}
        <div className="ml-auto">
          <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

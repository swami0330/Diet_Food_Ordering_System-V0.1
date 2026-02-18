"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  calories: number
  protein: number
  carbs: number
  fats: number
  image: string
  dietaryTags: string[]
  goals: string[]
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

interface Order {
  id: string
  date: string
  items: CartItem[]
  total: number
  status: "delivered" | "in-transit" | "preparing" | "out-for-delivery"
  deliveryAddress?: string
  estimatedDelivery?: string
  deliveryStaff?: {
    name: string
    phone: string
  }
  scheduledFor?: {
    date: string
    mealType: "breakfast" | "lunch" | "dinner"
  }
}

interface MealSchedule {
  id: string
  mealId: string
  date: string
  mealType: "breakfast" | "lunch" | "dinner"
  status: "scheduled" | "delivered" | "cancelled"
}

interface WeightEntry {
  date: string
  weight: number
}

interface Rating {
  mealId: string
  rating: number
  review: string
  date: string
}

interface ChatMessage {
  id: string
  sender: "user" | "support" | "nutritionist"
  message: string
  timestamp: string
}

interface SubscriptionPlan {
  id: string
  name: string
  mealsPerDay: number
  daysPerWeek: number
  price: number
  startDate: string
  endDate: string
  active: boolean
}

interface StoreContextType {
  cart: CartItem[]
  user: User | null
  orders: Order[]
  selectedDietPlan: string | null
  dietPreference: string | null
  mealSchedules: MealSchedule[]
  weightHistory: WeightEntry[]
  ratings: Rating[]
  chatMessages: ChatMessage[]
  subscription: SubscriptionPlan | null
  notifications: Notification[]
  setDietPlan: (plan: string) => void
  addToCart: (meal: Omit<CartItem, "quantity">) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  checkout: (deliveryAddress?: string, scheduledFor?: Order["scheduledFor"]) => void
  setDietPreference: (preference: string | null) => void
  updateUserProfile: (profile: Partial<User>) => void
  addMealSchedule: (schedule: Omit<MealSchedule, "id">) => void
  removeMealSchedule: (id: string) => void
  addWeightEntry: (entry: WeightEntry) => void
  addRating: (rating: Rating) => void
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  setSubscription: (plan: SubscriptionPlan | null) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
}

interface Notification {
  id: string
  type: "order" | "delivery" | "reminder" | "promo"
  title: string
  message: string
  read: boolean
  timestamp: string
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedDietPlan, setSelectedDietPlan] = useState<string | null>(null)
  const [dietPreference, setDietPreferenceState] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mealSchedules, setMealSchedules] = useState<MealSchedule[]>([])
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [subscription, setSubscriptionState] = useState<SubscriptionPlan | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("nutridash-cart")
    const savedUser = localStorage.getItem("nutridash-user")
    const savedOrders = localStorage.getItem("nutridash-orders")
    const savedPlan = localStorage.getItem("nutridash-plan")
    const savedDietPreference = localStorage.getItem("nutridash-diet-preference")
    const savedSchedules = localStorage.getItem("nutridash-schedules")
    const savedWeight = localStorage.getItem("nutridash-weight")
    const savedRatings = localStorage.getItem("nutridash-ratings")
    const savedChat = localStorage.getItem("nutridash-chat")
    const savedSubscription = localStorage.getItem("nutridash-subscription")
    const savedNotifications = localStorage.getItem("nutridash-notifications")

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedOrders) setOrders(JSON.parse(savedOrders))
    if (savedPlan) setSelectedDietPlan(savedPlan)
    if (savedDietPreference) setDietPreferenceState(savedDietPreference)
    if (savedSchedules) setMealSchedules(JSON.parse(savedSchedules))
    if (savedWeight) setWeightHistory(JSON.parse(savedWeight))
    if (savedRatings) setRatings(JSON.parse(savedRatings))
    if (savedChat) setChatMessages(JSON.parse(savedChat))
    if (savedSubscription) setSubscriptionState(JSON.parse(savedSubscription))
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications))

    setMounted(true)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("nutridash-cart", JSON.stringify(cart))
  }, [cart, mounted])

  useEffect(() => {
    if (!mounted) return
    if (user) {
      localStorage.setItem("nutridash-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("nutridash-user")
    }
  }, [user, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("nutridash-orders", JSON.stringify(orders))
  }, [orders, mounted])

  useEffect(() => {
    if (!mounted) return
    if (selectedDietPlan) {
      localStorage.setItem("nutridash-plan", selectedDietPlan)
    }
  }, [selectedDietPlan, mounted])

  useEffect(() => {
    if (!mounted) return
    if (dietPreference) {
      localStorage.setItem("nutridash-diet-preference", dietPreference)
    } else {
      localStorage.removeItem("nutridash-diet-preference")
    }
  }, [dietPreference, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("nutridash-schedules", JSON.stringify(mealSchedules))
  }, [mealSchedules, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("nutridash-weight", JSON.stringify(weightHistory))
  }, [weightHistory, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("nutridash-ratings", JSON.stringify(ratings))
  }, [ratings, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("nutridash-chat", JSON.stringify(chatMessages))
  }, [chatMessages, mounted])

  useEffect(() => {
    if (!mounted) return
    if (subscription) {
      localStorage.setItem("nutridash-subscription", JSON.stringify(subscription))
    } else {
      localStorage.removeItem("nutridash-subscription")
    }
  }, [subscription, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("nutridash-notifications", JSON.stringify(notifications))
  }, [notifications, mounted])

  const addToCart = (meal: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === meal.id)
      if (existing) {
        return prev.map((item) => (item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...meal, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const usersKey = "nutridash-users"
    const users = JSON.parse(localStorage.getItem(usersKey) || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      setUser(foundUser)
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const usersKey = "nutridash-users"
    const users = JSON.parse(localStorage.getItem(usersKey) || "[]")

    if (users.some((u: any) => u.email === email)) {
      return false
    }

    const newUser = { email, password, name }
    users.push(newUser)
    localStorage.setItem(usersKey, JSON.stringify(users))
    setUser({ name, email })
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const checkout = (deliveryAddress?: string, scheduledFor?: Order["scheduledFor"]) => {
    if (cart.length === 0) return

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = subtotal > 500 ? 0 : 50
    const total = subtotal + deliveryFee

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total,
      status: "preparing",
      deliveryAddress,
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      deliveryStaff: {
        name: "John Driver",
        phone: "+1 (555) 123-4567",
      },
      scheduledFor,
    }

    setOrders((prev) => [newOrder, ...prev])
    setCart([])

    // Add notification
    const notification: Notification = {
      id: `NOTIF-${Date.now()}`,
      type: "order",
      title: "Order Confirmed",
      message: `Your order ${newOrder.id} is being prepared!`,
      read: false,
      timestamp: new Date().toISOString(),
    }
    setNotifications((prev) => [notification, ...prev])
  }

  const setDietPlan = (plan: string) => {
    setSelectedDietPlan(plan)
  }

  const setDietPreference = (preference: string | null) => {
    setDietPreferenceState(preference)
  }

  const updateUserProfile = (profile: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profile }
      setUser(updatedUser)
      // Update in users list too
      const usersKey = "nutridash-users"
      const users = JSON.parse(localStorage.getItem(usersKey) || "[]")
      const updatedUsers = users.map((u: any) => (u.email === user.email ? { ...u, ...profile } : u))
      localStorage.setItem(usersKey, JSON.stringify(updatedUsers))
    }
  }

  const addMealSchedule = (schedule: Omit<MealSchedule, "id">) => {
    const newSchedule: MealSchedule = {
      ...schedule,
      id: `SCHED-${Date.now()}`,
    }
    setMealSchedules((prev) => [...prev, newSchedule])
  }

  const removeMealSchedule = (id: string) => {
    setMealSchedules((prev) => prev.filter((s) => s.id !== id))
  }

  const addWeightEntry = (entry: WeightEntry) => {
    setWeightHistory((prev) => [...prev, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
  }

  const addRating = (rating: Rating) => {
    setRatings((prev) => {
      const existing = prev.findIndex((r) => r.mealId === rating.mealId)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = rating
        return updated
      }
      return [...prev, rating]
    })
  }

  const addChatMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `MSG-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
    setChatMessages((prev) => [...prev, newMessage])
  }

  const setSubscription = (plan: SubscriptionPlan | null) => {
    setSubscriptionState(plan)
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  const value: StoreContextType = {
    cart,
    user,
    orders,
    selectedDietPlan,
    dietPreference,
    mealSchedules,
    weightHistory,
    ratings,
    chatMessages,
    subscription,
    notifications,
    addToCart,
    updateQuantity,
    removeFromCart,
    login,
    signup,
    logout,
    checkout,
    setDietPreference,
    setDietPlan,
    updateUserProfile,
    addMealSchedule,
    removeMealSchedule,
    addWeightEntry,
    addRating,
    addChatMessage,
    setSubscription,
    updateOrderStatus,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

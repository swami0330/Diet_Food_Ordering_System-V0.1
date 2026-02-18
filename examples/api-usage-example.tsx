// Example: How to use the NutriDash API in React components

"use client"

import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

// Example 1: Login Component
export function LoginExample() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(email, password)
      // Redirect or show success message
      console.log('Login successful!')
    } catch (error) {
      console.error('Login failed:', error)
      // Show error message
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

// Example 2: Meals List Component
export function MealsListExample() {
  const [meals, setMeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    dietType: '',
    mealTime: '',
    page: 1
  })

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true)
      try {
        const response = await apiClient.getMeals(filters)
        if (response.data?.meals) {
          setMeals(response.data.meals)
        }
      } catch (error) {
        console.error('Failed to fetch meals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeals()
  }, [filters])

  const handleAddToCart = async (mealId: string) => {
    try {
      await apiClient.addToCart(mealId, 1)
      console.log('Added to cart successfully!')
      // Show success message or update cart count
    } catch (error) {
      console.error('Failed to add to cart:', error)
      // Show error message
    }
  }

  if (loading) {
    return <div>Loading meals...</div>
  }

  return (
    <div>
      {/* Search and Filters */}
      <div>
        <input
          type="text"
          placeholder="Search meals..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
        />
        <select
          value={filters.dietType}
          onChange={(e) => setFilters({ ...filters, dietType: e.target.value, page: 1 })}
        >
          <option value="">All Diet Types</option>
          <option value="VEG">Vegetarian</option>
          <option value="NON_VEG">Non-Vegetarian</option>
          <option value="VEGAN">Vegan</option>
        </select>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map((meal) => (
          <div key={meal.id} className="border rounded-lg p-4">
            <img src={meal.image} alt={meal.name} className="w-full h-48 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{meal.name}</h3>
            <p className="text-gray-600 text-sm">{meal.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold">₹{meal.price}</span>
              <button
                onClick={() => handleAddToCart(meal.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {meal.calories} cal • {meal.protein}g protein
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Example 3: Cart Component
export function CartExample() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await apiClient.getCart()
        if (response.data) {
          setCart(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await apiClient.updateCartItem(itemId, quantity)
      // Refresh cart
      const response = await apiClient.getCart()
      if (response.data) {
        setCart(response.data)
      }
    } catch (error) {
      console.error('Failed to update cart:', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await apiClient.removeFromCart(itemId)
      // Refresh cart
      const response = await apiClient.getCart()
      if (response.data) {
        setCart(response.data)
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  if (loading) {
    return <div>Loading cart...</div>
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      {cart.items.map((item: any) => (
        <div key={item.id} className="flex items-center justify-between border-b py-4">
          <div className="flex items-center">
            <img src={item.meal.image} alt={item.meal.name} className="w-16 h-16 object-cover rounded" />
            <div className="ml-4">
              <h3 className="font-semibold">{item.meal.name}</h3>
              <p className="text-gray-600">₹{item.meal.price}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              -
            </button>
            <span className="mx-4">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              +
            </button>
            <button
              onClick={() => removeItem(item.id)}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total: ₹{cart.summary.subtotal}</span>
          <span>{cart.summary.totalItems} items</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {cart.summary.totalCalories} calories • {cart.summary.totalProtein}g protein
        </div>
        <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

// Example 4: Order Creation
export function CheckoutExample() {
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zip: '',
      phone: ''
    },
    paymentMethod: 'CARD' as const,
    couponCode: ''
  })

  const handleCreateOrder = async () => {
    setLoading(true)
    try {
      const response = await apiClient.createOrder(orderData)
      if (response.data?.order) {
        console.log('Order created successfully:', response.data.order)
        // Redirect to order confirmation page
      }
    } catch (error) {
      console.error('Failed to create order:', error)
      // Show error message
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      
      {/* Delivery Address Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={orderData.deliveryAddress.firstName}
            onChange={(e) => setOrderData({
              ...orderData,
              deliveryAddress: { ...orderData.deliveryAddress, firstName: e.target.value }
            })}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={orderData.deliveryAddress.lastName}
            onChange={(e) => setOrderData({
              ...orderData,
              deliveryAddress: { ...orderData.deliveryAddress, lastName: e.target.value }
            })}
            className="border rounded px-3 py-2"
          />
        </div>
        {/* Add more address fields... */}
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
        <select
          value={orderData.paymentMethod}
          onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value as any })}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="CARD">Credit/Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="WALLET">Digital Wallet</option>
          <option value="COD">Cash on Delivery</option>
        </select>
      </div>

      {/* Coupon Code */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Coupon Code (Optional)"
          value={orderData.couponCode}
          onChange={(e) => setOrderData({ ...orderData, couponCode: e.target.value })}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  )
}

// Example 5: Using with React Query (Optional)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function MealsWithReactQuery() {
  const queryClient = useQueryClient()

  // Fetch meals
  const { data: meals, isLoading, error } = useQuery({
    queryKey: ['meals'],
    queryFn: () => apiClient.getMeals()
  })

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ mealId, quantity }: { mealId: string; quantity: number }) =>
      apiClient.addToCart(mealId, quantity),
    onSuccess: () => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })

  const handleAddToCart = (mealId: string) => {
    addToCartMutation.mutate({ mealId, quantity: 1 })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading meals</div>

  return (
    <div>
      {meals?.data?.meals.map((meal: any) => (
        <div key={meal.id}>
          <h3>{meal.name}</h3>
          <button
            onClick={() => handleAddToCart(meal.id)}
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      ))}
    </div>
  )
}
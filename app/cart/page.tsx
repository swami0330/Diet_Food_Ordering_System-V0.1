"use client"

import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, user } = useStore()
  const router = useRouter()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="container px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Looks like you haven't added any healthy meals to your plan yet.</p>
          <Link href="/menu">
            <Button className="bg-green-600 hover:bg-green-700 mt-4">Explore Our Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold mb-8">My Meal Plan</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        <p className="text-xs text-green-600 mt-1">
                          {item.calories} cal | {item.protein}g protein
                        </p>
                      </div>
                      <p className="font-bold">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs">Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  Add ₹{(500 - subtotal).toFixed(0)} more for FREE delivery!
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push(user ? "/checkout" : "/login?redirect=/checkout")}
                className="w-full bg-green-600 hover:bg-green-700 h-12 gap-2"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

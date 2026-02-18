"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Smartphone,
  Wallet,
  Banknote,
  Download,
  Receipt,
} from "lucide-react"
import Link from "next/link"

type PaymentMethod = "card" | "upi" | "wallet" | "cod"

export default function CheckoutPage() {
  const { cart, checkout, user } = useStore()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [upiId, setUpiId] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")
  const [orderId, setOrderId] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 500 ? 0 : 50
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  if (cart.length === 0 && step !== 3) {
    router.push("/menu")
    return null
  }

  const handleNextStep = () => {
    if (step === 2) {
      setLoading(true)
      setTimeout(() => {
        const newOrderId = `ORD-${Date.now()}`
        setOrderId(newOrderId)
        checkout(`${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.zip}`, undefined)
        setStep(3)
        setLoading(false)
      }, 2000)
    } else {
      setStep(step + 1)
    }
  }

  const downloadInvoice = () => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;
    
    const invoiceContent = `
    ========================================
              NUTRIDASH INVOICE
    ========================================
    
    Order ID: ${orderId}
    Date: ${new Date().toLocaleDateString()}
    
    ----------------------------------------
    ITEMS:
    ----------------------------------------
    ${cart.map((item) => `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(0)}`).join("\n    ")}
    
    ----------------------------------------
    Subtotal:     ₹${subtotal.toFixed(0)}
    Delivery:     ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
    Tax (8%):     ₹${tax.toFixed(0)}
    ----------------------------------------
    TOTAL:        ₹${total.toFixed(0)}
    ----------------------------------------
    
    Payment Method: ${paymentMethod.toUpperCase()}
    
    Delivery Address:
    ${deliveryAddress.firstName} ${deliveryAddress.lastName}
    ${deliveryAddress.address}
    ${deliveryAddress.city}, ${deliveryAddress.zip}
    Phone: ${deliveryAddress.phone}
    
    ========================================
          Thank you for your order!
    ========================================
    `

    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${orderId}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (step === 3) {
    return (
      <div className="container px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground max-w-md mb-4">
          Your healthy meals are being prepared. You can track your order status in your dashboard.
        </p>
        <p className="text-sm font-medium mb-6">Order ID: {orderId}</p>

        <Card className="w-full max-w-md mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="h-5 w-5" /> Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (8%)</span>
              <span>₹{tax.toFixed(0)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total Paid</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment Method</span>
              <span className="capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full bg-transparent" onClick={downloadInvoice}>
              <Download className="h-4 w-4 mr-2" /> Download Invoice
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/track-order">
            <Button className="bg-green-600 hover:bg-green-700 px-8">Track Order</Button>
          </Link>
          <Link href="/menu">
            <Button variant="outline" className="px-8 bg-transparent">
              Order More
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"}`}
                >
                  1
                </div>
                <div className="h-0.5 w-8 bg-slate-100 self-center"></div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"}`}
                >
                  2
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {step === 1 ? "Delivery Information" : "Payment Method"}
              </span>
            </div>

            {step === 1 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" /> Delivery Details
                  </CardTitle>
                  <CardDescription>Where should we deliver your fresh meals?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={deliveryAddress.firstName}
                        onChange={(e) => setDeliveryAddress((p) => ({ ...p, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={deliveryAddress.lastName}
                        onChange={(e) => setDeliveryAddress((p) => ({ ...p, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Healthy Street"
                      value={deliveryAddress.address}
                      onChange={(e) => setDeliveryAddress((p) => ({ ...p, address: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress((p) => ({ ...p, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        placeholder="10001"
                        value={deliveryAddress.zip}
                        onChange={(e) => setDeliveryAddress((p) => ({ ...p, zip: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleNextStep} className="w-full bg-green-600 hover:bg-green-700 h-12">
                    Continue to Payment
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    className="space-y-3"
                  >
                    <div
                      className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === "card" ? "border-green-600 bg-green-50" : ""}`}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex flex-1 items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Credit / Debit Card</p>
                            <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === "upi" ? "border-green-600 bg-green-50" : ""}`}
                    >
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex flex-1 items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">UPI Payment</p>
                            <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === "wallet" ? "border-green-600 bg-green-50" : ""}`}
                    >
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex flex-1 items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Wallet className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Digital Wallet</p>
                            <p className="text-xs text-muted-foreground">Apple Pay, Google Pay, PayPal</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-green-600 bg-green-50" : ""}`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex flex-1 items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Banknote className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Payment method specific fields */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex-1 bg-transparent ${selectedWallet === "gpay" ? "border-green-600" : ""}`}
                          onClick={() => setSelectedWallet("gpay")}
                        >
                          Google Pay
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex-1 bg-transparent ${selectedWallet === "phonepe" ? "border-green-600" : ""}`}
                          onClick={() => setSelectedWallet("phonepe")}
                        >
                          PhonePe
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex-1 bg-transparent ${selectedWallet === "paytm" ? "border-green-600" : ""}`}
                          onClick={() => setSelectedWallet("paytm")}
                        >
                          Paytm
                        </Button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "wallet" && (
                    <div className="space-y-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Select your preferred wallet:</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className={`h-16 flex-col gap-1 bg-transparent ${selectedWallet === "apple" ? "border-green-600" : ""}`}
                          onClick={() => setSelectedWallet("apple")}
                        >
                          <span className="text-2xl">🍎</span>
                          <span className="text-xs">Apple Pay</span>
                        </Button>
                        <Button
                          variant="outline"
                          className={`h-16 flex-col gap-1 bg-transparent ${selectedWallet === "google" ? "border-green-600" : ""}`}
                          onClick={() => setSelectedWallet("google")}
                        >
                          <span className="text-2xl">G</span>
                          <span className="text-xs">Google Pay</span>
                        </Button>
                        <Button
                          variant="outline"
                          className={`h-16 flex-col gap-1 bg-transparent ${selectedWallet === "paypal" ? "border-green-600" : ""}`}
                          onClick={() => setSelectedWallet("paypal")}
                        >
                          <span className="text-2xl">P</span>
                          <span className="text-xs">PayPal</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="pt-4 border-t">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Please keep exact change ready. Our delivery partner may not carry
                          change for large denominations. A small convenience fee of ₹20 applies for cash on delivery
                          orders.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button
                    onClick={handleNextStep}
                    className="w-full bg-green-600 hover:bg-green-700 h-12"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : paymentMethod === "cod"
                        ? `Place Order - ₹${(total + 20).toFixed(0)}`
                        : `Pay ₹${total.toFixed(0)}`}
                  </Button>
                  <Button variant="ghost" onClick={() => setStep(1)} className="w-full">
                    Back to Delivery
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-sm text-yellow-600">
                    <span>COD Fee</span>
                    <span>₹20</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{paymentMethod === "cod" ? (total + 20).toFixed(0) : total.toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Secure Checkout</p>
                    <p className="text-xs text-muted-foreground">Your payment is 100% secure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

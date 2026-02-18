"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Download, 
  Plus, 
  Trash2, 
  Eye, 
  RefreshCw,
  Building,
  Receipt,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react"

interface BillingProfile {
  id: string
  billingName: string
  billingEmail: string
  billingPhone?: string
  billingAddress: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  companyName?: string
  taxId?: string
  isDefault: boolean
  createdAt: string
}

interface PaymentMethod {
  id: string
  type: string
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  holderName?: string
  isDefault: boolean
  createdAt: string
}

interface Payment {
  id: string
  amount: number
  currency: string
  paymentMethod: string
  status: string
  createdAt: string
  order?: {
    id: string
    createdAt: string
  }
  subscription?: {
    id: string
    plan: {
      name: string
    }
  }
  invoice?: {
    id: string
    invoiceNumber: string
  }
}

interface Invoice {
  id: string
  invoiceNumber: string
  type: string
  status: string
  issueDate: string
  dueDate?: string
  paidDate?: string
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paidAmount: number
  description?: string
  order?: {
    id: string
  }
  subscription?: {
    id: string
    plan: {
      name: string
    }
  }
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [billingProfiles, setBillingProfiles] = useState<BillingProfile[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProfile, setShowAddProfile] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)

  // Form states
  const [profileForm, setProfileForm] = useState({
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    companyName: "",
    taxId: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    isDefault: false
  })

  const [paymentForm, setPaymentForm] = useState({
    type: "CREDIT_CARD",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
    isDefault: false
  })

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      setLoading(true)
      const [profilesRes, methodsRes, paymentsRes, invoicesRes] = await Promise.all([
        fetch('/api/billing/profiles'),
        fetch('/api/billing/payment-methods'),
        fetch('/api/billing/payments'),
        fetch('/api/billing/invoices')
      ])

      if (profilesRes.ok) setBillingProfiles(await profilesRes.json())
      if (methodsRes.ok) setPaymentMethods(await methodsRes.json())
      if (paymentsRes.ok) {
        const paymentData = await paymentsRes.json()
        setPayments(paymentData.payments || [])
      }
      if (invoicesRes.ok) {
        const invoiceData = await invoicesRes.json()
        setInvoices(invoiceData.invoices || [])
      }
    } catch (error) {
      console.error('Error fetching billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/billing/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingName: profileForm.billingName,
          billingEmail: profileForm.billingEmail,
          billingPhone: profileForm.billingPhone,
          companyName: profileForm.companyName,
          taxId: profileForm.taxId,
          billingAddress: {
            street: profileForm.street,
            city: profileForm.city,
            state: profileForm.state,
            country: profileForm.country,
            zipCode: profileForm.zipCode
          },
          isDefault: profileForm.isDefault
        })
      })

      if (response.ok) {
        setShowAddProfile(false)
        setProfileForm({
          billingName: "",
          billingEmail: "",
          billingPhone: "",
          companyName: "",
          taxId: "",
          street: "",
          city: "",
          state: "",
          country: "India",
          zipCode: "",
          isDefault: false
        })
        fetchBillingData()
      }
    } catch (error) {
      console.error('Error adding billing profile:', error)
    }
  }

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/billing/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: paymentForm.type,
          paymentDetails: {
            cardNumber: paymentForm.cardNumber,
            expiryMonth: paymentForm.expiryMonth,
            expiryYear: paymentForm.expiryYear,
            cvv: paymentForm.cvv,
            holderName: paymentForm.holderName
          },
          isDefault: paymentForm.isDefault
        })
      })

      if (response.ok) {
        setShowAddPayment(false)
        setPaymentForm({
          type: "CREDIT_CARD",
          cardNumber: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
          holderName: "",
          isDefault: false
        })
        fetchBillingData()
      }
    } catch (error) {
      console.error('Error adding payment method:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      case 'REFUNDED':
        return <RefreshCw className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage your billing information, payment methods, and transaction history</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profiles">Billing Profiles</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {payments.filter(p => p.status === 'COMPLETED').length} successful payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {payments.filter(p => p.subscription).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Subscription payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentMethods.length}</div>
                <p className="text-xs text-muted-foreground">
                  Saved payment methods
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invoices</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invoices.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total invoices generated
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(payment.status)}
                        <div>
                          <p className="font-medium">₹{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.order ? 'Order Payment' : payment.subscription ? 'Subscription' : 'Payment'}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">₹{invoice.totalAmount}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Billing Profiles</h2>
            <Dialog open={showAddProfile} onOpenChange={setShowAddProfile}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Billing Profile</DialogTitle>
                  <DialogDescription>
                    Create a new billing profile for invoices and payments
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingName">Full Name *</Label>
                      <Input
                        id="billingName"
                        value={profileForm.billingName}
                        onChange={(e) => setProfileForm({ ...profileForm, billingName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingEmail">Email *</Label>
                      <Input
                        id="billingEmail"
                        type="email"
                        value={profileForm.billingEmail}
                        onChange={(e) => setProfileForm({ ...profileForm, billingEmail: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingPhone">Phone</Label>
                      <Input
                        id="billingPhone"
                        value={profileForm.billingPhone}
                        onChange={(e) => setProfileForm({ ...profileForm, billingPhone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={profileForm.companyName}
                        onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={profileForm.street}
                      onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={profileForm.zipCode}
                        onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / GST Number</Label>
                    <Input
                      id="taxId"
                      value={profileForm.taxId}
                      onChange={(e) => setProfileForm({ ...profileForm, taxId: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={profileForm.isDefault}
                      onChange={(e) => setProfileForm({ ...profileForm, isDefault: e.target.checked })}
                    />
                    <Label htmlFor="isDefault">Set as default billing profile</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddProfile(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Profile</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {billingProfiles.map((profile) => (
              <Card key={profile.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{profile.billingName}</h3>
                        {profile.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      {profile.companyName && (
                        <p className="text-sm text-muted-foreground">{profile.companyName}</p>
                      )}
                      <p className="text-sm">{profile.billingEmail}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.billingAddress.street}, {profile.billingAddress.city}, {profile.billingAddress.state} {profile.billingAddress.zipCode}
                      </p>
                      {profile.taxId && (
                        <p className="text-sm text-muted-foreground">Tax ID: {profile.taxId}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Payment Methods</h2>
            <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new payment method for faster checkout
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Payment Type</Label>
                    <Select value={paymentForm.type} onValueChange={(value) => setPaymentForm({ ...paymentForm, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                        <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="NET_BANKING">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(paymentForm.type === 'CREDIT_CARD' || paymentForm.type === 'DEBIT_CARD') && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentForm.cardNumber}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryMonth">Month</Label>
                          <Input
                            id="expiryMonth"
                            placeholder="MM"
                            value={paymentForm.expiryMonth}
                            onChange={(e) => setPaymentForm({ ...paymentForm, expiryMonth: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiryYear">Year</Label>
                          <Input
                            id="expiryYear"
                            placeholder="YYYY"
                            value={paymentForm.expiryYear}
                            onChange={(e) => setPaymentForm({ ...paymentForm, expiryYear: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="holderName">Cardholder Name</Label>
                        <Input
                          id="holderName"
                          value={paymentForm.holderName}
                          onChange={(e) => setPaymentForm({ ...paymentForm, holderName: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefaultPayment"
                      checked={paymentForm.isDefault}
                      onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
                    />
                    <Label htmlFor="isDefaultPayment">Set as default payment method</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddPayment(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Payment Method</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">
                            {method.brand?.toUpperCase()} •••• {method.last4}
                          </p>
                          {method.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.type.replace('_', ' ')} • Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                        {method.holderName && (
                          <p className="text-sm text-muted-foreground">{method.holderName}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <h2 className="text-2xl font-bold">Payment History</h2>
          
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(payment.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">₹{payment.amount}</p>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {payment.order ? `Order #${payment.order.id.slice(-8)}` : 
                           payment.subscription ? `Subscription - ${payment.subscription.plan.name}` : 
                           'Payment'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()} • {payment.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {payment.status === 'COMPLETED' && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <h2 className="text-2xl font-bold">Invoices</h2>
          
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Receipt className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ₹{invoice.totalAmount} • {invoice.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                          {invoice.dueDate && ` • Due: ${new Date(invoice.dueDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
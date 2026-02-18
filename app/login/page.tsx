"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "../../lib/store-context"
import { Leaf, ArrowLeft, Smartphone, Mail } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AuthView = "login" | "signup" | "otp" | "forgot-password" | "reset-password"

export default function LoginPage() {
  const [view, setView] = useState<AuthView>("login")
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, signup } = useStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (view === "login") {
        const identifier = authMethod === "email" ? email : phone
        const success = await login(identifier, password)
        if (success) {
          router.push("/dashboard")
        } else {
          setError("Invalid credentials. Please try again.")
        }
      } else if (view === "signup") {
        if (!name.trim()) {
          setError("Name is required")
          setLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match")
          setLoading(false)
          return
        }
        setView("otp")
        setSuccess("We've sent a verification code to your " + (authMethod === "email" ? "email" : "phone"))
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    setLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (otp === "123456" || otp.length === 6) {
      const identifier = authMethod === "email" ? email : phone
      const success = await signup(identifier, password, name)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Email already exists")
      }
    } else {
      setError("Invalid verification code")
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSuccess("Password reset instructions have been sent to your email")
    setView("reset-password")
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSuccess("Password reset successful! Please log in with your new password.")
    setView("login")
    setPassword("")
    setConfirmPassword("")
    setLoading(false)
  }

  const resendOtp = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSuccess("Verification code resent!")
    setLoading(false)
  }

  if (view === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">NutriDash</span>
            </div>
            <CardTitle className="text-2xl">Verify Your Account</CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code sent to your {authMethod === "email" ? "email" : "phone"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">{error}</div>}
            {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md text-center">{success}</div>}

            <Button
              onClick={handleOtpVerify}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="text-center text-sm">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={resendOtp}
                className="text-green-600 hover:underline font-medium"
                disabled={loading}
              >
                Resend
              </button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setView("signup")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (view === "forgot-password") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">NutriDash</span>
            </div>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
              {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Instructions"}
              </Button>

              <Button variant="ghost" className="w-full" onClick={() => setView("login")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (view === "reset-password") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">NutriDash</span>
            </div>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription className="text-center">Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
              {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold">NutriDash</span>
          </div>
          <CardTitle className="text-2xl">{view === "login" ? "Welcome back" : "Create account"}</CardTitle>
          <CardDescription>
            {view === "login" ? "Sign in to access your account" : "Sign up to start your healthy journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as "email" | "phone")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Phone
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {authMethod === "email" ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {view === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot-password")
                      setError("")
                      setSuccess("")
                    }}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {view === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
            {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Please wait..." : view === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="bg-transparent">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="bg-transparent">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            {view === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setView(view === "login" ? "signup" : "login")
                setError("")
                setSuccess("")
              }}
              className="text-green-600 hover:underline font-medium"
            >
              {view === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

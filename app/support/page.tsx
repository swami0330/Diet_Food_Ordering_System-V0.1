"use client"

import { useState, useRef, useEffect } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Phone, Mail, Send, Bot, User, Stethoscope, HelpCircle } from "lucide-react"

const faqItems = [
  {
    question: "How do I change my meal plan?",
    answer:
      "You can modify your meal plan by going to Diet Plans page and selecting a new subscription or scheduling individual meals.",
  },
  {
    question: "What are your delivery hours?",
    answer: "We deliver between 8 AM and 10 PM daily. You can schedule specific delivery windows during checkout.",
  },
  {
    question: "Can I pause my subscription?",
    answer:
      "Yes, you can pause your subscription anytime from the Diet Plans page. Your remaining days will be preserved.",
  },
  {
    question: "How do I report an issue with my order?",
    answer:
      "Use the chat support below to connect with our customer service team, or email us at support@nutridash.com.",
  },
  {
    question: "Are the meals suitable for diabetics?",
    answer:
      "Yes! We have diabetic-friendly meal options. Update your health profile to see personalized recommendations.",
  },
]

export default function SupportPage() {
  const { chatMessages, addChatMessage, user } = useStore()
  const [message, setMessage] = useState("")
  const [chatType, setChatType] = useState<"support" | "nutritionist">("support")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    addChatMessage({
      sender: "user",
      message: message.trim(),
    })

    // Simulate response
    setTimeout(() => {
      const responses =
        chatType === "support"
          ? [
              "Thank you for reaching out! Let me check that for you.",
              "I understand your concern. Our team is looking into this.",
              "Is there anything else I can help you with today?",
            ]
          : [
              "Based on your health profile, I recommend focusing on high-protein meals.",
              "Have you tried our new diabetic-friendly menu options?",
              "Let me create a personalized meal plan for your goals.",
            ]

      addChatMessage({
        sender: chatType === "support" ? "support" : "nutritionist",
        message: responses[Math.floor(Math.random() * responses.length)],
      })
    }, 1000)

    setMessage("")
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold font-serif">Help & Support</h1>
        <p className="text-muted-foreground">Get help from our team or chat with a nutritionist.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Chat</CardTitle>
                <Tabs value={chatType} onValueChange={(v: any) => setChatType(v)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="support" className="text-xs gap-1">
                      <MessageCircle className="h-3 w-3" />
                      Support
                    </TabsTrigger>
                    <TabsTrigger value="nutritionist" className="text-xs gap-1">
                      <Stethoscope className="h-3 w-3" />
                      Nutritionist
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>
                {chatType === "support"
                  ? "Chat with our customer support team"
                  : "Get personalized diet advice from our nutritionists"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border bg-muted/20 h-[400px] flex flex-col">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Bot className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Start a conversation</p>
                        <p className="text-sm">Type a message to begin chatting.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={
                                msg.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : msg.sender === "nutritionist"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                              }
                            >
                              {msg.sender === "user" ? (
                                <User className="h-4 w-4" />
                              ) : msg.sender === "nutritionist" ? (
                                <Stethoscope className="h-4 w-4" />
                              ) : (
                                <MessageCircle className="h-4 w-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`max-w-[70%] p-3 ${
                              msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p
                              className={`text-[10px] mt-1 ${
                                msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                FAQs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.map((faq, idx) => (
                <details key={idx} className="group">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-medium hover:text-primary">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">{faq.answer}</p>
                </details>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 p-3 border hover:bg-muted transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </a>
              <a
                href="mailto:support@nutridash.com"
                className="flex items-center gap-3 p-3 border hover:bg-muted transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@nutridash.com</p>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Badge className="mb-3">Available 24/7</Badge>
                <p className="text-sm text-muted-foreground">
                  Our support team is always here to help you with any questions or concerns.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

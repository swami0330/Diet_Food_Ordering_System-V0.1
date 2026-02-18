"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Clock, ShieldCheck, Star } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const { setDietPreference } = useStore()
  const router = useRouter()

  const handleDietPlanClick = (plan: string) => {
    setDietPreference(plan)
    router.push("/menu")
  }

  const dietPlans = [
    {
      name: "Weight Loss",
      filter: "weight-loss",
      desc: "Calorie-controlled meals designed to shed pounds safely.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Muscle Gain",
      filter: "muscle-gain",
      desc: "High-protein fuel to support intense training and growth.",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Keto Ready",
      filter: "keto",
      desc: "Low-carb, high-fat perfection for metabolic efficiency.",
      image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Plant Based",
      filter: "vegan",
      desc: "100% vegan recipes rich in fiber and micronutrients.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative min-h-[95vh] flex items-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover grayscale opacity-20"
            alt="Hero Background"
          />
        </div>

        <div className="container px-4 md:px-6 relative z-20">
          <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-none bg-primary/5 text-primary border border-primary/20 text-xs font-mono tracking-widest uppercase">
              <Star className="h-3.5 w-3.5 fill-current" />
              Chef-Led Precision Nutrition
            </div>

            <h1 className="text-6xl md:text-9xl font-serif tracking-tight text-foreground leading-[1] select-none">
              Artistry <br />
              <span className="italic font-light text-primary">Meets Science.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-xl leading-relaxed">
              Elevating the daily ritual of nourishment through precision-crafted meals tailored to your physiology.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 pt-6">
              <Link href="/menu">
                <Button
                  size="lg"
                  className="h-16 px-12 text-lg rounded-none bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Begin Your Journey
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                className="h-16 px-12 text-lg rounded-none border-b border-foreground/20 hover:bg-transparent hover:border-foreground"
              >
                The Philosophy
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute right-[5%] top-[10%] hidden lg:block w-[40vw] h-[80vh] border-l border-primary/10 -z-10" />
      </section>

      <section className="py-40 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-12 mb-24 border-b border-border pb-12">
            <div className="space-y-6 max-w-3xl">
              <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase opacity-60">
                Phase 01 / Alignment
              </span>
              <h2 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight">Choose Your Path</h2>
            </div>
            <p className="text-xl text-muted-foreground font-light max-w-md">
              Select an expert-curated dietary protocol designed for optimal performance and metabolic health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
            {dietPlans.map((plan, idx) => (
              <div
                key={plan.name}
                className="group cursor-pointer space-y-8"
                onClick={() => handleDietPlanClick(plan.filter)}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={plan.image || "/placeholder.svg"}
                    alt={plan.name}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute top-8 left-8 text-white font-serif text-4xl opacity-30 select-none">
                    0{idx + 1}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif group-hover:text-primary transition-colors duration-500">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-[250px]">{plan.desc}</p>
                  <div className="pt-2 w-0 group-hover:w-full h-px bg-primary transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy / Features Section inspired by "Avencio" */}
      <section className="py-32 bg-foreground text-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight leading-tight">
                Nutrition, <br />
                Refined for the <br />
                <span className="italic text-primary">Modern Life.</span>
              </h2>

              <div className="space-y-8">
                {[
                  {
                    icon: TrendingUp,
                    title: "Precision Macro Tracking",
                    desc: "Every ingredient is measured for exact nutritional density.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Chef-Led Innovation",
                    desc: "Crafted by Michelin-star chefs and certified dietitians.",
                  },
                  {
                    icon: Clock,
                    title: "Time-Honored Freshness",
                    desc: "Delivered within 24 hours of being harvested and prepared.",
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-6 group">
                    <div className="h-12 w-12 rounded-none border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-serif mb-1">{feature.title}</h4>
                      <p className="text-background/60 font-light text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-square">
              <div className="absolute inset-0 border border-primary/20 -m-8" />
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Nutritional Precision"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, RefreshCw, ChevronDown, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const budgetOptions = [100, 150, 200, 300]
const locations = ["台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市"]
const dietPreferences = [
  { id: "any", label: "隨便吃" },
  { id: "healthy", label: "健康一點" },
  { id: "protein", label: "高蛋白" },
  { id: "extreme", label: "低預算極限" },
]
const goals = [
  { id: "save", label: "省錢優先", icon: "💸" },
  { id: "full", label: "吃飽優先", icon: "😋" },
  { id: "health", label: "健康優先", icon: "🥗" },
]

interface BudgetInputProps {
  onSubmit: (data: {
    budget: number
    location: string
    diet: string
    goal: string
  }) => void
}

export function BudgetInput({ onSubmit }: BudgetInputProps) {
  const [budget, setBudget] = useState(150)
  const [location, setLocation] = useState("台北市")
  const [diet, setDiet] = useState("any")
  const [goal, setGoal] = useState("save")

  const handleSubmit = () => {
    onSubmit({ budget, location, diet, goal })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">預算版</span>
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-2">今日炫什麼</h1>
        <p className="text-muted-foreground">用最少的錢，吃最合理的一天</p>
      </div>

      <Card className="border-2 border-border shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Budget Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="text-lg">💰</span> 今日預算
            </label>
            <div className="relative">
              <div className="flex items-center justify-center bg-muted rounded-xl p-4 mb-3">
                <span className="text-4xl font-bold text-primary">{budget}</span>
                <span className="text-xl text-muted-foreground ml-1">元</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {budgetOptions.map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBudget(option)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                      budget === option
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="w-4 h-4 text-primary" /> 你在哪？
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Diet Preference */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="text-lg">🍽️</span> 飲食偏好
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dietPreferences.map((pref) => (
                <motion.button
                  key={pref.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDiet(pref.id)}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    diet === pref.id
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {pref.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Goal Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="text-lg">🎯</span> 你的目標
            </label>
            <div className="grid grid-cols-3 gap-2">
              {goals.map((g) => (
                <motion.button
                  key={g.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGoal(g.id)}
                  className={`py-3 px-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                    goal === g.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <span className="text-lg">{g.icon}</span>
                  <span className="text-xs">{g.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            系統會自動幫你規劃最合理的三餐組合
          </p>

          {/* Submit Button */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              幫我算今天怎麼炫
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

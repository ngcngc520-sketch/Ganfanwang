"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Clock, RefreshCw, Search, TrendingDown, Utensils, Heart, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Meal {
  type: "breakfast" | "lunch" | "dinner"
  emoji: string
  label: string
  store: string
  item: string
  price: number
  distance: string
  rating: number
  status: "open" | "closing" | "closed"
  tags: string[]
}

interface MealResultProps {
  budget: number
  meals: Meal[]
  totalSpent: number
  satiety: number
  nutrition: number
  suggestions: string[]
  onRefresh: () => void
  onBack: () => void
  onAdjustGoal: (goal: string) => void
}

const statusConfig = {
  open: { label: "營業中", color: "text-success", bg: "bg-success/10" },
  closing: { label: "即將打烊", color: "text-warning", bg: "bg-warning/10" },
  closed: { label: "已打烊", color: "text-destructive", bg: "bg-destructive/10" },
}

export function MealResult({
  budget,
  meals,
  totalSpent,
  satiety,
  nutrition,
  suggestions,
  onRefresh,
  onBack,
  onAdjustGoal,
}: MealResultProps) {
  const remaining = budget - totalSpent

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto px-4 pb-8"
    >
      {/* Header Summary */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border-2 border-border rounded-2xl p-4 mb-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍱</span>
            <h2 className="font-bold text-lg text-foreground">今日最佳組合</h2>
          </div>
          <span className="text-sm text-muted-foreground">預算 {budget} 元</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-foreground">
              💰 已使用：<strong className="text-primary">{totalSpent} 元</strong>
            </span>
            <span className="text-muted-foreground">｜</span>
            <span className="text-foreground">
              剩餘：<strong className={remaining >= 0 ? "text-success" : "text-destructive"}>{remaining} 元</strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Meal Cards */}
      <div className="space-y-4 mb-6">
        {meals.map((meal, index) => (
          <motion.div
            key={meal.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="border-2 border-border overflow-hidden">
              <CardHeader className="bg-muted/50 py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{meal.emoji}</span>
                  <span className="font-semibold text-foreground">{meal.label}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🏪</span>
                      <span className="font-medium text-foreground">{meal.store}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{meal.type === "breakfast" ? "🥪" : meal.type === "lunch" ? "🍛" : "🍜"}</span>
                      <span className="text-muted-foreground">{meal.item}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                  <span className="font-bold text-primary text-lg">💰 {meal.price}元</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {meal.distance}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" /> {meal.rating}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[meal.status].bg} ${statusConfig[meal.status].color}`}>
                    <Clock className="w-3 h-3" />
                    {statusConfig[meal.status].label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                    >
                      🏷️ {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-2 border-border mb-6">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              📊 今日飲食分析
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  🔋 飽足感
                </span>
                <span className="font-medium text-foreground">{satiety}%</span>
              </div>
              <Progress value={satiety} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  🥗 營養評分
                </span>
                <span className="font-medium text-foreground">{nutrition} / 100</span>
              </div>
              <Progress value={nutrition} className="h-2" />
            </div>

            {suggestions.length > 0 && (
              <div className="bg-warning/10 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2 text-warning font-medium text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  建議
                </div>
                {suggestions.map((suggestion, i) => (
                  <p key={i} className="text-sm text-foreground/80 pl-6">• {suggestion}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Goal Adjustment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <p className="text-sm text-muted-foreground text-center mb-3">🎯 調整你的目標</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => onAdjustGoal("save")}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="text-xs">更省錢</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onAdjustGoal("full")}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Utensils className="w-4 h-4 text-primary" />
            <span className="text-xs">更吃飽</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onAdjustGoal("health")}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-xs">更健康</span>
          </Button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          variant="outline"
          onClick={onRefresh}
          className="h-12 rounded-xl"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          換一組推薦
        </Button>
        <Button
          onClick={onBack}
          className="h-12 rounded-xl"
        >
          <Search className="w-4 h-4 mr-2" />
          重新設定
        </Button>
      </motion.div>
    </motion.div>
  )
}

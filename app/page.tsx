"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BudgetInput } from "@/components/budget-input"
import { MealResult } from "@/components/meal-result"

interface MealData {
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

const mealDatabase: Record<string, MealData[][]> = {
  save: [
    [
      { type: "breakfast", emoji: "🍳", label: "早餐", store: "永和豆漿", item: "蛋餅 + 豆漿", price: 40, distance: "150m", rating: 4.2, status: "open", tags: ["高CP值", "學生熱門"] },
      { type: "lunch", emoji: "🍱", label: "午餐", store: "阿婆自助餐", item: "2菜1肉組合", price: 70, distance: "280m", rating: 4.0, status: "open", tags: ["分量足", "便宜"] },
      { type: "dinner", emoji: "🍜", label: "晚餐", store: "老王麵店", item: "陽春麵", price: 35, distance: "180m", rating: 4.1, status: "open", tags: ["便宜首選", "湯頭讚"] },
    ],
    [
      { type: "breakfast", emoji: "🍳", label: "早餐", store: "美而美", item: "總匯三明治", price: 45, distance: "200m", rating: 4.3, status: "open", tags: ["份量大", "學生愛"] },
      { type: "lunch", emoji: "🍱", label: "午餐", store: "便當街", item: "排骨便當", price: 65, distance: "350m", rating: 4.2, status: "open", tags: ["經典款", "飯多"] },
      { type: "dinner", emoji: "🍜", label: "晚餐", store: "巷口滷味", item: "滷味拼盤", price: 40, distance: "120m", rating: 4.4, status: "closing", tags: ["宵夜首選", "可自選"] },
    ],
  ],
  full: [
    [
      { type: "breakfast", emoji: "🍳", label: "早餐", store: "早安美芝城", item: "培根蛋餅 + 大冰奶", price: 55, distance: "180m", rating: 4.3, status: "open", tags: ["份量大", "飽足感"] },
      { type: "lunch", emoji: "🍱", label: "午餐", store: "家樂福自助餐", item: "3菜1肉組合", price: 85, distance: "300m", rating: 4.1, status: "open", tags: ["選擇多", "吃到飽感"] },
      { type: "dinner", emoji: "🍜", label: "晚餐", store: "牛肉麵大王", item: "紅燒牛肉麵", price: 95, distance: "250m", rating: 4.5, status: "open", tags: ["大碗滿意", "肉多"] },
    ],
    [
      { type: "breakfast", emoji: "🍳", label: "早餐", store: "麥味登", item: "起司豬排堡 + 紅茶", price: 60, distance: "220m", rating: 4.4, status: "open", tags: ["超飽", "肉多"] },
      { type: "lunch", emoji: "🍱", label: "午餐", store: "池上便當", item: "雞腿便當", price: 90, distance: "280m", rating: 4.3, status: "open", tags: ["大雞腿", "飯量足"] },
      { type: "dinner", emoji: "🍜", label: "晚餐", store: "阿宏炒飯", item: "招牌炒飯 + 蛋花湯", price: 80, distance: "150m", rating: 4.2, status: "open", tags: ["份量驚人", "在地推薦"] },
    ],
  ],
  health: [
    [
      { type: "breakfast", emoji: "🍳", label: "早餐", store: "Subway", item: "蔬菜潛艇堡 6吋", price: 75, distance: "400m", rating: 4.1, status: "open", tags: ["低卡", "蔬菜多"] },
      { type: "lunch", emoji: "🍱", label: "午餐", store: "健康便當", item: "雞胸肉便當", price: 95, distance: "350m", rating: 4.4, status: "open", tags: ["高蛋白", "少油"] },
      { type: "dinner", emoji: "🍜", label: "晚餐", store: "蔬食小館", item: "蔬菜湯麵", price: 65, distance: "280m", rating: 4.2, status: "closing", tags: ["清爽", "蔬菜滿滿"] },
    ],
    [
      { type: "breakfast", emoji: "🍳", label: "早餐", store: "早午餐店", item: "燕麥粥 + 水果", price: 70, distance: "320m", rating: 4.3, status: "open", tags: ["健康", "纖維多"] },
      { type: "lunch", emoji: "🍱", label: "午餐", store: "沙拉吧", item: "雞肉凱薩沙拉", price: 110, distance: "380m", rating: 4.5, status: "open", tags: ["低GI", "高蛋白"] },
      { type: "dinner", emoji: "🍜", label: "晚餐", store: "日式定食", item: "烤魚定食", price: 120, distance: "420m", rating: 4.4, status: "open", tags: ["omega-3", "均衡"] },
    ],
  ],
}

const analysisData: Record<string, { satiety: number; nutrition: number; suggestions: string[] }> = {
  save: { satiety: 75, nutrition: 60, suggestions: ["蛋白質偏低", "可增加雞蛋或豆類補充"] },
  full: { satiety: 95, nutrition: 70, suggestions: ["熱量較高", "建議搭配蔬菜均衡飲食"] },
  health: { satiety: 80, nutrition: 90, suggestions: ["營養均衡", "可適量增加碳水化合物"] },
}

export default function HomePage() {
  const [showResult, setShowResult] = useState(false)
  const [currentGoal, setCurrentGoal] = useState("save")
  const [currentBudget, setCurrentBudget] = useState(150)
  const [mealIndex, setMealIndex] = useState(0)

  const handleSubmit = (data: { budget: number; location: string; diet: string; goal: string }) => {
    setCurrentBudget(data.budget)
    setCurrentGoal(data.goal)
    setMealIndex(0)
    setShowResult(true)
  }

  const handleRefresh = () => {
    const meals = mealDatabase[currentGoal] || mealDatabase.save
    setMealIndex((prev) => (prev + 1) % meals.length)
  }

  const handleBack = () => {
    setShowResult(false)
  }

  const handleAdjustGoal = (goal: string) => {
    setCurrentGoal(goal)
    setMealIndex(0)
  }

  const meals = (mealDatabase[currentGoal] || mealDatabase.save)[mealIndex]
  const totalSpent = meals.reduce((sum, meal) => sum + meal.price, 0)
  const analysis = analysisData[currentGoal] || analysisData.save

  return (
    <main className="min-h-screen bg-background py-8 pb-safe">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <BudgetInput onSubmit={handleSubmit} />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MealResult
              budget={currentBudget}
              meals={meals}
              totalSpent={totalSpent}
              satiety={analysis.satiety}
              nutrition={analysis.nutrition}
              suggestions={analysis.suggestions}
              onRefresh={handleRefresh}
              onBack={handleBack}
              onAdjustGoal={handleAdjustGoal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Sparkles, ChevronDown, Tag, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const budgetOptions = [100, 150, 200, 300]

const locations: Record<string, string[]> = {
  "台北市": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
  "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "土城區", "蘆洲區", "汐止區", "樹林區", "淡水區", "三峽區"],
  "桃園市": ["桃園區", "中壢區", "平鎮區", "八德區", "楊梅區", "蘆竹區", "龜山區", "龍潭區", "大溪區", "大園區"],
  "台中市": ["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "太平區", "大里區", "霧峰區", "豐原區"],
  "台南市": ["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "歸仁區", "新化區", "左鎮區"],
  "高雄市": ["楠梓區", "左營區", "鼓山區", "三民區", "鹽埕區", "前金區", "新興區", "苓雅區", "前鎮區", "小港區", "鳳山區"],
}

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
    city: string
    district: string
    diet: string
    goal: string
  }) => void
}

export function BudgetInput({ onSubmit }: BudgetInputProps) {
  const [budget, setBudget] = useState(150)
  const [city, setCity] = useState("台北市")
  const [district, setDistrict] = useState("大安區")
  const [diet, setDiet] = useState("any")
  const [goal, setGoal] = useState("save")
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [showDistrictPicker, setShowDistrictPicker] = useState(false)

  const cityRef = useRef<HTMLDivElement>(null)
  const districtRef = useRef<HTMLDivElement>(null)

  const handleCityChange = (newCity: string) => {
    setCity(newCity)
    setDistrict(locations[newCity][0])
    setShowCityPicker(false)
  }

  const handleSubmit = () => {
    onSubmit({ budget, city, district, diet, goal })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Logo Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="relative w-32 h-32 mx-auto mb-3"
        >
          <Image
            src="/logo.png"
            alt="幹飯王"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-3"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">預算版</span>
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground mb-1">今日炫什麼</h1>
        <p className="text-muted-foreground text-sm">用最少的錢，吃最合理的一天</p>
      </div>

      <Card className="border-2 border-border shadow-lg mb-4">
        <CardContent className="p-5 space-y-5">
          {/* Budget Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="text-base">💰</span> 今日預算
            </label>
            <div className="flex items-center justify-center bg-muted rounded-xl p-3 mb-2">
              <span className="text-3xl font-bold text-primary">{budget}</span>
              <span className="text-lg text-muted-foreground ml-1">元</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {budgetOptions.map((option) => (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBudget(option)}
                  className={`py-2 px-2 rounded-lg text-sm font-medium transition-all ${
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

          {/* Location Selection with Scroll Picker */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="w-4 h-4 text-primary" /> 你在哪？
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* City Picker */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCityPicker(!showCityPicker)
                    setShowDistrictPicker(false)
                  }}
                  className="w-full h-11 px-3 bg-secondary rounded-lg flex items-center justify-between text-sm font-medium"
                >
                  <span>{city}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
                </button>
                {showCityPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-20 top-12 left-0 right-0 bg-card border-2 border-border rounded-lg shadow-lg overflow-hidden"
                  >
                    <div ref={cityRef} className="max-h-40 overflow-y-auto overscroll-contain">
                      {Object.keys(locations).map((c) => (
                        <button
                          key={c}
                          onClick={() => handleCityChange(c)}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${
                            city === c ? "bg-primary/10 text-primary font-medium" : ""
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* District Picker */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowDistrictPicker(!showDistrictPicker)
                    setShowCityPicker(false)
                  }}
                  className="w-full h-11 px-3 bg-secondary rounded-lg flex items-center justify-between text-sm font-medium"
                >
                  <span>{district}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDistrictPicker ? "rotate-180" : ""}`} />
                </button>
                {showDistrictPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-20 top-12 left-0 right-0 bg-card border-2 border-border rounded-lg shadow-lg overflow-hidden"
                  >
                    <div ref={districtRef} className="max-h-40 overflow-y-auto overscroll-contain">
                      {locations[city].map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setDistrict(d)
                            setShowDistrictPicker(false)
                          }}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${
                            district === d ? "bg-primary/10 text-primary font-medium" : ""
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Diet Preference */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="text-base">🍽️</span> 飲食偏好
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dietPreferences.map((pref) => (
                <motion.button
                  key={pref.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDiet(pref.id)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
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
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="text-base">🎯</span> 你的目標
            </label>
            <div className="grid grid-cols-3 gap-2">
              {goals.map((g) => (
                <motion.button
                  key={g.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGoal(g.id)}
                  className={`py-2.5 px-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                    goal === g.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <span className="text-base">{g.icon}</span>
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
              className="w-full h-12 text-base font-semibold rounded-xl shadow-lg"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              幫我算今天怎麼炫
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Promotions Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 border-accent/30 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-accent" />
              <span className="font-semibold text-sm text-foreground">今日優惠活動</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-card rounded-lg">
                <div className="w-8 h-8 bg-[#00a650] rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">7-11 超商</p>
                  <p className="text-xs text-muted-foreground truncate">御飯糰第二件6折</p>
                </div>
                <span className="text-xs text-accent font-medium shrink-0">合作優惠</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-card rounded-lg">
                <div className="w-8 h-8 bg-[#00a6d6] rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">全家 FamilyMart</p>
                  <p className="text-xs text-muted-foreground truncate">咖啡買一送一</p>
                </div>
                <span className="text-xs text-accent font-medium shrink-0">限時</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-card rounded-lg">
                <div className="w-8 h-8 bg-[#e74c3c] rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">萊爾富 Hi-Life</p>
                  <p className="text-xs text-muted-foreground truncate">便當特價$59起</p>
                </div>
                <span className="text-xs text-accent font-medium shrink-0">熱門</span>
              </div>
            </div>
            <button className="w-full mt-3 text-xs text-primary font-medium hover:underline">
              查看更多優惠活動 →
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

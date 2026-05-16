"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BudgetInput } from "@/components/budget-input"
import { MealResult } from "@/components/meal-result"
import { AuthModal } from "@/components/auth-modal"
import { StoreUploadModal } from "@/components/store-upload-modal"
import { FavoritesModal } from "@/components/favorites-modal"
import { UserMenu } from "@/components/user-menu"

interface GoogleReview {
  author: string
  rating: number
  text: string
  time: string
}

interface MealData {
  type: "breakfast" | "lunch" | "dinner"
  emoji: string
  label: string
  store: string
  item: string
  price: number
  distance: string
  rating: number
  googleRating: number
  reviewCount: number
  status: "open" | "closing" | "closed"
  tags: string[]
  googleMapUrl: string
  reviews: GoogleReview[]
  partnerDeal?: string
}

const mealDatabase: Record<string, MealData[][]> = {
  save: [
    [
      { 
        type: "breakfast", emoji: "🍳", label: "早餐", store: "永和豆漿", item: "蛋餅 + 豆漿", 
        price: 40, distance: "150m", rating: 4.2, googleRating: 4.3, reviewCount: 328, status: "open", 
        tags: ["高CP值", "學生熱門"],
        googleMapUrl: "https://maps.google.com/?q=永和豆漿",
        reviews: [
          { author: "王小明", rating: 5, text: "豆漿超濃郁，蛋餅酥脆好吃！價格實惠，學生的好朋友。", time: "2週前" },
          { author: "李美玲", rating: 4, text: "份量很足，早餐吃這樣很飽。店員態度親切。", time: "1個月前" },
          { author: "陳大華", rating: 4, text: "傳統早餐味道，推薦加蛋的蛋餅。", time: "3週前" },
        ]
      },
      { 
        type: "lunch", emoji: "🍱", label: "午餐", store: "阿婆自助餐", item: "2菜1肉組合", 
        price: 70, distance: "280m", rating: 4.0, googleRating: 4.1, reviewCount: 512, status: "open", 
        tags: ["分量足", "便宜"],
        googleMapUrl: "https://maps.google.com/?q=自助餐",
        reviews: [
          { author: "張小華", rating: 4, text: "菜色多樣，價格便宜，適合天天來吃。", time: "1週前" },
          { author: "林志明", rating: 5, text: "阿婆人很好，菜都很新鮮，推薦！", time: "2週前" },
          { author: "黃美美", rating: 4, text: "CP值高，學生和上班族的好選擇。", time: "1個月前" },
        ]
      },
      { 
        type: "dinner", emoji: "🍜", label: "晚餐", store: "老王麵店", item: "陽春麵", 
        price: 35, distance: "180m", rating: 4.1, googleRating: 4.2, reviewCount: 267, status: "open", 
        tags: ["便宜首選", "湯頭讚"],
        googleMapUrl: "https://maps.google.com/?q=麵店",
        reviews: [
          { author: "吳大明", rating: 5, text: "湯頭清甜，麵條Q彈，35元超值！", time: "3天前" },
          { author: "鄭小芬", rating: 4, text: "簡單但美味，適合當宵夜。", time: "1週前" },
          { author: "周志豪", rating: 4, text: "老店的味道，很懷念的口味。", time: "2週前" },
        ]
      },
    ],
    [
      { 
        type: "breakfast", emoji: "🍳", label: "早餐", store: "美而美", item: "總匯三明治", 
        price: 45, distance: "200m", rating: 4.3, googleRating: 4.4, reviewCount: 445, status: "open", 
        tags: ["份量大", "學生愛"],
        googleMapUrl: "https://maps.google.com/?q=美而美早餐",
        reviews: [
          { author: "劉小明", rating: 5, text: "三明治料超多，吃得很飽！", time: "1週前" },
          { author: "陳美玲", rating: 4, text: "早餐種類多，價格合理。", time: "2週前" },
          { author: "王大華", rating: 5, text: "醬料調得很好，每天都想吃。", time: "3週前" },
        ],
        partnerDeal: "幹飯王專屬9折"
      },
      { 
        type: "lunch", emoji: "🍱", label: "午餐", store: "便當街", item: "排骨便當", 
        price: 65, distance: "350m", rating: 4.2, googleRating: 4.3, reviewCount: 389, status: "open", 
        tags: ["經典款", "飯多"],
        googleMapUrl: "https://maps.google.com/?q=便當店",
        reviews: [
          { author: "李志明", rating: 5, text: "排骨炸得酥脆，飯量超多！", time: "5天前" },
          { author: "張美美", rating: 4, text: "配菜新鮮，整體很滿意。", time: "1週前" },
          { author: "黃大明", rating: 4, text: "老字號便當店，品質穩定。", time: "2週前" },
        ]
      },
      { 
        type: "dinner", emoji: "🍜", label: "晚餐", store: "巷口滷味", item: "滷味拼盤", 
        price: 40, distance: "120m", rating: 4.4, googleRating: 4.5, reviewCount: 623, status: "closing", 
        tags: ["宵夜首選", "可自選"],
        googleMapUrl: "https://maps.google.com/?q=滷味攤",
        reviews: [
          { author: "周小芬", rating: 5, text: "滷汁入味，百吃不膩！", time: "2天前" },
          { author: "吳志豪", rating: 5, text: "自己選料很方便，老闆很親切。", time: "1週前" },
          { author: "鄭大明", rating: 4, text: "晚上肚子餓的好去處。", time: "2週前" },
        ]
      },
    ],
  ],
  full: [
    [
      { 
        type: "breakfast", emoji: "🍳", label: "早餐", store: "早安美芝城", item: "培根蛋餅 + 大冰奶", 
        price: 55, distance: "180m", rating: 4.3, googleRating: 4.4, reviewCount: 567, status: "open", 
        tags: ["份量大", "飽足感"],
        googleMapUrl: "https://maps.google.com/?q=早安美芝城",
        reviews: [
          { author: "陳小明", rating: 5, text: "培根超多片，蛋餅很大份！", time: "3天前" },
          { author: "林美玲", rating: 5, text: "大冰奶香濃，早餐首選！", time: "1週前" },
          { author: "王大華", rating: 4, text: "份量足，吃完很有精神。", time: "2週前" },
        ]
      },
      { 
        type: "lunch", emoji: "🍱", label: "午餐", store: "家樂福自助餐", item: "3菜1肉組合", 
        price: 85, distance: "300m", rating: 4.1, googleRating: 4.2, reviewCount: 412, status: "open", 
        tags: ["選擇多", "吃到飽感"],
        googleMapUrl: "https://maps.google.com/?q=自助餐",
        reviews: [
          { author: "張志明", rating: 4, text: "菜色選擇超多，每天都有不同菜。", time: "5天前" },
          { author: "黃美美", rating: 5, text: "肉給得很大方，很滿足！", time: "1週前" },
          { author: "劉大明", rating: 4, text: "環境乾淨，吃得安心。", time: "3週前" },
        ],
        partnerDeal: "滿100送紅茶"
      },
      { 
        type: "dinner", emoji: "🍜", label: "晚餐", store: "牛肉麵大王", item: "紅燒牛肉麵", 
        price: 95, distance: "250m", rating: 4.5, googleRating: 4.6, reviewCount: 892, status: "open", 
        tags: ["大碗滿意", "肉多"],
        googleMapUrl: "https://maps.google.com/?q=牛肉麵",
        reviews: [
          { author: "周小芬", rating: 5, text: "牛肉軟嫩，湯頭濃郁，超讚！", time: "1天前" },
          { author: "吳志豪", rating: 5, text: "肉塊超大塊，吃得很過癮。", time: "4天前" },
          { author: "鄭美玲", rating: 5, text: "附近最好吃的牛肉麵！", time: "1週前" },
        ]
      },
    ],
    [
      { 
        type: "breakfast", emoji: "🍳", label: "早餐", store: "麥味登", item: "起司豬排堡 + 紅茶", 
        price: 60, distance: "220m", rating: 4.4, googleRating: 4.5, reviewCount: 678, status: "open", 
        tags: ["超飽", "肉多"],
        googleMapUrl: "https://maps.google.com/?q=麥味登",
        reviews: [
          { author: "李小明", rating: 5, text: "豬排厚實多汁，起司融化超香！", time: "2天前" },
          { author: "陳美玲", rating: 5, text: "早餐店界的扛霸子！", time: "1週前" },
          { author: "王志明", rating: 4, text: "份量很夠，中午都不會餓。", time: "2週前" },
        ],
        partnerDeal: "出示APP享8折"
      },
      { 
        type: "lunch", emoji: "🍱", label: "午餐", store: "池上便當", item: "雞腿便當", 
        price: 90, distance: "280m", rating: 4.3, googleRating: 4.4, reviewCount: 534, status: "open", 
        tags: ["大雞腿", "飯量足"],
        googleMapUrl: "https://maps.google.com/?q=池上便當",
        reviews: [
          { author: "張大華", rating: 5, text: "雞腿炸得金黃酥脆，超好吃！", time: "3天前" },
          { author: "黃美美", rating: 5, text: "池上米飯粒粒分明，很香。", time: "1週前" },
          { author: "劉志明", rating: 4, text: "便當界的經典，百吃不厭。", time: "2週前" },
        ]
      },
      { 
        type: "dinner", emoji: "🍜", label: "晚餐", store: "阿宏炒飯", item: "招牌炒飯 + 蛋花湯", 
        price: 80, distance: "150m", rating: 4.2, googleRating: 4.3, reviewCount: 445, status: "open", 
        tags: ["份量驚人", "在地推薦"],
        googleMapUrl: "https://maps.google.com/?q=炒飯店",
        reviews: [
          { author: "周小芬", rating: 5, text: "炒飯粒粒分明，鑊氣十足！", time: "4天前" },
          { author: "吳大明", rating: 4, text: "份量大到吃不完，很划算。", time: "1週前" },
          { author: "鄭志豪", rating: 4, text: "在地人的愛店，推薦加蛋。", time: "3週前" },
        ]
      },
    ],
  ],
  health: [
    [
      { 
        type: "breakfast", emoji: "🍳", label: "早餐", store: "Subway", item: "蔬菜潛艇堡 6吋", 
        price: 75, distance: "400m", rating: 4.1, googleRating: 4.2, reviewCount: 345, status: "open", 
        tags: ["低卡", "蔬菜多"],
        googleMapUrl: "https://maps.google.com/?q=Subway",
        reviews: [
          { author: "陳小明", rating: 4, text: "蔬菜新鮮，醬料可以自己選。", time: "1週前" },
          { author: "林美玲", rating: 5, text: "減肥期間的好朋友！", time: "2週前" },
          { author: "王大華", rating: 4, text: "健康又美味，推薦橄欖醬。", time: "3週前" },
        ]
      },
      { 
        type: "lunch", emoji: "🍱", label: "午餐", store: "健康便當", item: "雞胸肉便當", 
        price: 95, distance: "350m", rating: 4.4, googleRating: 4.5, reviewCount: 567, status: "open", 
        tags: ["高蛋白", "少油"],
        googleMapUrl: "https://maps.google.com/?q=健康便當",
        reviews: [
          { author: "張志明", rating: 5, text: "雞胸肉嫩又不柴，健身必吃！", time: "3天前" },
          { author: "黃美美", rating: 5, text: "少油少鹽但很好吃，推薦！", time: "1週前" },
          { author: "劉大明", rating: 4, text: "蛋白質滿滿，增肌好幫手。", time: "2週前" },
        ],
        partnerDeal: "幹飯王會員85折"
      },
      { 
        type: "dinner", emoji: "🍜", label: "晚餐", store: "蔬食小館", item: "蔬菜湯麵", 
        price: 65, distance: "280m", rating: 4.2, googleRating: 4.3, reviewCount: 298, status: "closing", 
        tags: ["清爽", "蔬菜滿滿"],
        googleMapUrl: "https://maps.google.com/?q=蔬食餐廳",
        reviews: [
          { author: "周小芬", rating: 5, text: "湯頭清甜，蔬菜超多種！", time: "5天前" },
          { author: "吳志豪", rating: 4, text: "吃完身體很舒服，不會有負擔。", time: "1週前" },
          { author: "鄭美玲", rating: 4, text: "素食者的福音，很推薦。", time: "2週前" },
        ]
      },
    ],
    [
      { 
        type: "breakfast", emoji: "🍳", label: "早餐", store: "早午餐店", item: "燕麥粥 + 水果", 
        price: 70, distance: "320m", rating: 4.3, googleRating: 4.4, reviewCount: 234, status: "open", 
        tags: ["健康", "纖維多"],
        googleMapUrl: "https://maps.google.com/?q=早午餐",
        reviews: [
          { author: "李小明", rating: 5, text: "燕麥粥綿密，水果很新鮮！", time: "4天前" },
          { author: "陳美玲", rating: 4, text: "健康早餐的好選擇。", time: "1週前" },
          { author: "王志明", rating: 5, text: "吃完精神很好，推薦！", time: "2週前" },
        ]
      },
      { 
        type: "lunch", emoji: "🍱", label: "午餐", store: "沙拉吧", item: "雞肉凱薩沙拉", 
        price: 110, distance: "380m", rating: 4.5, googleRating: 4.6, reviewCount: 678, status: "open", 
        tags: ["低GI", "高蛋白"],
        googleMapUrl: "https://maps.google.com/?q=沙拉店",
        reviews: [
          { author: "張大華", rating: 5, text: "蔬菜超新鮮，雞肉很嫩！", time: "2天前" },
          { author: "黃美美", rating: 5, text: "減脂期的最愛，好吃又健康。", time: "1週前" },
          { author: "劉志明", rating: 5, text: "凱薩醬調得剛剛好，大推！", time: "2週前" },
        ]
      },
      { 
        type: "dinner", emoji: "🍜", label: "晚餐", store: "日式定食", item: "烤魚定食", 
        price: 120, distance: "420m", rating: 4.4, googleRating: 4.5, reviewCount: 512, status: "open", 
        tags: ["omega-3", "均衡"],
        googleMapUrl: "https://maps.google.com/?q=日式定食",
        reviews: [
          { author: "周小芬", rating: 5, text: "烤魚外酥內嫩，配菜精緻！", time: "3天前" },
          { author: "吳大明", rating: 5, text: "日式料理的精髓，很道地。", time: "1週前" },
          { author: "鄭志豪", rating: 4, text: "營養均衡的一餐，推薦鯖魚。", time: "2週前" },
        ]
      },
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
  const [showAuth, setShowAuth] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  const handleSubmit = (data: { budget: number; city: string; district: string; diet: string; goal: string }) => {
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
    <main className="min-h-screen bg-background pb-safe">
      {/* Top navbar */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
          <span className="font-bold text-sm text-foreground">幹飯王</span>
          <UserMenu
            onShowFavorites={() => setShowFavorites(true)}
            onShowUpload={() => setShowUpload(true)}
            onShowAuth={() => setShowAuth(true)}
          />
        </div>
      </div>

      <div className="py-6">
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
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        {showUpload && (
          <StoreUploadModal
            onClose={() => setShowUpload(false)}
            onSuccess={() => {}}
          />
        )}
        {showFavorites && <FavoritesModal onClose={() => setShowFavorites(false)} />}
      </AnimatePresence>
    </main>
  )
}

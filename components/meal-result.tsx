"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Star, Clock, RefreshCw, Search, TrendingDown, Utensils, Heart, AlertTriangle, ExternalLink, Map, Tag, X, ChevronRight, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface GoogleReview {
  author: string
  rating: number
  text: string
  time: string
}

interface Meal {
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

// Generate a consistent hash from string for stable image selection
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Get meal category keyword for image search
function getMealCategory(type: "breakfast" | "lunch" | "dinner"): string {
  switch (type) {
    case "breakfast": return "breakfast,food"
    case "lunch": return "lunch,asian,food"
    case "dinner": return "dinner,noodles,food"
  }
}

// Generate loremflickr URL with consistent hash
function getFlickrImageUrl(itemName: string, mealType: "breakfast" | "lunch" | "dinner"): string {
  const hash = hashCode(itemName + mealType)
  const category = getMealCategory(mealType)
  return `https://loremflickr.com/400/300/${category}?lock=${hash}`
}

// Generate Google Image search URL
function getGoogleImageSearchUrl(itemName: string): string {
  const query = encodeURIComponent(`${itemName} 台灣 食物`)
  return `https://www.google.com/search?tbm=isch&q=${query}`
}

// Meal Image Component with dynamic loading, hover overlay, and fallback
function MealImage({ 
  itemName, 
  mealType, 
  partnerDeal 
}: { 
  itemName: string
  mealType: "breakfast" | "lunch" | "dinner"
  partnerDeal?: string 
}) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const flickrUrl = getFlickrImageUrl(itemName, mealType)
  const googleSearchUrl = getGoogleImageSearchUrl(itemName)

  if (imageError) {
    return (
      <a
        href={googleSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full h-32 rounded-lg overflow-hidden mb-3 bg-muted flex flex-col items-center justify-center gap-2 hover:bg-muted/80 transition-colors"
      >
        <ImageIcon className="w-8 h-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">點擊搜尋圖片</span>
      </a>
    )
  }

  return (
    <a
      href={googleSearchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-full h-32 rounded-lg overflow-hidden mb-3 block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <Image
        src={flickrUrl}
        alt={itemName}
        fill
        className="object-cover transition-transform duration-300"
        style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        onError={() => setImageError(true)}
        unoptimized
      />
      
      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
        <div className="text-white text-center px-4">
          <Search className="w-5 h-5 mx-auto mb-1" />
          <span className="text-xs">在 Google 搜尋更多圖片</span>
        </div>
      </div>

      {/* Partner Deal Badge */}
      {partnerDeal && (
        <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10">
          <Tag className="w-3 h-3" />
          {partnerDeal}
        </div>
      )}
    </a>
  )
}

function ReviewModal({ reviews, storeName, onClose }: { reviews: GoogleReview[], storeName: string, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-md rounded-t-2xl max-h-[70vh] overflow-hidden"
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{storeName}</h3>
            <p className="text-xs text-muted-foreground">Google Maps 評論</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto max-h-[50vh]">
          {reviews.map((review, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-foreground">{review.author}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3 h-3 ${idx < review.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
              <p className="text-xs text-muted-foreground/70 mt-2">{review.time}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
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
  const [selectedReviews, setSelectedReviews] = useState<{ reviews: GoogleReview[], storeName: string } | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto px-4 pb-8"
    >
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="relative w-16 h-16">
          <Image src="/logo.png" alt="幹飯王" fill className="object-contain" />
        </div>
      </div>

      {/* Header Summary */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border-2 border-border rounded-2xl p-4 mb-4 shadow-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍱</span>
            <h2 className="font-bold text-base text-foreground">今日最佳組合</h2>
          </div>
          <span className="text-sm text-muted-foreground">預算 {budget} 元</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
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
      <div className="space-y-4 mb-4">
        {meals.map((meal, index) => (
          <motion.div
            key={meal.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="border-2 border-border overflow-hidden">
              <CardHeader className="bg-muted/50 py-2 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meal.emoji}</span>
                  <span className="font-semibold text-foreground text-sm">{meal.label}</span>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                {/* Dynamic Meal Image */}
                <MealImage 
                  itemName={meal.item} 
                  mealType={meal.type} 
                  partnerDeal={meal.partnerDeal} 
                />

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🏪</span>
                      <span className="font-medium text-foreground text-sm">{meal.store}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{meal.type === "breakfast" ? "🥪" : meal.type === "lunch" ? "���" : "🍜"}</span>
                      <span className="text-muted-foreground text-sm">{meal.item}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                  <span className="font-bold text-primary">💰 {meal.price}元</span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <MapPin className="w-3 h-3" /> {meal.distance}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[meal.status].bg} ${statusConfig[meal.status].color}`}>
                    <Clock className="w-3 h-3" />
                    {statusConfig[meal.status].label}
                  </span>
                </div>

                {/* Google Maps Rating */}
                <div className="bg-muted/50 rounded-lg p-2.5 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                        <Map className="w-3 h-3 text-[#4285f4]" />
                      </div>
                      <span className="text-xs text-muted-foreground">Google Maps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span className="font-semibold text-sm text-foreground">{meal.googleRating}</span>
                      <span className="text-xs text-muted-foreground">({meal.reviewCount}則評論)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setSelectedReviews({ reviews: meal.reviews, storeName: meal.store })}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      查看評論 <ChevronRight className="w-3 h-3" />
                    </button>
                    <a
                      href={meal.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 ml-auto"
                    >
                      在地圖中開啟 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {meal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                    >
                      {tag}
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
        <Card className="border-2 border-border mb-4">
          <CardHeader className="pb-2 pt-3 px-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              📊 今日飲食分析
            </h3>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-foreground">
                  🔋 飽足感
                </span>
                <span className="font-medium text-foreground">{satiety}%</span>
              </div>
              <Progress value={satiety} className="h-2" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-foreground">
                  🥗 營養評分
                </span>
                <span className="font-medium text-foreground">{nutrition} / 100</span>
              </div>
              <Progress value={nutrition} className="h-2" />
            </div>

            {suggestions.length > 0 && (
              <div className="bg-warning/10 rounded-lg p-2.5 space-y-1">
                <div className="flex items-center gap-2 text-warning font-medium text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  建議
                </div>
                {suggestions.map((suggestion, i) => (
                  <p key={i} className="text-xs text-foreground/80 pl-5">• {suggestion}</p>
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
        className="mb-4"
      >
        <p className="text-xs text-muted-foreground text-center mb-2">🎯 調整你的目標</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => onAdjustGoal("save")}
            className="flex flex-col items-center gap-1 h-auto py-2.5"
          >
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="text-xs">更省錢</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onAdjustGoal("full")}
            className="flex flex-col items-center gap-1 h-auto py-2.5"
          >
            <Utensils className="w-4 h-4 text-primary" />
            <span className="text-xs">更吃飽</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onAdjustGoal("health")}
            className="flex flex-col items-center gap-1 h-auto py-2.5"
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
          className="h-11 rounded-xl"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          換一組推薦
        </Button>
        <Button
          onClick={onBack}
          className="h-11 rounded-xl"
        >
          <Search className="w-4 h-4 mr-2" />
          重新設定
        </Button>
      </motion.div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedReviews && (
          <ReviewModal
            reviews={selectedReviews.reviews}
            storeName={selectedReviews.storeName}
            onClose={() => setSelectedReviews(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

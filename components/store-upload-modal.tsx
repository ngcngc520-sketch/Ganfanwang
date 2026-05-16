"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Store, MapPin, Phone, Tag, DollarSign, Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

interface StoreUploadModalProps {
  onClose: () => void
  onSuccess: () => void
}

const cities = ["台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市"]
const cityDistricts: Record<string, string[]> = {
  "台北市": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
  "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "土城區", "蘆洲區", "汐止區", "樹林區"],
  "桃園市": ["桃園區", "中壢區", "平鎮區", "八德區", "楊梅區", "蘆竹區", "龜山區"],
  "台中市": ["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "太平區", "大里區"],
  "台南市": ["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "歸仁區"],
  "高雄市": ["楠梓區", "左營區", "鼓山區", "三民區", "鹽埕區", "前金區", "新興區", "苓雅區", "前鎮區", "鳳山區"],
}

interface MealEntry {
  name: string
  price: string
  meal_type: "breakfast" | "lunch" | "dinner"
}

export function StoreUploadModal({ onClose, onSuccess }: StoreUploadModalProps) {
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("台北市")
  const [district, setDistrict] = useState("大安區")
  const [phone, setPhone] = useState("")
  const [category, setCategory] = useState<"breakfast" | "lunch" | "dinner" | "all">("all")
  const [priceMin, setPriceMin] = useState("30")
  const [priceMax, setPriceMax] = useState("150")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [meals, setMeals] = useState<MealEntry[]>([{ name: "", price: "", meal_type: "lunch" }])

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput("")
  }

  const removeTag = (t: string) => setTags(tags.filter(x => x !== t))

  const addMeal = () => setMeals([...meals, { name: "", price: "", meal_type: "lunch" }])
  const removeMeal = (i: number) => setMeals(meals.filter((_, idx) => idx !== i))
  const updateMeal = (i: number, field: keyof MealEntry, value: string) => {
    setMeals(meals.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    if (!name.trim()) { setError("請填寫店家名稱"); return }
    if (!district) { setError("請選擇區域"); return }

    setLoading(true)
    setError("")

    try {
      const token = session.access_token
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          address: address.trim(),
          city,
          district,
          phone: phone.trim() || null,
          category,
          price_min: parseInt(priceMin) || 0,
          price_max: parseInt(priceMax) || 999,
          tags,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      const storeId = json.store.id
      const validMeals = meals.filter(m => m.name.trim() && m.price)
      for (const m of validMeals) {
        await fetch("/api/meals", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ store_id: storeId, name: m.name.trim(), price: parseInt(m.price), meal_type: m.meal_type }),
        })
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "上傳失敗，請再試一次")
    }
    setLoading(false)
  }

  const mealTypeLabel = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐" }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border-2 border-border shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-bold text-foreground">上傳店家資料</h2>
              <p className="text-xs text-muted-foreground">步驟 {step}/2</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          {step === 1 && (
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" /> 店家名稱 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="例：老王麵店" required
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">店家介紹</label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="描述你的店家特色..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> 城市 <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={city} onChange={e => { setCity(e.target.value); setDistrict(cityDistricts[e.target.value][0]) }}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                  >
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">區域 <span className="text-destructive">*</span></label>
                  <select
                    value={district} onChange={e => setDistrict(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                  >
                    {(cityDistricts[city] || []).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">詳細地址</label>
                <input
                  type="text" value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="例：中山路一段 123 號"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> 電話
                  </label>
                  <input
                    type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="02-1234-5678"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">餐類</label>
                  <select
                    value={category} onChange={e => setCategory(e.target.value as typeof category)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="all">全時段</option>
                    <option value="breakfast">早餐</option>
                    <option value="lunch">午餐</option>
                    <option value="dinner">晚餐</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> 價格區間（元）
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} min={0}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-muted-foreground">~</span>
                  <input
                    type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} min={0}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> 標籤
                </label>
                <div className="flex gap-2">
                  <input
                    type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                    placeholder="輸入標籤後按 Enter"
                    className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addTag}><Plus className="w-4 h-4" /></Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {t}
                        <button type="button" onClick={() => removeTag(t)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">新增餐點（選填）</p>
                <Button type="button" variant="outline" size="sm" onClick={addMeal}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> 加餐點
                </Button>
              </div>

              {meals.map((meal, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">餐點 {i + 1}</span>
                    {meals.length > 1 && (
                      <button type="button" onClick={() => removeMeal(i)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text" value={meal.name} onChange={e => updateMeal(i, "name", e.target.value)}
                    placeholder="餐點名稱"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number" value={meal.price} onChange={e => updateMeal(i, "price", e.target.value)} min={0}
                      placeholder="價格（元）"
                      className="h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                    />
                    <select
                      value={meal.meal_type} onChange={e => updateMeal(i, "meal_type", e.target.value)}
                      className="h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                    >
                      {(["breakfast", "lunch", "dinner"] as const).map(t => (
                        <option key={t} value={t}>{mealTypeLabel[t]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
              )}
            </div>
          )}

          <div className="p-5 pt-0 flex gap-3">
            {step === 2 && (
              <Button type="button" variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setStep(1)}>
                上一步
              </Button>
            )}
            {step === 1 && (
              <Button
                type="button" className="flex-1 h-11 rounded-xl font-semibold"
                onClick={() => { if (!name.trim()) { setError("請填寫店家名稱"); return } setError(""); setStep(2) }}
              >
                下一步
              </Button>
            )}
            {step === 2 && (
              <Button type="submit" className="flex-1 h-11 rounded-xl font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "送出上架"}
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

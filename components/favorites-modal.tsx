"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Heart, MapPin, Star, Trash2, Loader2, Store } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Favorite } from "@/lib/supabase"

interface FavoritesModalProps {
  onClose: () => void
}

export function FavoritesModal({ onClose }: FavoritesModalProps) {
  const { session } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  const fetchFavorites = async () => {
    if (!session) return
    setLoading(true)
    const res = await fetch("/api/favorites", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (res.ok) {
      const json = await res.json()
      setFavorites(json.favorites)
    }
    setLoading(false)
  }

  useEffect(() => { fetchFavorites() }, [session])

  const handleRemove = async (storeId: string) => {
    if (!session) return
    setRemoving(storeId)
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ store_id: storeId }),
    })
    setFavorites(prev => prev.filter(f => f.store_id !== storeId))
    setRemoving(null)
  }

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
        className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border-2 border-border shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive fill-destructive" />
            <h2 className="font-bold text-foreground">我的收藏</h2>
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {favorites.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">還沒有收藏的店家</p>
              <p className="text-sm text-muted-foreground/70 mt-1">在餐廳結果頁按愛心收藏</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((fav) => (
                <motion.div
                  key={fav.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl border border-border"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {fav.store?.name ?? "未知店家"}
                    </p>
                    {fav.store && (
                      <>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {fav.store.city}{fav.store.district}
                          </span>
                          {fav.store.rating > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 fill-warning text-warning" />
                              {fav.store.rating}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {fav.store.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(fav.store_id)}
                    disabled={removing === fav.store_id}
                    className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors shrink-0"
                  >
                    {removing === fav.store_id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, LogOut, Heart, Store, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UserMenuProps {
  onShowFavorites: () => void
  onShowUpload: () => void
  onShowAuth: () => void
}

export function UserMenu({ onShowFavorites, onShowUpload, onShowAuth }: UserMenuProps) {
  const { user, profile, signOut, loading } = useAuth()
  const [open, setOpen] = useState(false)

  if (loading) return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />

  if (!user) {
    return (
      <button
        onClick={onShowAuth}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <User className="w-3.5 h-3.5" />
        登入
      </button>
    )
  }

  const initials = profile?.username?.slice(0, 1).toUpperCase() ?? user.email?.slice(0, 1).toUpperCase() ?? "U"

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
      >
        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <span className="text-foreground max-w-[80px] truncate">{profile?.username ?? "用戶"}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-44 bg-card border-2 border-border rounded-xl shadow-lg z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-border">
                <p className="text-xs text-muted-foreground">登入身分</p>
                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { setOpen(false); onShowFavorites() }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <Heart className="w-4 h-4 text-destructive" />
                  我的收藏
                </button>
                <button
                  onClick={() => { setOpen(false); onShowUpload() }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <Store className="w-4 h-4 text-primary" />
                  上傳店家
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={() => { setOpen(false); signOut() }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  登出
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

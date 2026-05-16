import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Store = {
  id: string
  owner_id: string
  name: string
  description: string
  address: string
  city: string
  district: string
  phone: string | null
  category: 'breakfast' | 'lunch' | 'dinner' | 'all'
  price_min: number
  price_max: number
  rating: number
  image_url: string | null
  tags: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Meal = {
  id: string
  store_id: string
  name: string
  description: string | null
  price: number
  meal_type: 'breakfast' | 'lunch' | 'dinner'
  image_url: string | null
  is_available: boolean
  created_at: string
}

export type Favorite = {
  id: string
  user_id: string
  store_id: string
  created_at: string
  store?: Store
}

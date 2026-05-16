import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const token = authHeader.replace("Bearer ", "")
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { store_id, name, description, price, meal_type, image_url } = body

  if (!store_id || !name || price == null || !meal_type) {
    return NextResponse.json({ error: "store_id、名稱、價格、餐類為必填" }, { status: 400 })
  }

  const { data: store } = await supabase
    .from("stores")
    .select("owner_id")
    .eq("id", store_id)
    .eq("owner_id", user.id)
    .maybeSingle()

  if (!store) return NextResponse.json({ error: "無此店家或無權限" }, { status: 403 })

  const { data, error } = await supabase
    .from("meals")
    .insert({ store_id, name, description: description ?? null, price, meal_type, image_url: image_url ?? null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ meal: data }, { status: 201 })
}

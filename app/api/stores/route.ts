import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const district = searchParams.get("district")
  const category = searchParams.get("category")
  const budget = searchParams.get("budget")

  let query = supabase
    .from("stores")
    .select("*, meals(*)")
    .eq("is_active", true)

  if (city) query = query.eq("city", city)
  if (district) query = query.eq("district", district)
  if (category && category !== "all") query = query.eq("category", category)
  if (budget) query = query.lte("price_max", parseInt(budget))

  const { data, error } = await query.order("rating", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ stores: data })
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const token = authHeader.replace("Bearer ", "")
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { name, description, address, city, district, phone, category, price_min, price_max, tags, image_url } = body

  if (!name || !city || !district) {
    return NextResponse.json({ error: "名稱、城市、區域為必填" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("stores")
    .insert({
      owner_id: user.id,
      name,
      description: description ?? "",
      address: address ?? "",
      city,
      district,
      phone: phone ?? null,
      category: category ?? "all",
      price_min: price_min ?? 0,
      price_max: price_max ?? 999,
      tags: tags ?? [],
      image_url: image_url ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ store: data }, { status: 201 })
}

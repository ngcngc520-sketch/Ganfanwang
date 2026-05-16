import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const token = authHeader.replace("Bearer ", "")
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("favorites")
    .select("*, store:stores(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ favorites: data })
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const token = authHeader.replace("Bearer ", "")
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { store_id } = await request.json()
  if (!store_id) return NextResponse.json({ error: "store_id 為必填" }, { status: 400 })

  const { data, error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, store_id })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "已收藏" }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ favorite: data }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const token = authHeader.replace("Bearer ", "")
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { store_id } = await request.json()
  if (!store_id) return NextResponse.json({ error: "store_id 為必填" }, { status: 400 })

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("store_id", store_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

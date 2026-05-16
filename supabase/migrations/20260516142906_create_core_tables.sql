/*
  # 幹飯王核心資料表建立

  ## 說明
  建立幹飯王應用所需的核心資料表：

  1. 新增資料表
    - `profiles` - 用戶資料（與 auth.users 關聯）
      - `id` (uuid, 主鍵, 關聯 auth.users)
      - `username` (text)
      - `avatar_url` (text, 可為空)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `stores` - 店家資料
      - `id` (uuid, 主鍵)
      - `owner_id` (uuid, 關聯 profiles)
      - `name` (text, 店名)
      - `description` (text)
      - `address` (text)
      - `city` (text)
      - `district` (text)
      - `phone` (text, 可為空)
      - `category` (text: breakfast/lunch/dinner/all)
      - `price_min` (integer)
      - `price_max` (integer)
      - `rating` (numeric)
      - `image_url` (text, 可為空)
      - `tags` (text[])
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `meals` - 餐點資料
      - `id` (uuid, 主鍵)
      - `store_id` (uuid, 關聯 stores)
      - `name` (text)
      - `description` (text, 可為空)
      - `price` (integer)
      - `meal_type` (text: breakfast/lunch/dinner)
      - `image_url` (text, 可為空)
      - `is_available` (boolean)
      - `created_at` (timestamp)

    - `favorites` - 收藏資料
      - `id` (uuid, 主鍵)
      - `user_id` (uuid, 關聯 profiles)
      - `store_id` (uuid, 關聯 stores)
      - `created_at` (timestamp)
      - 唯一約束: (user_id, store_id)

  2. 安全性
    - 所有資料表啟用 RLS
    - profiles: 用戶只能讀/改自己的資料
    - stores: 公開可讀，只有擁有者可以新增/修改
    - meals: 公開可讀，只有店家擁有者可以新增/修改
    - favorites: 用戶只能操作自己的收藏

  3. 索引
    - stores: city, district, category 索引
    - favorites: user_id, store_id 索引
*/

-- Profiles 資料表
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Stores 資料表
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '台北市',
  district text NOT NULL DEFAULT '',
  phone text,
  category text NOT NULL DEFAULT 'all' CHECK (category IN ('breakfast', 'lunch', 'dinner', 'all')),
  price_min integer NOT NULL DEFAULT 0,
  price_max integer NOT NULL DEFAULT 999,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  image_url text,
  tags text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active stores"
  ON stores FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners can view own stores"
  ON stores FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert stores"
  ON stores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own stores"
  ON stores FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own stores"
  ON stores FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS stores_city_idx ON stores(city);
CREATE INDEX IF NOT EXISTS stores_district_idx ON stores(district);
CREATE INDEX IF NOT EXISTS stores_category_idx ON stores(category);
CREATE INDEX IF NOT EXISTS stores_owner_idx ON stores(owner_id);

-- Meals 資料表
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price integer NOT NULL DEFAULT 0,
  meal_type text NOT NULL DEFAULT 'lunch' CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available meals"
  ON meals FOR SELECT
  USING (is_available = true);

CREATE POLICY "Store owners can insert meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = meals.store_id
      AND stores.owner_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can update meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = meals.store_id
      AND stores.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = meals.store_id
      AND stores.owner_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can delete meals"
  ON meals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = meals.store_id
      AND stores.owner_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS meals_store_idx ON meals(store_id);
CREATE INDEX IF NOT EXISTS meals_type_idx ON meals(meal_type);

-- Favorites 資料表
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, store_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS favorites_user_idx ON favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_store_idx ON favorites(store_id);

-- 自動建立 profile 的觸發器
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 自動更新 updated_at 的函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

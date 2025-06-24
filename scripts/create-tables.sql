-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'standard')),
  farm_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create livestock table
CREATE TABLE IF NOT EXISTS livestock (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_number TEXT UNIQUE NOT NULL,
  animal_type TEXT NOT NULL CHECK (animal_type IN ('cattle', 'sheep', 'goat', 'pig', 'chicken', 'other')),
  breed TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  birth_date DATE NOT NULL,
  weight DECIMAL(8,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'sick', 'pregnant', 'sold', 'deceased')),
  purchase_price DECIMAL(10,2),
  purchase_date DATE,
  notes TEXT,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  livestock_id UUID REFERENCES livestock(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('vaccination', 'treatment', 'checkup', 'injury', 'illness', 'other')),
  date DATE NOT NULL,
  veterinarian TEXT,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  medication TEXT,
  cost DECIMAL(10,2),
  notes TEXT,
  next_appointment DATE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_livestock_owner ON livestock(owner_id);
CREATE INDEX IF NOT EXISTS idx_livestock_status ON livestock(status);
CREATE INDEX IF NOT EXISTS idx_health_records_livestock ON health_records(livestock_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(date);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Livestock: Users can only see and manage their own livestock
CREATE POLICY "Users can view own livestock" ON livestock
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own livestock" ON livestock
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own livestock" ON livestock
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own livestock" ON livestock
  FOR DELETE USING (auth.uid() = owner_id);

-- Health records: Users can only see and manage health records for their livestock
CREATE POLICY "Users can view health records for own livestock" ON health_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM livestock 
      WHERE livestock.id = health_records.livestock_id 
      AND livestock.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert health records for own livestock" ON health_records
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM livestock 
      WHERE livestock.id = health_records.livestock_id 
      AND livestock.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update health records for own livestock" ON health_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM livestock 
      WHERE livestock.id = health_records.livestock_id 
      AND livestock.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete health records for own livestock" ON health_records
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM livestock 
      WHERE livestock.id = health_records.livestock_id 
      AND livestock.owner_id = auth.uid()
    )
  );

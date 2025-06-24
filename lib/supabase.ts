import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface LivestockRecord {
  id: string
  tag_number: string
  animal_type: "cattle" | "sheep" | "goat" | "pig" | "chicken" | "other"
  breed: string
  gender: "male" | "female"
  birth_date: string
  weight: number
  status: "healthy" | "sick" | "pregnant" | "sold" | "deceased"
  purchase_price?: number
  purchase_date?: string
  notes?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface HealthRecord {
  id: string
  livestock_id: string
  record_type: "vaccination" | "treatment" | "checkup" | "injury" | "illness" | "other"
  date: string
  veterinarian?: string
  diagnosis: string
  treatment: string
  medication?: string
  cost?: number
  notes?: string
  next_appointment?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  username: string
  role: "admin" | "standard"
  farm_name?: string
  created_at: string
  updated_at: string
}

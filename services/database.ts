import type { LivestockRecord, HealthRecord, UserProfile } from "@/lib/supabase"
import { generateUUID } from "@/lib/utils"

// Mock database storage (in-memory for development)
let mockLivestock: LivestockRecord[] = []
let mockHealthRecords: HealthRecord[] = []
const mockUserProfiles: UserProfile[] = []

// Types for our data structures
// export interface LivestockRecord {
//   id: string
//   owner_id: string
//   tag_number: string
//   animal_type: string
//   breed: string
//   gender: string
//   birth_date: string
//   weight: number
//   status: string
//   notes?: string
//   created_at: string
//   updated_at: string
// }

// export interface HealthRecord {
//   id: string
//   livestock_id: string
//   created_by: string
//   date: string
//   type: string
//   description: string
//   treatment?: string
//   veterinarian?: string
//   cost?: number
//   next_checkup?: string
//   created_at: string
//   updated_at: string
// }

// export interface UserProfile {
//   id: string
//   email: string
//   username: string
//   role: "admin" | "standard"
//   farm_name?: string
//   created_at: string
//   updated_at: string
// }

// Initialize with some sample data
const initializeSampleData = () => {
  if (mockLivestock.length === 0) {
    const sampleUserId = generateUUID()

    // Add sample livestock
    mockLivestock = [
      {
        id: generateUUID(),
        owner_id: sampleUserId,
        tag_number: "COW001",
        animal_type: "cattle",
        breed: "Holstein",
        gender: "female",
        birth_date: "2022-03-15",
        weight: 450,
        status: "healthy",
        notes: "Good milk producer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: generateUUID(),
        owner_id: sampleUserId,
        tag_number: "GOAT001",
        animal_type: "goat",
        breed: "Boer",
        gender: "male",
        birth_date: "2023-01-20",
        weight: 65,
        status: "healthy",
        notes: "Breeding male",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: generateUUID(),
        owner_id: sampleUserId,
        tag_number: "SHEEP001",
        animal_type: "sheep",
        breed: "Merino",
        gender: "female",
        birth_date: "2022-09-10",
        weight: 55,
        status: "healthy",
        notes: "Good wool quality",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // Add sample health records
    mockHealthRecords = [
      {
        id: generateUUID(),
        livestock_id: mockLivestock[0].id,
        created_by: sampleUserId,
        date: "2024-01-15",
        type: "vaccination",
        description: "Annual vaccination",
        treatment: "FMD vaccine",
        veterinarian: "Dr. Smith",
        cost: 25,
        next_checkup: "2025-01-15",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }
}

// Livestock CRUD Operations
export const livestockService = {
  // Get all livestock for current user
  async getAll(userId: string): Promise<LivestockRecord[]> {
    try {
      console.log("Fetching livestock for user:", userId)

      // Initialize sample data if empty
      initializeSampleData()

      // For development, return all sample data regardless of user ID
      // In production, this would filter by actual user ID
      const userLivestock = mockLivestock.filter(
        (item) => item.owner_id === userId || mockLivestock.length <= 3, // Show sample data for any user
      )

      console.log("Found livestock:", userLivestock.length)
      return userLivestock.length > 0 ? userLivestock : mockLivestock
    } catch (error) {
      console.error("Error fetching livestock:", error)
      throw error
    }
  },

  // Get livestock by ID
  async getById(id: string): Promise<LivestockRecord | null> {
    try {
      initializeSampleData()
      const livestock = mockLivestock.find((item) => item.id === id)
      return livestock || null
    } catch (error) {
      console.error("Error fetching livestock by ID:", error)
      throw error
    }
  },

  // Create new livestock
  async create(livestock: Omit<LivestockRecord, "id" | "created_at" | "updated_at">): Promise<LivestockRecord> {
    try {
      const newLivestock: LivestockRecord = {
        ...livestock,
        id: generateUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockLivestock.push(newLivestock)
      console.log("Created new livestock:", newLivestock)
      return newLivestock
    } catch (error) {
      console.error("Error creating livestock:", error)
      throw error
    }
  },

  // Update livestock
  async update(id: string, updates: Partial<LivestockRecord>): Promise<LivestockRecord> {
    try {
      const index = mockLivestock.findIndex((item) => item.id === id)
      if (index === -1) {
        throw new Error("Livestock not found")
      }

      mockLivestock[index] = {
        ...mockLivestock[index],
        ...updates,
        updated_at: new Date().toISOString(),
      }

      console.log("Updated livestock:", mockLivestock[index])
      return mockLivestock[index]
    } catch (error) {
      console.error("Error updating livestock:", error)
      throw error
    }
  },

  // Delete livestock
  async delete(id: string): Promise<void> {
    try {
      const index = mockLivestock.findIndex((item) => item.id === id)
      if (index === -1) {
        throw new Error("Livestock not found")
      }

      mockLivestock.splice(index, 1)
      console.log("Deleted livestock with ID:", id)
    } catch (error) {
      console.error("Error deleting livestock:", error)
      throw error
    }
  },

  // Get livestock statistics
  async getStats(userId: string) {
    try {
      initializeSampleData()
      const userLivestock = await this.getAll(userId)

      const stats = {
        total: userLivestock.length,
        byType: {} as Record<string, number>,
        byStatus: {} as Record<string, number>,
        healthy: 0,
        sick: 0,
      }

      userLivestock.forEach((item) => {
        stats.byType[item.animal_type] = (stats.byType[item.animal_type] || 0) + 1
        stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1
        if (item.status === "healthy") stats.healthy++
        if (item.status === "sick") stats.sick++
      })

      return stats
    } catch (error) {
      console.error("Error fetching livestock stats:", error)
      throw error
    }
  },
}

// Health Records CRUD Operations
export const healthService = {
  // Get all health records
  async getAll(userId: string): Promise<HealthRecord[]> {
    try {
      initializeSampleData()
      const userRecords = mockHealthRecords.filter((record) => record.created_by === userId)
      return userRecords.length > 0 ? userRecords : mockHealthRecords
    } catch (error) {
      console.error("Error fetching health records:", error)
      throw error
    }
  },

  // Get health records by livestock ID
  async getByLivestockId(livestockId: string): Promise<HealthRecord[]> {
    try {
      initializeSampleData()
      return mockHealthRecords.filter((record) => record.livestock_id === livestockId)
    } catch (error) {
      console.error("Error fetching health records by livestock ID:", error)
      throw error
    }
  },

  // Create new health record
  async create(record: Omit<HealthRecord, "id" | "created_at" | "updated_at">): Promise<HealthRecord> {
    try {
      const newRecord: HealthRecord = {
        ...record,
        id: generateUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockHealthRecords.push(newRecord)
      console.log("Created new health record:", newRecord)
      return newRecord
    } catch (error) {
      console.error("Error creating health record:", error)
      throw error
    }
  },

  // Update health record
  async update(id: string, updates: Partial<HealthRecord>): Promise<HealthRecord> {
    try {
      const index = mockHealthRecords.findIndex((record) => record.id === id)
      if (index === -1) {
        throw new Error("Health record not found")
      }

      mockHealthRecords[index] = {
        ...mockHealthRecords[index],
        ...updates,
        updated_at: new Date().toISOString(),
      }

      console.log("Updated health record:", mockHealthRecords[index])
      return mockHealthRecords[index]
    } catch (error) {
      console.error("Error updating health record:", error)
      throw error
    }
  },

  // Delete health record
  async delete(id: string): Promise<void> {
    try {
      const index = mockHealthRecords.findIndex((record) => record.id === id)
      if (index === -1) {
        throw new Error("Health record not found")
      }

      mockHealthRecords.splice(index, 1)
      console.log("Deleted health record with ID:", id)
    } catch (error) {
      console.error("Error deleting health record:", error)
      throw error
    }
  },
}

// User Profile Operations
export const userService = {
  // Get user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profile = mockUserProfiles.find((p) => p.id === userId)
      return profile || null
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  },

  // Create user profile
  async createProfile(profile: Omit<UserProfile, "created_at" | "updated_at">): Promise<UserProfile> {
    try {
      const newProfile: UserProfile = {
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockUserProfiles.push(newProfile)
      console.log("Created user profile:", newProfile)
      return newProfile
    } catch (error) {
      console.error("Error creating user profile:", error)
      throw error
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const index = mockUserProfiles.findIndex((p) => p.id === userId)
      if (index === -1) {
        throw new Error("User profile not found")
      }

      mockUserProfiles[index] = {
        ...mockUserProfiles[index],
        ...updates,
        updated_at: new Date().toISOString(),
      }

      console.log("Updated user profile:", mockUserProfiles[index])
      return mockUserProfiles[index]
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  },
}

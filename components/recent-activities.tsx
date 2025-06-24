import { Activity, Calendar, MilkIcon as Cow, FileCheck, Stethoscope, Truck, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    id: 1,
    type: "health",
    description: "Vaccination completed for 12 cattle",
    timestamp: "Today, 10:30 AM",
    icon: Stethoscope,
  },
  {
    id: 2,
    type: "movement",
    description: "Moved 25 sheep to North Pasture",
    timestamp: "Today, 9:15 AM",
    icon: Truck,
  },
  {
    id: 3,
    type: "birth",
    description: "New calf born to cow #LV004",
    timestamp: "Yesterday, 11:45 PM",
    icon: Cow,
  },
  {
    id: 4,
    type: "inspection",
    description: "Completed monthly herd inspection",
    timestamp: "Yesterday, 2:30 PM",
    icon: FileCheck,
  },
  {
    id: 5,
    type: "staff",
    description: "Dr. Williams scheduled for health checks",
    timestamp: "Yesterday, 10:00 AM",
    icon: User,
  },
  {
    id: 6,
    type: "schedule",
    description: "Feed delivery scheduled for tomorrow",
    timestamp: "Yesterday, 9:30 AM",
    icon: Calendar,
  },
]

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recent Activities
        </CardTitle>
        <CardDescription>Latest events and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="relative mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <activity.icon className="h-6 w-6" />
                <span className="absolute right-0 top-0 flex h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock } from "lucide-react"

export function UpcomingTasks() {
  const { t } = useLanguage()

  const tasks = [
    {
      id: 1,
      title: "vaccinationTask",
      date: "may15",
      time: "9am",
      completed: false,
      assignedTo: "Dr. Huzaifa",
    },
    {
      id: 2,
      title: "feedDeliveryTask",
      date: "may16",
      time: "10am",
      completed: false,
      assignedTo: "Chenab Farms Staff",
    },
    {
      id: 3,
      title: "veterinarianVisitTask",
      date: "may18",
      time: "2pm",
      completed: false,
      assignedTo: "Dr. Hassan",
    },
    {
      id: 4,
      title: "livestockCountTask",
      date: "may20",
      time: "8am",
      completed: false,
      assignedTo: "Dr. Rauf",
    },
  ]

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start space-x-4 rounded-md border p-3">
          <Checkbox id={`task-${task.id}`} />
          <div className="flex-1 space-y-1">
            <label
              htmlFor={`task-${task.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t(task.title)}
            </label>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {t(task.date)}
              <Clock className="ml-2 mr-1 h-3 w-3" />
              {t(task.time)}
            </div>
            <div className="text-xs font-medium">{task.assignedTo}</div>
          </div>
        </div>
      ))}
      <Button size="sm" variant="outline" className="w-full">
        {t("viewAllTasks")}
      </Button>
    </div>
  )
}

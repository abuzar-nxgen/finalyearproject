"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Calendar, Phone, Mail, Award, Clock } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DoctorProps {
  name: string
  specialization: string
  education: string
  experience: string
  contact: string
  email: string
  schedule: {
    day: string
    hours: string
  }[]
}

function DoctorCard({ doctor }: { doctor: DoctorProps }) {
  const { t } = useLanguage()

  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-center bg-primary/10 p-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
        </Avatar>
      </div>
      <CardHeader>
        <CardTitle>{doctor.name}</CardTitle>
        <CardDescription>{doctor.specialization}</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="bg-primary/10">
            <Award className="mr-1 h-3 w-3" />
            {doctor.education}
          </Badge>
          <Badge variant="outline" className="bg-secondary/10">
            {doctor.experience}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">{t("schedule")}</h4>
          {doctor.schedule.map((slot, index) => (
            <div key={index} className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{slot.day}:</span>
              <span className="ml-2">{slot.hours}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex w-full items-center">
          <Phone className="mr-2 h-4 w-4 text-primary" />
          <span>{doctor.contact}</span>
        </div>
        <div className="flex w-full items-center">
          <Mail className="mr-2 h-4 w-4 text-primary" />
          <span className="text-sm">{doctor.email}</span>
        </div>
        <Button className="mt-2 w-full">
          <Calendar className="mr-2 h-4 w-4" />
          {t("scheduleAppointment")}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function VeterinaryStaff() {
  const { t } = useLanguage()

  const doctors = [
    {
      name: "Dr. Huzaifa",
      specialization: "Large Animal Medicine",
      education: "UVAS Lahore",
      experience: "8 years experience",
      contact: "3227064186",
      email: "dr.huzaifa@chenabfarms.com",
      schedule: [
        { day: "Monday - Wednesday", hours: "9:00 AM - 5:00 PM" },
        { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
      ],
    },
    {
      name: "Dr. Hassan",
      specialization: "Animal Nutrition & Breeding",
      education: "UVAS Lahore",
      experience: "6 years experience",
      contact: "3227064186",
      email: "dr.hassan@chenabfarms.com",
      schedule: [
        { day: "Tuesday - Thursday", hours: "8:00 AM - 4:00 PM" },
        { day: "Sunday", hours: "9:00 AM - 1:00 PM" },
      ],
    },
    {
      name: "Dr. Rauf",
      specialization: "Veterinary Surgery",
      education: "UVAS Lahore",
      experience: "10 years experience",
      contact: "3227064186",
      email: "dr.rauf@chenabfarms.com",
      schedule: [
        { day: "Wednesday - Friday", hours: "10:00 AM - 6:00 PM" },
        { day: "Saturday", hours: "2:00 PM - 6:00 PM" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("veterinaryTeam")}</h2>
        <p className="text-muted-foreground">{t("veterinaryTeamDescription")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} />
        ))}
      </div>

      <Card className="bg-primary/5 p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h3 className="text-xl font-bold">{t("emergencyServices")}</h3>
          <p>{t("emergencyServicesDescription")}</p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Phone className="h-4 w-4" />
              {t("callEmergency")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

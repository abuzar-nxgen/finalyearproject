"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const healthRecordsData = [
  {
    id: "HR001",
    livestockId: "LV001",
    type: "Vaccination",
    date: "2023-05-15",
    description: "Annual vaccination against BVD",
    performedBy: "Dr. Smith",
    status: "Completed",
  },
  {
    id: "HR002",
    livestockId: "LV003",
    type: "Pregnancy Check",
    date: "2023-06-22",
    description: "Confirmed pregnancy, estimated 2 months",
    performedBy: "Dr. Johnson",
    status: "Completed",
  },
  {
    id: "HR003",
    livestockId: "LV007",
    type: "Treatment",
    date: "2023-07-10",
    description: "Antibiotic treatment for respiratory infection",
    performedBy: "Dr. Williams",
    status: "In Progress",
  },
  {
    id: "HR004",
    livestockId: "LV002",
    type: "Deworming",
    date: "2023-07-05",
    description: "Routine deworming treatment",
    performedBy: "Farm Staff",
    status: "Completed",
  },
  {
    id: "HR005",
    livestockId: "LV004",
    type: "Hoof Trimming",
    date: "2023-06-30",
    description: "Routine hoof maintenance",
    performedBy: "Farm Staff",
    status: "Completed",
  },
  {
    id: "HR006",
    livestockId: "LV001",
    type: "Health Check",
    date: "2023-07-15",
    description: "Routine health examination",
    performedBy: "Dr. Smith",
    status: "Scheduled",
  },
  {
    id: "HR007",
    livestockId: "LV005",
    type: "Vaccination",
    date: "2023-07-08",
    description: "Vaccination against enterotoxemia",
    performedBy: "Dr. Johnson",
    status: "Completed",
  },
]

export function HealthRecordsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [date, setDate] = useState(null)

  const filteredData = healthRecordsData.filter((record) => {
    const matchesSearch = Object.values(record).some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "all" || record.type === selectedType
    const matchesDate = !date || record.date === date
    return matchesSearch && matchesType && matchesDate
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search health records..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Vaccination">Vaccination</SelectItem>
            <SelectItem value="Treatment">Treatment</SelectItem>
            <SelectItem value="Health Check">Health Check</SelectItem>
            <SelectItem value="Pregnancy Check">Pregnancy Check</SelectItem>
            <SelectItem value="Deworming">Deworming</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-[180px] justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {date ? date : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center">
                  ID
                  <Button variant="ghost" size="sm" className="ml-1 h-8 p-0">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Livestock ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.id}</TableCell>
                <TableCell>{record.livestockId}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>{record.performedBy}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      record.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : record.status === "In Progress"
                          ? "bg-amber-100 text-amber-800"
                          : record.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record.status}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit record</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                      <DropdownMenuItem>Add follow-up</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete record</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

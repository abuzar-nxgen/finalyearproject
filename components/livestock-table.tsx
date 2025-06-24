"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const livestockData = [
  {
    id: "LV001",
    type: "Cattle",
    breed: "Angus",
    gender: "Female",
    birthDate: "2021-05-12",
    weight: "650 kg",
    status: "Healthy",
  },
  {
    id: "LV002",
    type: "Cattle",
    breed: "Hereford",
    gender: "Male",
    birthDate: "2020-11-23",
    weight: "820 kg",
    status: "Healthy",
  },
  {
    id: "LV003",
    type: "Sheep",
    breed: "Merino",
    gender: "Female",
    birthDate: "2022-02-15",
    weight: "65 kg",
    status: "Pregnant",
  },
  {
    id: "LV004",
    type: "Cattle",
    breed: "Holstein",
    gender: "Female",
    birthDate: "2019-08-30",
    weight: "720 kg",
    status: "Lactating",
  },
  {
    id: "LV005",
    type: "Goat",
    breed: "Boer",
    gender: "Male",
    birthDate: "2022-01-10",
    weight: "70 kg",
    status: "Healthy",
  },
  {
    id: "LV006",
    type: "Pig",
    breed: "Duroc",
    gender: "Female",
    birthDate: "2022-04-05",
    weight: "110 kg",
    status: "Healthy",
  },
  {
    id: "LV007",
    type: "Cattle",
    breed: "Angus",
    gender: "Male",
    birthDate: "2020-12-18",
    weight: "780 kg",
    status: "Treatment",
  },
  {
    id: "LV008",
    type: "Sheep",
    breed: "Suffolk",
    gender: "Female",
    birthDate: "2021-09-22",
    weight: "72 kg",
    status: "Healthy",
  },
]

export function LivestockTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const filteredData = livestockData.filter((animal) => {
    const matchesSearch = Object.values(animal).some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "all" || animal.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search livestock..."
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
            <SelectItem value="Cattle">Cattle</SelectItem>
            <SelectItem value="Sheep">Sheep</SelectItem>
            <SelectItem value="Goat">Goat</SelectItem>
            <SelectItem value="Pig">Pig</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  ID
                  <Button variant="ghost" size="sm" className="ml-1 h-8 p-0">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{animal.id}</TableCell>
                <TableCell>{animal.type}</TableCell>
                <TableCell>{animal.breed}</TableCell>
                <TableCell>{animal.gender}</TableCell>
                <TableCell>{animal.birthDate}</TableCell>
                <TableCell>{animal.weight}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      animal.status === "Healthy"
                        ? "bg-green-100 text-green-800"
                        : animal.status === "Treatment"
                          ? "bg-red-100 text-red-800"
                          : animal.status === "Pregnant" || animal.status === "Lactating"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {animal.status}
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
                      <DropdownMenuItem>Add health record</DropdownMenuItem>
                      <DropdownMenuItem>Track weight</DropdownMenuItem>
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

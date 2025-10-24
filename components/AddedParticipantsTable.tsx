'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AddedParticipantsTableProps {
  entries: any[]
  onEdit: (index: number) => void
  onRemove: (index: number) => void
}

export const AddedParticipantsTable: React.FC<AddedParticipantsTableProps> = ({
  entries,
  onEdit,
  onRemove,
}) => {
  if (entries.length === 0) {
    return null
  }

  return (
    <Card className="p-6 border-2 border-orange-300 bg-white shadow-md rounded-lg mb-8">
      <h2 className="text-2xl font-bold text-orange-800 mb-6">Added Entries</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-orange-50">
            <TableHead className="text-orange-900">Full Name</TableHead>
            <TableHead className="text-orange-900">Age</TableHead>
            <TableHead className="text-orange-900">Counselor Name</TableHead>
            <TableHead className="text-orange-900">First Meal</TableHead>
            <TableHead className="text-orange-900">Last Meal</TableHead>
            <TableHead className="text-orange-900">Camp Name</TableHead>
            <TableHead className="text-orange-900">Stay</TableHead>
            <TableHead className="text-orange-900">Cost</TableHead>
            <TableHead className="text-orange-900">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow key={index} className="border-orange-200">
              <TableCell className="font-medium text-orange-800">{entry.participantName}</TableCell>
              <TableCell className="text-orange-800">{entry.age}</TableCell>
              <TableCell className="text-orange-800">{entry.counselorName}</TableCell>
              <TableCell className="text-orange-800">{entry.firstMealDate} - {entry.firstMealType}</TableCell>
              <TableCell className="text-orange-800">{entry.lastMealDate} - {entry.lastMealType}</TableCell>
              <TableCell className="text-orange-800">{entry.campName}</TableCell>
              <TableCell className="text-orange-800">{entry.accommodation}</TableCell>
              <TableCell className="text-orange-700">₹{entry.entryCost || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(index)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

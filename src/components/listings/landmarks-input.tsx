
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import type { Landmarks } from "@/services/listings-service"

interface LandmarksInputProps {
  value: Landmarks[]
  onChange: (landmarks: Landmarks[]) => void
  label?: string
}

const landmarkCategories = [
  "School",
  "Hospital",
  "Shopping",
  "Restaurant",
  "Bank",
  "Gas Station",
  "Park",
  "Estate",
  "Transportation",
  "Entertainment",
  "Other",
]

export function LandmarksInput({ value, onChange, label = "Landmarks" }: LandmarksInputProps) {
  const [newLandmark, setNewLandmark] = useState<Landmarks>({
    name: "",
    category: "",
    proximityToLocation: 0,
  })

  const addLandmark = () => {
    if (newLandmark.name && newLandmark.category && newLandmark.proximityToLocation > 0) {
      onChange([...value, newLandmark])
      setNewLandmark({
        name: "",
        category: "",
        proximityToLocation: 0,
      })
    }
  }

  const removeLandmark = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>

      {/* Existing landmarks */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((landmark, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex-1">
                <div className="font-medium">{landmark.name}</div>
                <div className="text-sm text-gray-500">
                  {landmark.category} • {landmark.proximityToLocation}km away
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeLandmark(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add new landmark */}
      <div className="border rounded-md p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-gray-500">Landmark Name</Label>
            <Input
              placeholder="e.g., Sunlight Estate"
              value={newLandmark.name}
              onChange={(e) => setNewLandmark((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Category</Label>
            <Select
              value={newLandmark.category}
              onValueChange={(value) => setNewLandmark((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {landmarkCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Distance (km)</Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              step="0.1"
              value={newLandmark.proximityToLocation || ""}
              onChange={(e) =>
                setNewLandmark((prev) => ({ ...prev, proximityToLocation: Number.parseFloat(e.target.value) || 0 }))
              }
            />
          </div>
        </div>
        <Button type="button" onClick={addLandmark} size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Landmark
        </Button>
      </div>
    </div>
  )
}

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"
import type { PropertyDetail } from "@/services/listings-service"

interface PropertyDetailsInputProps {
  value: PropertyDetail[]
  onChange: (details: PropertyDetail[]) => void
  label?: string
}

const commonPropertyDetails = [
  { name: "bedrooms", type: "number" },
  { name: "bathrooms", type: "number" },
  { name: "garage", type: "boolean" },
  { name: "parking", type: "boolean" },
  { name: "swimming_pool", type: "boolean" },
  { name: "garden", type: "boolean" },
  { name: "balcony", type: "boolean" },
  { name: "furnished", type: "boolean" },
  { name: "air_conditioning", type: "boolean" },
  { name: "security", type: "boolean" },
  { name: "elevator", type: "boolean" },
  { name: "gym", type: "boolean" },
]

export function PropertyDetailsInput({ value, onChange, label = "Property Details" }: PropertyDetailsInputProps) {
  const [newDetail, setNewDetail] = useState<{
    name: string
    type: "string" | "number" | "boolean"
    value: string | number | boolean
  }>({
    name: "",
    type: "string",
    value: "",
  })

  const generateId = () => `PREF-${Math.random().toString(36).substr(2, 12)}`

  const addDetail = () => {
    if (newDetail.name && newDetail.value !== "") {
      const detail: PropertyDetail = {
        id: generateId(),
        name: newDetail.name,
        value: newDetail.value,
      }
      onChange([...value, detail])
      setNewDetail({
        name: "",
        type: "string",
        value: "",
      })
    }
  }

  const removeDetail = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const addCommonDetail = (detailName: string, detailType: string) => {
    const existingDetail = value.find((detail) => detail.name === detailName)
    if (existingDetail) return

    let defaultValue: string | number | boolean = ""
    if (detailType === "number") defaultValue = ""
    if (detailType === "boolean") defaultValue = false

    const detail: PropertyDetail = {
      id: generateId(),
      name: detailName,
      value: defaultValue,
    }
    onChange([...value, detail])
  }

  const updateDetailValue = (index: number, newValue: string | number | boolean) => {
    const updatedDetails = [...value]
    updatedDetails[index].value = newValue
    onChange(updatedDetails)
  }

  const renderValueInput = (detail: PropertyDetail, index: number) => {
    if (typeof detail.value === "boolean") {
      return (
        <Switch
          checked={detail.value}
          onCheckedChange={(checked) => updateDetailValue(index, checked)}
          className="ml-auto"
        />
      )
    }

    
    const isNumberType = commonPropertyDetails.find(d => d.name === detail.name)?.type === "number"
    
    if (isNumberType || typeof detail.value === "number") {
      return (
        <Input
          type="number"
          step="any"
          value={detail.value}
          onChange={(e) => {
            const inputValue = e.target.value
            if (inputValue === "") {
              updateDetailValue(index, "")
            } else {
              const numValue = parseFloat(inputValue)
              updateDetailValue(index, isNaN(numValue) ? inputValue : numValue)
            }
          }}
          className="w-24"
        />
      )
    }

    return (
      <Input
        value={detail.value as string}
        onChange={(e) => updateDetailValue(index, e.target.value)}
        className="w-32"
      />
    )
  }

  
  return (
    <div className="space-y-4 ">
      <Label className="text-sm font-medium">{label}</Label>

     
      <div>
        <Label className="text-xs text-gray-500 mb-2 block">Quick Add Common Details</Label>
        <div className="flex flex-wrap gap-2">
          {commonPropertyDetails.map((detail) => (
            <Button
              key={detail.name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addCommonDetail(detail.name, detail.type)}
              disabled={value.some((d) => d.name === detail.name)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {detail.name.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((detail, index) => (
            <div key={detail.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <span className="font-medium capitalize">{detail.name.replace("_", " ")}</span>
                {renderValueInput(detail, index)}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeDetail(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add custom detail */}
      <div className="border rounded-md p-4 space-y-3">
        <Label className="text-sm">Add Custom Detail</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs text-gray-500">Name</Label>
            <Input
              placeholder="e.g., floor_number"
              value={newDetail.name}
              onChange={(e) => setNewDetail((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Type</Label>
            <Select
              value={newDetail.type}
              onValueChange={(value: "string" | "number" | "boolean") =>
                setNewDetail((prev) => ({ ...prev, type: value, value: value === "boolean" ? false : "" }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Yes/No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Value</Label>
            {newDetail.type === "boolean" ? (
              <div className="flex items-center h-10">
                <Switch
                  checked={newDetail.value as boolean}
                  onCheckedChange={(checked) => setNewDetail((prev) => ({ ...prev, value: checked }))}
                />
              </div>
            ) : (
              <Input
                type={newDetail.type === "number" ? "number" : "text"}
                step={newDetail.type === "number" ? "any" : undefined}
                placeholder={newDetail.type === "number" ? "Enter number" : "Enter value"}
                value={newDetail.value as string | number}
                onChange={(e) =>
                  setNewDetail((prev) => ({
                    ...prev,
                    value: newDetail.type === "number" ? 
                      (e.target.value === "" ? "" : parseFloat(e.target.value) || e.target.value) : 
                      e.target.value,
                  }))
                }
              />
            )}
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={addDetail} size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
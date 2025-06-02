
import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CreateReviewDTO } from "@/types/review"

interface ReviewFormProps {
  onSubmit: (data: CreateReviewDTO) => void
  onCancel: () => void
  isLoading: boolean
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<CreateReviewDTO>({
    title: "",
    content: "",
    rating: 3,
    testifierName: "",
    testifierOccupation: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.content.trim()) {
      newErrors.content = "Review content is required"
    }

    if (!formData.testifierName.trim()) {
      newErrors.testifierName = "Testifier name is required"
    }

    if (!formData.testifierOccupation.trim()) {
      newErrors.testifierOccupation = "Testifier occupation is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Add review</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block mb-2 font-medium">
              Testifier name <span className="text-red-500">*</span>
            </label>
            <Input
              name="testifierName"
              value={formData.testifierName}
              onChange={handleInputChange}
              placeholder="Enter name"
              className={cn(errors.testifierName && "border-red-500")}
            />
            {errors.testifierName && <p className="text-red-500 text-sm mt-1">{errors.testifierName}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Testifier occupation <span className="text-red-500">*</span>
            </label>
            <Input
              name="testifierOccupation"
              value={formData.testifierOccupation}
              onChange={handleInputChange}
              placeholder="Enter occupation"
              className={cn(errors.testifierOccupation && "border-red-500")}
            />
            {errors.testifierOccupation && <p className="text-red-500 text-sm mt-1">{errors.testifierOccupation}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Review title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter review title (optional)"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Review content <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Enter review content..."
            className={cn("min-h-[150px]", errors.content && "border-red-500")}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-6 h-6 cursor-pointer",
                    star <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                  )}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
            <span className="ml-2 text-yellow-500 font-medium">{formData.rating} Star</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 border rounded-md" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-md" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add review"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm

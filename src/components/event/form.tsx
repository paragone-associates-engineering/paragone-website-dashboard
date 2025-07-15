import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Upload } from "lucide-react";
import type { Event, CreateEventDTO, EventType } from "@/types/event";

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: CreateEventDTO) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const EventForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: EventFormProps) => {
  const [formData, setFormData] = useState<CreateEventDTO>({
    title: "",
    summary: "",
    link: "",
    expirationDate: "",
    isPaid: false,
    eventType: "inPerson" as EventType,
    location: "",
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        summary: initialData.summary,
        link: initialData.link,
        expirationDate: initialData.expirationDate.split("T")[0],
        isPaid: initialData.isPaid,
        eventType: initialData.eventType,
        price: initialData.price,
        location: initialData.location || "",
      });

      if (initialData.image) {
        if (Array.isArray(initialData.image)) {
          setExistingImages(initialData.image);
        } else if (typeof initialData.image === "string") {
          setExistingImages([initialData.image]);
        }
      }
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePriceChange = (
    type: "inPerson" | "virtual",
    field: "amount" | "currency",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [type]: {
          ...prev.price?.[type],
          [field]: field === "amount" ? Number(value) : value,
        },
      },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (!formData.link.trim()) newErrors.link = "Link is required";
    if (!formData.expirationDate)
      newErrors.expirationDate = "Expiration date is required";

    if (
      formData.expirationDate &&
      new Date(formData.expirationDate) <= new Date()
    ) {
      newErrors.expirationDate = "Expiration date must be in the future";
    }
    if (!formData.eventType) {
      newErrors.eventType = "Please select an event type";
    }

    if (formData.eventType === "inPerson" && !formData.location?.trim()) {
      newErrors.location = "Location is required for in-person events";
    }

    if (formData.isPaid) {
      if (
        !formData.price?.inPerson?.amount &&
        !formData.price?.virtual?.amount
      ) {
        newErrors.price = "At least one price must be set for paid events";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        ...formData,
        image: selectedImages.length > 0 ? selectedImages : undefined,

        //existingImages: existingImages.length > 0 ? existingImages : undefined,
      };
      onSubmit(submitData);
    }
  };

  const hasImages = existingImages.length > 0 || selectedImages.length > 0;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Event" : "Create New Event"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value) =>
                  handleSelectChange("eventType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inPerson">In Person</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.eventType && (
                <p className="text-sm text-red-500">{errors.eventType}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Event Summary *</Label>
            <Textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Enter event summary"
              rows={4}
            />
            {errors.summary && (
              <p className="text-sm text-red-500">{errors.summary}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link">Event Link *</Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com/event"
              />
              {errors.link && (
                <p className="text-sm text-red-500">{errors.link}</p>
              )}
            </div>

           <div className="space-y-2">
  <Label htmlFor="expirationDate">Expiration Date & Time *</Label>
  <Input
    id="expirationDate"
    name="expirationDate"
    type="datetime-local"
    value={formData.expirationDate}
    onChange={handleInputChange}
  />
  {errors.expirationDate && (
    <p className="text-sm text-red-500">{errors.expirationDate}</p>
  )}
</div>
          </div>

          {(formData.eventType === "inPerson" ||
          formData.eventType === "virtual" ||
            formData.eventType === "hybrid") && (
            <div className="space-y-2">
              <Label htmlFor="location">
                Location {formData.eventType === "inPerson" ? "*" : ""}
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>
          )}

          
          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                id="image"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload images
                </span>
              </label>
            </div>

            {hasImages && (
              <div className="space-y-4">
                {existingImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Current Images:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Existing ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

               
                {selectedImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      New Images:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isPaid"
                checked={formData.isPaid}
                onCheckedChange={(checked) =>
                  handleSwitchChange("isPaid", checked)
                }
              />
              <Label htmlFor="isPaid">This is a paid event</Label>
            </div>

            {formData.isPaid && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Event Pricing</h4>

                {(formData.eventType === "inPerson" ||
                  formData.eventType === "hybrid") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>In-Person Price</Label>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={formData.price?.inPerson?.amount || ""}
                        onChange={(e) =>
                          handlePriceChange(
                            "inPerson",
                            "amount",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Input
                        placeholder="NGN"
                        value={formData.price?.inPerson?.currency || "NGN"}
                        onChange={(e) =>
                          handlePriceChange(
                            "inPerson",
                            "currency",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {(formData.eventType === "virtual" ||
                  formData.eventType === "hybrid") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Virtual Price</Label>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={formData.price?.virtual?.amount || ""}
                        onChange={(e) =>
                          handlePriceChange("virtual", "amount", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Input
                        placeholder="NGN"
                        value={formData.price?.virtual?.currency || "NGN"}
                        onChange={(e) =>
                          handlePriceChange(
                            "virtual",
                            "currency",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>
            )}
          </div>


          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : initialData
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

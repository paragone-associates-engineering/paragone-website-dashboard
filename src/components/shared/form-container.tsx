
import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface FormContainerProps {
  title: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  className?: string
}

export function FormContainer({
  title,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false,
  className = "",
}: FormContainerProps) {
  return (
    <Card className={`bg-white rounded-lg border ${className}`}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className="p-6">{children}</div>
        <div className="flex justify-end gap-2 p-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600" disabled={isLoading}>
            {isLoading ? "Processing..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  )
}

interface FormSectionProps {
  title?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
}

export function FormSection({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
  className = "",
}: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <div
          className={`flex items-center justify-between mb-4 ${collapsible ? "cursor-pointer" : ""}`}
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        >
          <h3 className="text-lg font-medium">{title}</h3>
          {collapsible && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Button>
          )}
        </div>
      )}
      {(!collapsible || isOpen) && <div className="space-y-4">{children}</div>}
    </div>
  )
}

interface FormRowProps {
  children: React.ReactNode
  className?: string
}

export function FormRow({ children, className = "" }: FormRowProps) {
  return <div className={`!w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>{children}</div>
}

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string
  className?: string
}

export function FormField({ label, required = false, children, error, className = "" }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface FormImageUploadProps {
  label: string
  required?: boolean
  onChange: (file: File | null) => void
  value?: string | null
  error?: string
  className?: string
}

export function FormImageUpload({
  label,
  required = false,
  onChange,
  value,
  error,
  className = "",
}: FormImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] || null
    onChange(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <FormField label={label} required={required} error={error} className={className}>
      <div
        className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {value ? (
          <div className="relative w-full h-40">
            <img src={value || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="31" viewBox="0 0 48 31" fill="none">
  <path d="M36.5112 8.67762C35.8488 8.67762 35.2008 8.73723 34.5696 8.83977C32.9952 3.72477 28.1184 0 22.3416 0C15.288 0 9.5736 5.55139 9.5736 12.3976C9.5736 13.0081 9.6216 13.609 9.7104 14.2004C9.36882 14.1584 9.02499 14.1369 8.6808 14.136C3.8856 14.136 0 17.9085 0 22.5656C0 27.2228 3.8856 31 8.6808 31H19.2V21.4615H13.2L24 9.53846L34.8 21.4615H28.8V31H36.5112C42.8544 31 48 26.0018 48 19.84C48 13.6734 42.8544 8.67762 36.5112 8.67762Z" fill="#0F9E37"/>
</svg>
            <p className="text-sm text-gray-500 mt-2">Upload or drag your image here</p>
          </>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>
    </FormField>
  )
}

interface FormTagsInputProps {
  label: string
  required?: boolean
  onChange: (tags: string[]) => void
  value: string[]
  suggestions?: string[]
  error?: string
  className?: string
}

export function FormTagsInput({
  label,
  required = false,
  onChange,
  value,
  suggestions = [],
  error,
  className = "",
}: FormTagsInputProps) {
  const [inputValue, setInputValue] = React.useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  const addSuggestion = (suggestion: string) => {
    if (!value.includes(suggestion)) {
      onChange([...value, suggestion])
    }
  }

  return (
    <FormField label={label} required={required} error={error} className={className}>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 p-2 border rounded-md">
          {value.map((tag) => (
            <div key={tag} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
              <span>{tag}</span>
              <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[120px] outline-none"
            placeholder="Type and press Enter"
          />
        </div>
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions
              .filter((suggestion) => !value.includes(suggestion))
              .map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addSuggestion(suggestion)}
                  className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-sm"
                >
                  {suggestion}
                </button>
              ))}
          </div>
        )}
      </div>
    </FormField>
  )
}

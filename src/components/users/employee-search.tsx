
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getEmployees } from "@/services/employee-service"
import type { Employee } from "@/types/employee"

interface EmployeeSearchProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function EmployeeSearch({
  value,
  onChange,
  disabled = false,
  placeholder = "Search employees...",
}: EmployeeSearchProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["employees", searchQuery],
    queryFn: () => getEmployees(1, 100, searchQuery),
    staleTime: 60000, 
  })

  useEffect(() => {
    if (value && data?.results) {
      const found = data.results.find((employee) => employee.id === value)
      if (found) {
        setSelectedEmployee(found)
      }
    }
  }, [value, data?.results])

  const handleSelect = (employeeId: string) => {
    const selected = data?.results.find((employee) => employee.id === employeeId) || null
    setSelectedEmployee(selected)
    onChange(employeeId)
    setOpen(false)
  }

  const clearSelection = () => {
    setSelectedEmployee(null)
    onChange("")
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedEmployee ? (
              <span>
                {selectedEmployee.firstName} {selectedEmployee.lastName} ({selectedEmployee.email})
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search employees..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Loading employees...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty>No employees found.</CommandEmpty>
                  <CommandGroup>
                    {data?.results.map((employee) => (
                      <CommandItem key={employee.id} value={employee.id} onSelect={() => handleSelect(employee.id!)}>
                        <Check className={cn("mr-2 h-4 w-4", value === employee.id ? "opacity-100" : "opacity-0")} />
                        {employee.firstName} {employee.lastName} ({employee.email})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedEmployee && !disabled && (
        <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={clearSelection}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

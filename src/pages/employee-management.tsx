import type React from "react"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { getEmployee, addEmployee, updateEmployee, deleteEmployee } from "@/services/employee-service"
import type { Employee, EmployeeFormData } from "@/types/employee"
import EmployeeList from "@/components/employees/list"
import EmployeeForm from "@/components/employees/form"
import EmployeeProfile from "@/components/employees/profile"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const EmployeeManagement = () => {
  const queryClient = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null)
  const [viewEmployeeId, setViewEmployeeId] = useState<string | null>(null)
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    designation: "",
    role: "",
    type: "",
  })

  // Fetch single employee for editing
  // const { data: editEmployee, isLoading: isLoadingEditEmployee } = useQuery({
  //   queryKey: ["employee", editEmployeeId],
  //   queryFn: () => (editEmployeeId ? getEmployee(editEmployeeId) : null),
  //   enabled: !!editEmployeeId,
  //   onSuccess: (data) => {
  //     if (data) {
  //       setFormData({
  //         firstName: data.firstName,
  //         lastName: data.lastName,
  //         phoneNumber: data.phoneNumber || "",
  //         email: data.email,
  //         designation: data.designation,
  //         role: data.role,
  //         type: data.type,
  //       })
  //     }
  //   },
  // })

  // Fetch single employee for viewing
  const { data: viewEmployee, isLoading: isLoadingViewEmployee } = useQuery({
    queryKey: ["employee-view", viewEmployeeId],
    queryFn: () => (viewEmployeeId ? getEmployee(viewEmployeeId) : null),
    enabled: !!viewEmployeeId,
  })

  // Add employee mutation
  const addEmployeeMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      setShowAddForm(false)
      resetForm()
      toast.success("Employee added successfully")
    },
    onError: (error) => {
      toast.error("Failed to add employee. Please try again.")
      console.error("Add employee error:", error)
    },
  })

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      closeEditModal()
      toast.success("Employee updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update employee. Please try again.")
      console.error("Update employee error:", error)
    },
  })

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      toast.success("Employee deleted successfully")
    },
    onError: (error) => {
      toast.error("Failed to delete employee. Please try again.")
      console.error("Delete employee error:", error)
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editEmployeeId) {
      updateEmployeeMutation.mutate({
        id: editEmployeeId,
        data: formData,
      })
    } else {
      addEmployeeMutation.mutate(formData as Employee)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployeeMutation.mutate(id)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      designation: "",
      role: "",
      type: "",
    })
  }

  const handleAddEmployee = () => {
    setEditEmployeeId(null)
    resetForm()
    setShowAddForm(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    if (employee.id) {
      // Reset form before setting new data to avoid stale state
      resetForm()
      setEditEmployeeId(employee.id)

      // Manually set form data
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        phoneNumber: employee.phoneNumber || "",
        email: employee.email,
        designation: employee.designation,
        role: employee.role,
        type: employee.type,
      })

      // Open the edit modal
      setShowEditModal(true)
    }
  }

  const handleViewEmployee = (employee: Employee) => {
    if (employee.id) {
      setViewEmployeeId(employee.id)
      setShowViewModal(true)
    }
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditEmployeeId(null)
    resetForm()
    queryClient.invalidateQueries({ queryKey: ["employees"] })
  }

  const closeViewModal = () => {
    setShowViewModal(false)
    setViewEmployeeId(null)
    queryClient.invalidateQueries({ queryKey: ["employees"] })
  }

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      resetForm()
      setEditEmployeeId(null)
      setViewEmployeeId(null)
    }
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showEditModal || showViewModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showEditModal, showViewModal])

  return (
    <div className="p-3 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
      </div>

      <EmployeeList
        onAddEmployee={handleAddEmployee}
        onEditEmployee={handleEditEmployee}
        onViewEmployee={handleViewEmployee}
        onDeleteEmployee={handleDelete}
      />

      {/* Add Employee Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Add employee</h2>
          </div>

          <div className="p-6">
            <EmployeeForm
              formData={formData}
              isLoading={addEmployeeMutation.isPending}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowAddForm(false)
                resetForm()
                queryClient.invalidateQueries({ queryKey: ["employees"] })
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-2 lg:mx-0">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Edit Employee</h2>
              <Button variant="ghost" size="icon" onClick={closeEditModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <EmployeeForm
                formData={formData}
                isLoading={updateEmployeeMutation.isPending }
                isEdit={true}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleSubmit}
                onCancel={closeEditModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Employee Profile</h2>
              <Button variant="ghost" size="icon" onClick={closeViewModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <EmployeeProfile employee={viewEmployee} isLoading={isLoadingViewEmployee} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeManagement

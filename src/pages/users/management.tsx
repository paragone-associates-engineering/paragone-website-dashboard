/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { addUser, updateUser, deleteUser } from "@/services/user-service"
import { getEmployees } from "@/services/employee-service"
import UserList from "@/components/users/list"
import UserForm from "@/components/users/form"
import UserProfile from "@/components/users/profile"
import { useNavigate } from "react-router-dom"
//import UnauthorizedPage from "@/pages/auth/unauthorized"
import { Modal } from "@/components/ui/modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { User, Permission } from "@/types/user"

const UserManagementPage = () => {
  const { hasPermission } = useAuth()
  const queryClient = useQueryClient()
const navigate = useNavigate()
 
  const isAdmin = hasPermission("user", "view")

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

 
  const { data: selectedUserData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => (selectedUserId ? getEmployees(Number(selectedUserId)) : null),
    enabled: !!selectedUserId,
  })

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      toast.success("User added successfully")
      setShowAddModal(false)
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error: any) => {
      toast.error(`Failed to add user: ${error.message}`)
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { employeeId: string; permissions: Permission[] } }) =>
      updateUser(userId, data),
    onSuccess: () => {
      toast.success("User updated successfully")
      setShowEditModal(false)
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user", selectedUserId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`)
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully")
      setShowDeleteDialog(false)
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`)
    },
  })

  const handleAddUser = () => {
    setShowAddModal(true)
  }

  const handleViewUser = (user: User) => {
    setSelectedUserId(user.id)
    setShowViewModal(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUserId(user.id)
    setShowEditModal(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUserId(user.id)
    setShowDeleteDialog(true)
  }

  const handleAddSubmit = (data: { employeeId: string; permissions: Permission[] }) => {
    addUserMutation.mutate(data)
  }

  const handleEditSubmit = (data: { employeeId: string; permissions: Permission[] }) => {
    if (selectedUserId) {
      updateUserMutation.mutate({ userId: selectedUserId, data })
    }
  }

  const confirmDelete = () => {
    if (selectedUserId) {
      deleteUserMutation.mutate(selectedUserId)
    }
  }

 
  if (!isAdmin) {
    navigate('/unauthorized')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-gray-500">Manage system users and their permissions</p>
      </div>

      <UserList
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onAddUser={handleAddUser}
      />

     
      <Modal title="Add New User" isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <UserForm
          isLoading={addUserMutation.isPending}
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

     
      <Modal title="Edit User" isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <UserForm
          user={selectedUserData || undefined}
          isLoading={updateUserMutation.isPending || isLoadingUser}
          onSubmit={handleEditSubmit}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

   
      <Modal title="User Profile" isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
        <UserProfile
          user={selectedUserData}
          isLoading={isLoadingUser}
          onClose={() => setShowViewModal(false)}
          onEdit={() => {
            setShowViewModal(false)
            setShowEditModal(true)
          }}
        />
      </Modal>

      {/* <Modal title="Delete User" isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <div className="p-4">
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div> */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserManagementPage


import { Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import type { Viewing } from "@/services/viewings-service"

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  viewing: Viewing | null
  onConfirm: () => void
  isLoading: boolean
}

export function DeleteConfirmation({ isOpen, onClose, viewing, onConfirm, isLoading }: DeleteConfirmationProps) {
  if (!viewing) return null

  return (
   <Modal isOpen={isOpen} title='Delete Viewing' onClose={onClose}>
         <div className='p-5'>
        
         <h2 className='text-xl font-bold mb-3'>Are you sure?</h2>
         
            This will deactivate the viewing for{" "}
            <span className="font-semibold">
              {viewing.name.first} {viewing.name.lastName}
            </span>{" "}
            at <span className="font-semibold">{viewing.propertyDetails.propertyName}</span>. This action cannot be
            undone.
         
       
         <div className='flex items-center justify-end gap-4 mt-4'>
          <Button disabled={isLoading} >Cancel</Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}


import { Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"

import type { Listing } from "@/services/listings-service"

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  listing: Listing | null
  onConfirm: () => void
  isLoading: boolean
}

export function DeleteConfirmation({ isOpen, onClose, listing, onConfirm, isLoading }: DeleteConfirmationProps) {
  if (!listing) return null

  return (
   <Modal isOpen={isOpen} title='Delete Request' onClose={onClose}>
         <div className='p-5'>
           <div>
             <h2 className='text-xl font-bold mb-3'>Are you sure?</h2>
          <div>
             This will deactivate the property listing <span className="font-semibold">"{listing.propertyName}"</span>.
            This action can be reversed by changing the status back to active.
          </div>
        </div>
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

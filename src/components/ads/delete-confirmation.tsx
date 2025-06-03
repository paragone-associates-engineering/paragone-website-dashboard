
import { Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"

import type { Ad } from "@/services/ads-service"

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  ad: Ad | null
  onConfirm: () => void
  isLoading: boolean
}

export function DeleteConfirmation({ isOpen, onClose, ad, onConfirm, isLoading }: DeleteConfirmationProps) {
  if (!ad) return null
  return (
   <Modal isOpen={isOpen} title='Delete user' onClose={onClose}>
         <div className='p-5'>
           <div>
             <h2 className='text-xl font-bold mb-3'>Are you sure?</h2>
          <div>
             This will permanently delete the advertisement <span className="font-semibold">"{ad.title}"</span>. This
            action cannot be undone. This action cannot be undone.
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

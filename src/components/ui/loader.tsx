 import { Loader2 } from 'lucide-react';

 export const Loader = () => {
    return(
         <div className="flex justify-center items-center p-8">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
    )
}
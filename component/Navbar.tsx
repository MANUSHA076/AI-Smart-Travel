import { Plane } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function Navbar() {
  return (
     <nav className="flex justify-between items-center p-4 bg-white text-primary px-6 py-4 border-b border-gray-200 shadow-md">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
           <span className="font-bold text-lg">SmartTravel</span>
        </div>
        
        <div>
         <Button variant="outline" className="text-white bg-primary cursor-pointer hover:text-primary/20 ">Login</Button>
 
        </div>
    </nav>
  )
}

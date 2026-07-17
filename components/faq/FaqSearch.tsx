import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function FaqSearch() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Icon */}
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      {/* Input */}
      <Input
        type="text"
        placeholder="Search for a question"
        className="
          pl-10
          py-6
          h-11
          
          bg-white
          focus-visible:shadow-sm
          border border-transparent
          focus-visible:ring-0
          focus-visible:ring-primary
        "
      />
    </div>
  )
}

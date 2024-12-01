import { Button } from "@/components/ui/button"

export default function Component({ className }: { className?: string }) {
  return (
    <Button className={`bg-gradient-to-r py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 active:scale-95 ${className}`}>
      Get Started Now
    </Button>
  )
}
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface IdeaDialogProps {
  idea: {
    title: string
    score: number
    description?: string
    videoTitle?: string
    videoComment?: string
    researchLinks?: string[]
  } | null
  isOpen: boolean
  onClose: () => void
}

export function IdeaDialog({ idea, isOpen, onClose }: IdeaDialogProps) {
  if (!idea) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">{idea.title}</DialogTitle>
              <div className="text-red-500 mt-1">Score: {idea.score}</div>
            </div>
            {/* <Button
              variant="ghost"
              className="h-6 w-6 p-0 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-2">Description</h3>
            <DialogDescription className="text-base">
              {idea.description || "We're excited to deliver more content on CrewAI! In this video, we gather viewer requests and answer pressing questions, ensuring the community stays informed and engaged."}
            </DialogDescription>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-2">Research Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {(idea.researchLinks || Array(4).fill("youtube.com")).map((link, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="justify-start gap-2 h-auto py-2"
                >
                  <span className="w-4 h-4">↗</span>
                  {link}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-2">Video Title</h3>
            <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
              <span className="text-red-500">▶</span>
              <span>{idea.videoTitle || "CrewAI RAG Deep Dive [Basic & Advanced Examples]"}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-2">Video Comment</h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground">
                {idea.videoComment || "Outstanding Brandon. Thank you for one of the highest quality instructional videos I've ever seen. Please keep them coming!"}
              </p>
            </div>
          </div>

          <Button
            variant="link"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            View source video ↗
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


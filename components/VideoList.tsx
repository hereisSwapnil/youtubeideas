"use client"

import { Button } from "@/components/ui/button"
import { Video } from "@/server/db/schema"
import { formatCount } from "@/lib/utils"
import { Loader2, Monitor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { scrapeVideos } from "@/server/youtube-actions"
import { useState } from "react"

export default function Component({ initialVideos }: { initialVideos: Video[] }) {
  const { toast } = useToast();
  const [scraping, setScraping] = useState(false);
  const [videos, setVideos] = useState(initialVideos);

  const handleScrape = async() => { 
    setScraping(true);
    try {
      toast({
        title: "Scraping videos",
        description: "Scraping content, this process may take a few minutes, so sit back and relax! 😊",
        variant: "default"
      });
      const newVideos = await scrapeVideos();
      if (newVideos.error) { 
        toast({
          title: "Cannot scrape videos",
          description: "No YouTube channels found. Please add channels first.",
          variant: "destructive"
        });
        setScraping(false);
        return;
      }
      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      toast({
        title: "Scrape successful",
        description: `Successfully scraped ${newVideos.length} new videos.`,
        variant: "default"
      });
      setScraping(false);
    } catch (error) {
      console.error("Error scraping videos", error);
      toast({
        title: "Error scraping videos",
        description: "An error occurred while scraping videos. Please try again later.",
        variant: "destructive"
      });
      setScraping(false);
    }
  }

  if (!videos || videos.length === 0) { 
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-lg p-8 text-center">
      <div className="rounded-full bg-red-100 p-3">
        <Monitor className="h-6 w-6 text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">No videos yet</h3>
        <p className="mx-auto max-w-[400px] text-muted-foreground">
          Please add YouTube channels and then scrape for videos. Video comments will be analyzed for content ideas.
        </p>
      </div>
      {scraping ? (
        <Button className="rounded-full bg-red-500 px-6 hover:bg-red-600" disabled>
          <Loader2 className="h-6 w-6 animate-spin" />
          Scraping...
        </Button>
      ) : (<Button className="rounded-full bg-red-500 px-6 hover:bg-red-600" onClick={handleScrape}>Scrape</Button>)}
    </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Videos</h1>
        {scraping ? (
          <Button className="rounded-full bg-red-500 px-6 hover:bg-red-600" disabled>
            <Loader2 className="h-6 w-6 animate-spin" />
            Scraping...
          </Button>
        ) : (<Button className="rounded-full bg-red-500 px-6 hover:bg-red-600" onClick={handleScrape}>Scrape</Button>)}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video.id} className={`group overflow-hidden rounded-xl cursor-pointer border bg-white shadow-sm transition-all hover:shadow-md ${video.accentColor === "red" ? "hover:shadow-red-200" : "hover:shadow-green-200"}`} onClick={
            () => {              
              window.location.href = `/video/${video.id}`
            }
            }>
            <div className={`relative aspect-video overflow-hidden ${
              video.accentColor === "red" ? "ring-2 ring-red-500" :
              video.accentColor === "green" ? "ring-2 ring-emerald-500" :
              ""
            }`}>
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="mb-2 text-lg font-semibold leading-tight">{video.title}</h2>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{video.channelTitle}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{formatCount(video.viewCount)}</span>
                  <span>•</span>
                  <span>{new Date(video.publishedAt).toLocaleDateString("en-In", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
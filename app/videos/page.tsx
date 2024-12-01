"use client";

import VideoList from "@/components/VideoList";
import { getVideosForUser } from "@/server/queries";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const videos_ = await getVideosForUser(); // Fetch video data
        setVideos(videos_);
      } catch (error) {
        console.error("Error fetching videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Add dependency array to avoid infinite loop

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
      </div>
    );
  }

  return <VideoList initialVideos={videos} />;
}

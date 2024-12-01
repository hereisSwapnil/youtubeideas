"use client";

import Image from "next/image";
import { Eye, ThumbsUp, MessageSquare, Clock, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getCommentsForVideo, getVideoById } from "@/server/queries";
import { Video } from "@/server/db/schema";

interface Props {
  params: {
    id: string;
  };
}

interface Comment {
  id: string;
  userId: string;
  videoId: string;
  commentText: string;
  likeCount: number;
}

function RenderHtmlWithEmojis({ htmlContent }: { htmlContent: string }) {
  return (
    <div
      className="html-renderer"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default function Video({ params }: Props) {
  const videoId = params.id;
  const [video, setVideo] = useState<Video>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const video_ = await getVideoById(videoId); // Fetch video data
        setVideo(video_);
        const comments_ = await getCommentsForVideo(videoId); // Fetch comments data
        setComments(comments_);
      } catch (error) {
        console.error("Error fetching video or comments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
      </div>
    );
  }

  if (!video) {
    return <div className="text-center text-red-500">Video not found.</div>;
  }

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-red-500 mb-2">{video.title}</h1>
        <p className="text-gray-600 mb-4">{video.channelTitle}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {video.viewCount} views
          </span>
          <span className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {video.likeCount} likes
          </span>
          <span className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            {comments.length} comments
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(video.publishedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-red-500">Description</h2>
          <p className="text-gray-700">{video.description}</p>
        </div>
      </div>
      <div className="space-y-6 max-w-8xl p-6">
        <h2 className="text-2xl font-semibold text-red-500">Comments</h2>
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentCard({ comment }: { comment: Comment }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxPreviewLength = 100; // Maximum number of characters to show initially

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const shouldTruncate = comment.commentText.length > maxPreviewLength;
  const displayText = isExpanded
    ? comment.commentText
    : comment.commentText.slice(0, maxPreviewLength) + (shouldTruncate ? "..." : "");

  return (
    <div className="flex gap-4">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-gray-100 text-gray-600">
          {comment.userId.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <p className="text-gray-700 whitespace-pre-line">
          <RenderHtmlWithEmojis htmlContent={displayText} />
        </p>
        {shouldTruncate && (
          <button
            onClick={toggleExpand}
            className="text-blue-500 hover:underline text-sm"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
        <div className="text-gray-500 flex gap-1 text-[16px] align-middle items-center">
          <ThumbsUp className="w-4 h-4 mr-1" />
          {comment.likeCount}
        </div>
      </div>
    </div>
  );
}

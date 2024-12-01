"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db/drizzle";
import {
  Video,
  VideoComment,
  VideoComments,
  Videos,
  YoutubeChannels,
} from "./db/schema";
import { and, eq } from "drizzle-orm";
import { google, youtube_v3 } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

async function getChannelId(channelName: string): Promise<string | null> {
  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      q: channelName,
      type: ["channel"],
    });
    return response.data.items?.[0].id.channelId || null;
  } catch (error) {
    console.error("Error fetching channel ID", error);
    return null;
  }
}

async function fetchAllVideosForChannel(channelId: string): Promise<string[]> {
  const videos: string[] = [];
  let nextPageToken: string | undefined;

  do {
    const response = await youtube.search.list({
      part: ["snippet"],
      channelId,
      maxResults: 50,
      pageToken: nextPageToken,
    });

    const videoIds =
      response.data.items
        ?.map((item) => item.id.videoId)
        .filter((id): id is string => id !== null && id !== undefined) || [];
    if (videoIds.length > 0) {
      videos.push(...videoIds);
    }
    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken);

  return videos;
}

function getHighestResolutionThumbnail(
  thumbnails: youtube_v3.Schema$ThumbnailDetails
): string {
  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    ""
  );
}

async function fetchVideoDetails(videoIds: string[]): Promise<Video[]> {
  const videos: Video[] = [];
  let i = 0;

  while (i < videoIds.length) {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics"],
      id: videoIds.slice(i, i + 50).join(","),
    });

    const videoItems = response.data.items || [];
    for (const item of videoItems) {
      const snippet = item.snippet;
      const statistics = item.statistics;

      if (!snippet || !statistics) {
        console.error("Missing snippet or statistics for video", item);
        continue;
      }

      const video: Video = {
        videoId: item.id || "",
        title: snippet.title || "",
        description: snippet.description || "",
        publishedAt: new Date(snippet.publishedAt || ""),
        thumbnailUrl: getHighestResolutionThumbnail(snippet.thumbnails),
        channelId: snippet.channelId || "",
        channelTitle: snippet.channelTitle || "",
        viewCount: parseInt(statistics.viewCount || "0"),
        likeCount: parseInt(statistics.likeCount || "0"),
        dislikeCount: parseInt(statistics.dislikeCount || "0"),
        commentCount: parseInt(statistics.commentCount || "0"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      videos.push(video);
    }

    i += 50;
  }

  return videos;
}

async function fetchCommentsForVideos(
  videoIds: string[]
): Promise<VideoComment[]> {
  const comments: VideoComment[] = [];

  for (const videoId of videoIds) {
    let nextPageToken: string | undefined;

    try {
      let fetchedComments = 0; // Counter to track the number of comments fetched per video
      do {
        const response = await youtube.commentThreads.list({
          part: ["snippet"],
          videoId,
          maxResults: 100,
          pageToken: nextPageToken,
        });

        const commentItems = response.data.items || [];
        for (const item of commentItems) {
          const snippet = item.snippet?.topLevelComment?.snippet;

          if (!snippet) {
            console.warn(
              `Missing snippet for comment in videoId: ${videoId}`,
              item
            );
            continue;
          }

          const comment: VideoComment = {
            videoId,
            commentText: snippet.textDisplay || "",
            likeCount: parseInt(snippet.likeCount || "0", 10),
            dislikeCount: 0, // YouTube API no longer provides dislike counts
            publishedAt: new Date(snippet.publishedAt || ""),
            isUsed: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          comments.push(comment);
          fetchedComments++;

          // Stop fetching if we've reached the limit of 100 comments for this video
          if (fetchedComments >= 100) break;
        }

        if (fetchedComments >= 100) break; // Exit outer loop if limit is reached
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
    } catch (error) {
      console.error(`Failed to fetch comments for videoId: ${videoId}`, error);
    }
  }

  return comments;
}

export async function scrapeVideos() {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const channels = await db
    .select()
    .from(YoutubeChannels)
    .where(eq(YoutubeChannels.userId, userId));

  if (channels.length === 0) {
    return {
      error: "No channels found",
    };
  }

  const newVideos: Video[] = [];
  const newComments: VideoComment[] = [];

  for (const channel of channels) {
    if (!channel.channelId) {
      const channelId = await getChannelId(channel.name);

      if (!channelId) {
        console.error("Could not find channel ID for ", channel.name);
        continue;
      }

      await db
        .update(YoutubeChannels)
        .set({ channelId, updatedAt: new Date() })
        .where(
          and(
            eq(YoutubeChannels.id, channel.id),
            eq(YoutubeChannels.userId, userId)
          )
        );

      channel.channelId = channelId;
    }
    const videosIds = await fetchAllVideosForChannel(channel.channelId);
    const videoDetails = await fetchVideoDetails(videosIds);

    for (const video of videoDetails) {
      try {
        const [newVideo] = await db
          .insert(Videos)
          .values({ ...video, userId })
          .returning();
        newVideos.push(newVideo);
      } catch (error) {
        console.error("Error inserting video", error);
      }
    }

    const comments = await fetchCommentsForVideos(videosIds);

    for (const comment of comments) {
      try {
        const [newComment] = await db
          .insert(VideoComments)
          .values({ ...comment, userId })
          .returning();
        newComments.push(newComment);
      } catch (error) {
        console.log(`Error in comment ${comment.videoId}`);
        console.error("Error inserting comment", error);
      }
    }

    console.log(
      `Scraped ${videosIds.length} videos for channel ${channel.name}`
    );
    return newVideos;
  }
}

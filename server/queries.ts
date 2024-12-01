"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db/drizzle";
import { Idea, Ideas, Video, VideoComment, VideoComments, Videos, YoutubeChannel, YoutubeChannels } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

export const getVideosForUser = async (): Promise<Video[]> => {
    const { userId } = await auth();
 
    if (!userId) throw new Error("User not authenticated");
    
    return db.select().from(Videos).where(eq(Videos.userId, userId));
}

export const getChannelsForUser = async (): Promise<YoutubeChannel[]> => { 
    const { userId } = await auth();

    if (!userId) throw new Error("User not authenticated");

    return db.select().from(YoutubeChannels).where(eq(YoutubeChannels.userId, userId));
}

export const getVideoById = async (videoId: string): Promise<Video> => { 
    const { userId } = await auth();

    if (!userId) throw new Error("User not authenticated");

    const [video]: Video[] = await db.select().from(Videos).where(and(eq(Videos.userId, userId), eq(Videos.id, videoId)));

    console.log("video", video);

    return video;
}

export const getCommentsForVideo = async (videoId: string): Promise<VideoComment[]> => {
    const { userId } = await auth();

    if (!userId) throw new Error("User not authenticated");

    const [video]: Video[] = await db.select().from(Videos).where(and(eq(Videos.userId, userId), eq(Videos.id, videoId)));

    return db.select().from(VideoComments).where(and(eq(VideoComments.userId, userId), eq(VideoComments.videoId, video.videoId)));
}

export const getIdeasForUser = async (): Promise<Idea[]> => {
    const { userId } = await auth();

    if (!userId) throw new Error("User not authenticated");

    return db.select().from(Ideas).where(eq(Ideas.userId, userId));
}
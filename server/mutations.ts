"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db/drizzle";
import { YoutubeChannel, YoutubeChannels } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

export const addChannelForUser = async (
  name: string
): Promise<YoutubeChannel[]> => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const [newChannel] = await db
    .insert(YoutubeChannels)
    .values({ name, userId })
    .returning();

  return [newChannel];
};

export const removeChannelForUser = async (id: string): Promise<void> => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  await db
    .delete(YoutubeChannels)
    .where(and(eq(YoutubeChannels.id, id), eq(YoutubeChannels.userId, userId)));
};

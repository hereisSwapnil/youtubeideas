import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Defining table schemas
export const Videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  videoId: text("video_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  publishedAt: timestamp("published_at").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  channelId: text("channel_id").notNull(),
  channelTitle: text("channel_title").notNull(),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  dislikeCount: integer("dislike_count").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const YoutubeChannels = pgTable("youtube_channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  channelId: text("channel_id"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const VideoComments = pgTable("video_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: text("video_id").notNull(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  commentText: text("comment_text").notNull(),
  likeCount: integer("like_count").default(0),
  dislikeCount: integer("dislike_count").default(0),
  publishedAt: timestamp("published_at").notNull(),
  isUsed: integer("is_used").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Ideas = pgTable("ideas", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  videoId: text("video_id")
    .notNull()
    .references(() => Videos.videoId),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => VideoComments.id),
  score: integer("score").default(0),
  videoTitle: text("video_title").notNull(),
  description: text("description").notNull(),
  research: text("research").array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const CrewJobs = pgTable("crew_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  kickoffId: text("kickoff_id").notNull(),
  jobStatus: text("job_status").notNull(),
  jobResult: text("job_result"),
  processed: boolean ("processed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Defining relationships
export const VideoRelationships = relations(Videos, ({ many }) => ({
  comments: many(VideoComments),
  ideas: many(Ideas),
}));

export const VideoCommentRelationships = relations(
  VideoComments,
  ({ one }) => ({
    video: one(Videos, {
      fields: [VideoComments.videoId],
      references: [Videos.id],
    }),
  })
);

export const IdeaRelationships = relations(Ideas, ({ one }) => ({
  video: one(Videos, {
    fields: [Ideas.videoId],
    references: [Videos.id],
  }),
  comment: one(VideoComments, {
    fields: [Ideas.commentId],
    references: [VideoComments.id],
  }),
}));

// Defining Types
export type Video = typeof Videos.$inferSelect;
export type InsertVideo = typeof Videos.$inferInsert;
export type YoutubeChannel = typeof YoutubeChannels.$inferSelect;
export type InsertYoutubeChannel = typeof YoutubeChannels.$inferInsert;
export type VideoComment = typeof VideoComments.$inferSelect;
export type InsertVideoComment = typeof VideoComments.$inferInsert;
export type Idea = typeof Ideas.$inferSelect;

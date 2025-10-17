import { sql } from "drizzle-orm";
import { pgTable, text, bigint, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  telegramId: bigint("telegram_id", { mode: "number" }).primaryKey(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // 'sales' | 'lesson' | 'testimonial'
  videoUrl: text("video_url").notNull(),
  posterUrl: text("poster_url"),
  title: text("title"),
  hook: text("hook"),
  author: text("author"),
  authorAvatar: text("author_avatar"),
  descriptionBrief: text("description_brief"),
  descriptionFull: text("description_full"),
  lessonTitle: text("lesson_title"),
  captionBrief: text("caption_brief"),
  captionFull: text("caption_full"),
  ctaText: text("cta_text"),
  nextCtaText: text("next_cta_text"),
  isFinal: integer("is_final").default(0),
  likeCount: integer("like_count").default(0),
  shareCount: integer("share_count").default(0),
  commentCount: integer("comment_count").default(0),
  role: text("role"),
  highlight: text("highlight"),
  thumbUrl: text("thumb_url"),
  comments: jsonb("comments"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  createdAt: true,
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

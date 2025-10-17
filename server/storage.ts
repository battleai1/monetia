import { type User, type InsertUser, users, type Video, type InsertVideo, videos } from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getUserByTelegramId(telegramId: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(telegramId: number, userData: Partial<InsertUser>): Promise<User>;
  
  getVideosByType(type: string): Promise<Video[]>;
  getAllVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  createManyVideos(videoList: InsertVideo[]): Promise<Video[]>;
}

export class DbStorage implements IStorage {
  async getUserByTelegramId(telegramId: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(telegramId: number, userData: Partial<InsertUser>): Promise<User> {
    const result = await db
      .update(users)
      .set(userData)
      .where(eq(users.telegramId, telegramId))
      .returning();
    
    if (!result[0]) {
      throw new Error("User not found");
    }
    
    return result[0];
  }

  async getVideosByType(type: string): Promise<Video[]> {
    const result = await db
      .select()
      .from(videos)
      .where(eq(videos.type, type))
      .orderBy(asc(videos.orderIndex));
    return result;
  }

  async getAllVideos(): Promise<Video[]> {
    const result = await db
      .select()
      .from(videos)
      .orderBy(asc(videos.type), asc(videos.orderIndex));
    return result;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const result = await db.insert(videos).values(video).returning();
    return result[0];
  }

  async createManyVideos(videoList: InsertVideo[]): Promise<Video[]> {
    const result = await db.insert(videos).values(videoList).returning();
    return result;
  }
}

export const storage = new DbStorage();

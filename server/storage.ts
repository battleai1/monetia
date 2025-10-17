import { type User, type InsertUser, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUserByTelegramId(telegramId: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(telegramId: number, userData: Partial<InsertUser>): Promise<User>;
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
}

export const storage = new DbStorage();

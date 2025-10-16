import { type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUserByTelegramId(telegramId: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(telegramId: number, userData: Partial<InsertUser>): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;

  constructor() {
    this.users = new Map();
  }

  async getUserByTelegramId(telegramId: number): Promise<User | undefined> {
    return this.users.get(telegramId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      telegramId: insertUser.telegramId,
      username: insertUser.username ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      createdAt: new Date()
    };
    this.users.set(user.telegramId, user);
    return user;
  }

  async updateUser(telegramId: number, userData: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(telegramId);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser: User = { 
      ...existingUser, 
      ...userData 
    };
    this.users.set(telegramId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();

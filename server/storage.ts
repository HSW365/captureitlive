import {
  users,
  biometrics,
  posts,
  communityGroups,
  groupMemberships,
  therapySessions,
  therapyMessages,
  wellnessActivities,
  karmaTransactions,
  environmentalImpact,
  wellnessChallenges,
  challengeParticipations,
  crisisSupport,
  type User,
  type UpsertUser,
  type Biometric,
  type Post,
  type CommunityGroup,
  type TherapySession,
  type TherapyMessage,
  type WellnessActivity,
  type KarmaTransaction,
  type EnvironmentalImpact,
  type WellnessChallenge,
  type CrisisSupport,
  type InsertBiometric,
  type InsertPost,
  type InsertTherapySession,
  type InsertTherapyMessage,
  type InsertWellnessActivity,
  type InsertKarmaTransaction,
  type InsertEnvironmentalImpact,
  type InsertCrisisSupport,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserKarma(userId: string, amount: number): Promise<User | undefined>;
  
  // Biometric operations
  createBiometric(biometric: InsertBiometric): Promise<Biometric>;
  getLatestBiometrics(userId: string): Promise<Biometric | undefined>;
  getBiometricHistory(userId: string, days?: number): Promise<Biometric[]>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPosts(limit?: number): Promise<Post[]>;
  getUserPosts(userId: string): Promise<Post[]>;
  getFeaturedPosts(): Promise<Post[]>;
  updatePostEngagement(postId: string, type: 'like' | 'comment' | 'share'): Promise<void>;
  
  // Community operations
  getCommunityGroups(location?: string): Promise<CommunityGroup[]>;
  getUserGroups(userId: string): Promise<CommunityGroup[]>;
  joinGroup(userId: string, groupId: string): Promise<void>;
  
  // Therapy operations
  createTherapySession(session: InsertTherapySession): Promise<TherapySession>;
  addTherapyMessage(message: InsertTherapyMessage): Promise<TherapyMessage>;
  getTherapySessions(userId: string): Promise<TherapySession[]>;
  getTherapyMessages(sessionId: string): Promise<TherapyMessage[]>;
  
  // Wellness activities
  createWellnessActivity(activity: InsertWellnessActivity): Promise<WellnessActivity>;
  getUserActivities(userId: string, limit?: number): Promise<WellnessActivity[]>;
  
  // Karma operations
  addKarmaTransaction(transaction: InsertKarmaTransaction): Promise<KarmaTransaction>;
  getUserKarmaHistory(userId: string): Promise<KarmaTransaction[]>;
  
  // Environmental impact
  addEnvironmentalImpact(impact: InsertEnvironmentalImpact): Promise<EnvironmentalImpact>;
  getUserEnvironmentalImpact(userId: string): Promise<EnvironmentalImpact[]>;
  
  // Crisis support
  createCrisisSupport(crisis: InsertCrisisSupport): Promise<CrisisSupport>;
  
  // Analytics
  getGlobalStats(): Promise<{
    totalUsers: number;
    activeToday: number;
    totalKarma: number;
    totalActivities: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserKarma(userId: string, amount: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        karma: sql`${users.karma} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Biometric operations
  async createBiometric(biometric: InsertBiometric): Promise<Biometric> {
    const [result] = await db.insert(biometrics).values(biometric).returning();
    return result;
  }

  async getLatestBiometrics(userId: string): Promise<Biometric | undefined> {
    const [result] = await db
      .select()
      .from(biometrics)
      .where(eq(biometrics.userId, userId))
      .orderBy(desc(biometrics.recordedAt))
      .limit(1);
    return result;
  }

  async getBiometricHistory(userId: string, days = 7): Promise<Biometric[]> {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    return db
      .select()
      .from(biometrics)
      .where(and(
        eq(biometrics.userId, userId),
        gte(biometrics.recordedAt, daysAgo)
      ))
      .orderBy(desc(biometrics.recordedAt));
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [result] = await db.insert(posts).values(post).returning();
    return result;
  }

  async getPosts(limit = 50): Promise<Post[]> {
    return db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async getFeaturedPosts(): Promise<Post[]> {
    return db
      .select()
      .from(posts)
      .where(eq(posts.featured, true))
      .orderBy(desc(posts.createdAt));
  }

  async updatePostEngagement(postId: string, type: 'like' | 'comment' | 'share'): Promise<void> {
    const field = type === 'like' ? posts.likes : 
                  type === 'comment' ? posts.comments : posts.shares;
    
    await db
      .update(posts)
      .set({ 
        [type + 's']: sql`${field} + 1`,
        updatedAt: new Date()
      })
      .where(eq(posts.id, postId));
  }

  // Community operations
  async getCommunityGroups(location?: string): Promise<CommunityGroup[]> {
    let query = db.select().from(communityGroups).where(eq(communityGroups.isPublic, true));
    
    if (location) {
      query = query.where(eq(communityGroups.location, location));
    }
    
    return query.orderBy(desc(communityGroups.memberCount));
  }

  async getUserGroups(userId: string): Promise<CommunityGroup[]> {
    return db
      .select({
        id: communityGroups.id,
        name: communityGroups.name,
        description: communityGroups.description,
        category: communityGroups.category,
        location: communityGroups.location,
        imageUrl: communityGroups.imageUrl,
        memberCount: communityGroups.memberCount,
        isPublic: communityGroups.isPublic,
        createdBy: communityGroups.createdBy,
        createdAt: communityGroups.createdAt,
      })
      .from(groupMemberships)
      .innerJoin(communityGroups, eq(groupMemberships.groupId, communityGroups.id))
      .where(eq(groupMemberships.userId, userId));
  }

  async joinGroup(userId: string, groupId: string): Promise<void> {
    await db.insert(groupMemberships).values({
      userId,
      groupId,
    });
    
    // Update member count
    await db
      .update(communityGroups)
      .set({ memberCount: sql`${communityGroups.memberCount} + 1` })
      .where(eq(communityGroups.id, groupId));
  }

  // Therapy operations
  async createTherapySession(session: InsertTherapySession): Promise<TherapySession> {
    const [result] = await db.insert(therapySessions).values(session).returning();
    return result;
  }

  async addTherapyMessage(message: InsertTherapyMessage): Promise<TherapyMessage> {
    const [result] = await db.insert(therapyMessages).values(message).returning();
    return result;
  }

  async getTherapySessions(userId: string): Promise<TherapySession[]> {
    return db
      .select()
      .from(therapySessions)
      .where(eq(therapySessions.userId, userId))
      .orderBy(desc(therapySessions.createdAt));
  }

  async getTherapyMessages(sessionId: string): Promise<TherapyMessage[]> {
    return db
      .select()
      .from(therapyMessages)
      .where(eq(therapyMessages.sessionId, sessionId))
      .orderBy(therapyMessages.timestamp);
  }

  // Wellness activities
  async createWellnessActivity(activity: InsertWellnessActivity): Promise<WellnessActivity> {
    const [result] = await db.insert(wellnessActivities).values(activity).returning();
    return result;
  }

  async getUserActivities(userId: string, limit = 20): Promise<WellnessActivity[]> {
    return db
      .select()
      .from(wellnessActivities)
      .where(eq(wellnessActivities.userId, userId))
      .orderBy(desc(wellnessActivities.completedAt))
      .limit(limit);
  }

  // Karma operations
  async addKarmaTransaction(transaction: InsertKarmaTransaction): Promise<KarmaTransaction> {
    const [result] = await db.insert(karmaTransactions).values(transaction).returning();
    
    // Update user's total karma
    await this.updateUserKarma(transaction.userId, transaction.amount);
    
    return result;
  }

  async getUserKarmaHistory(userId: string): Promise<KarmaTransaction[]> {
    return db
      .select()
      .from(karmaTransactions)
      .where(eq(karmaTransactions.userId, userId))
      .orderBy(desc(karmaTransactions.createdAt));
  }

  // Environmental impact
  async addEnvironmentalImpact(impact: InsertEnvironmentalImpact): Promise<EnvironmentalImpact> {
    const [result] = await db.insert(environmentalImpact).values(impact).returning();
    return result;
  }

  async getUserEnvironmentalImpact(userId: string): Promise<EnvironmentalImpact[]> {
    return db
      .select()
      .from(environmentalImpact)
      .where(eq(environmentalImpact.userId, userId))
      .orderBy(desc(environmentalImpact.recordedAt));
  }

  // Crisis support
  async createCrisisSupport(crisis: InsertCrisisSupport): Promise<CrisisSupport> {
    const [result] = await db.insert(crisisSupport).values(crisis).returning();
    return result;
  }

  // Analytics
  async getGlobalStats(): Promise<{
    totalUsers: number;
    activeToday: number;
    totalKarma: number;
    totalActivities: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsersResult] = await db.select({ count: count() }).from(users);
    const [activeTodayResult] = await db
      .select({ count: count() })
      .from(wellnessActivities)
      .where(gte(wellnessActivities.completedAt, today));
    
    const [totalKarmaResult] = await db
      .select({ total: sql<number>`sum(${users.karma})` })
      .from(users);
    
    const [totalActivitiesResult] = await db.select({ count: count() }).from(wellnessActivities);

    return {
      totalUsers: totalUsersResult.count,
      activeToday: activeTodayResult.count,
      totalKarma: totalKarmaResult.total || 0,
      totalActivities: totalActivitiesResult.count,
    };
  }
}

export const storage = new DatabaseStorage();

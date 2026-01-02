import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  karma: integer("karma").default(100),
  level: varchar("level").default("Wellness Seeker"),
  plan: varchar("plan").default("free"), // free, standard, premium
  theme: varchar("theme").default("light"), // light, dark, nature
  language: varchar("language").default("en"),
  timezone: varchar("timezone"),
  location: varchar("location"),
  biometricConsent: boolean("biometric_consent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Biometric data
export const biometrics = pgTable("biometrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  heartRate: integer("heart_rate"),
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
  sleepQuality: integer("sleep_quality"), // 0-100
  stressLevel: integer("stress_level"), // 0-100
  steps: integer("steps"),
  mindfulnessMinutes: integer("mindfulness_minutes"),
  mood: varchar("mood"), // very_sad, sad, neutral, happy, very_happy
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Posts/Content
export const postTypeEnum = pgEnum("post_type", ["text", "image", "video", "meditation", "workout"]);
export const moodEnum = pgEnum("mood", ["very_sad", "sad", "neutral", "happy", "very_happy"]);

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: postTypeEnum("type").notNull(),
  title: varchar("title"),
  content: text("content"),
  mood: moodEnum("mood"),
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  location: varchar("location"),
  tags: jsonb("tags").$type<string[]>(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  featured: boolean("featured").default(false),
  karmaAwarded: integer("karma_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community Groups
export const communityGroups = pgTable("community_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category"), // meditation, fitness, support, etc.
  location: varchar("location"),
  imageUrl: varchar("image_url"),
  memberCount: integer("member_count").default(0),
  isPublic: boolean("is_public").default(true),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Group Memberships
export const groupMemberships = pgTable("group_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  groupId: varchar("group_id").references(() => communityGroups.id).notNull(),
  role: varchar("role").default("member"), // member, moderator, admin
  joinedAt: timestamp("joined_at").defaultNow(),
});

// AI Therapy Sessions
export const therapySessions = pgTable("therapy_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionType: varchar("session_type"), // chat, guided_meditation, crisis_support
  duration: integer("duration"), // in minutes
  mood: moodEnum("mood"),
  topics: jsonb("topics").$type<string[]>(),
  summary: text("summary"),
  aiInsights: jsonb("ai_insights"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Therapy Messages
export const therapyMessages = pgTable("therapy_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => therapySessions.id).notNull(),
  role: varchar("role").notNull(), // user, assistant
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Wellness Activities
export const wellnessActivities = pgTable("wellness_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // meditation, workout, breathing, journaling
  name: varchar("name").notNull(),
  duration: integer("duration"), // in minutes
  intensity: varchar("intensity"), // low, medium, high
  mood: moodEnum("mood"),
  notes: text("notes"),
  karmaEarned: integer("karma_earned").default(0),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Karma Transactions
export const karmaTransactions = pgTable("karma_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  reason: varchar("reason").notNull(),
  description: text("description"),
  relatedId: varchar("related_id"), // reference to post, activity, etc.
  relatedType: varchar("related_type"), // post, activity, daily_goal, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Environmental Impact
export const environmentalImpact = pgTable("environmental_impact", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  carbonOffset: decimal("carbon_offset", { precision: 10, scale: 2 }), // in lbs
  waterSaved: decimal("water_saved", { precision: 10, scale: 2 }), // in gallons
  treesPlanted: integer("trees_planted").default(0),
  activityType: varchar("activity_type"), // mindful_transport, conscious_consumption, etc.
  description: text("description"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Wellness Challenges
export const wellnessChallenges = pgTable("wellness_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // meditation, fitness, digital_detox, etc.
  duration: integer("duration"), // in days
  karmaReward: integer("karma_reward").default(0),
  participantCount: integer("participant_count").default(0),
  isGlobal: boolean("is_global").default(false),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Challenge Participations
export const challengeParticipations = pgTable("challenge_participations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  challengeId: varchar("challenge_id").references(() => wellnessChallenges.id).notNull(),
  progress: integer("progress").default(0), // percentage 0-100
  completed: boolean("completed").default(false),
  joinedAt: timestamp("joined_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Crisis Support Records
export const crisisSupport = pgTable("crisis_support", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  severity: varchar("severity").notNull(), // low, medium, high, critical
  type: varchar("type").notNull(), // emotional, anxiety, depression, suicidal
  supportProvided: text("support_provided"),
  followUpRequired: boolean("follow_up_required").default(false),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBiometricSchema = createInsertSchema(biometrics).omit({
  id: true,
  recordedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes: true,
  comments: true,
  shares: true,
  featured: true,
  karmaAwarded: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTherapySessionSchema = createInsertSchema(therapySessions).omit({
  id: true,
  createdAt: true,
});

export const insertTherapyMessageSchema = createInsertSchema(therapyMessages).omit({
  id: true,
  timestamp: true,
});

export const insertWellnessActivitySchema = createInsertSchema(wellnessActivities).omit({
  id: true,
  karmaEarned: true,
  completedAt: true,
});

export const insertKarmaTransactionSchema = createInsertSchema(karmaTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertEnvironmentalImpactSchema = createInsertSchema(environmentalImpact).omit({
  id: true,
  recordedAt: true,
});

export const insertCrisisSupportSchema = createInsertSchema(crisisSupport).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Biometric = typeof biometrics.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type CommunityGroup = typeof communityGroups.$inferSelect;
export type TherapySession = typeof therapySessions.$inferSelect;
export type TherapyMessage = typeof therapyMessages.$inferSelect;
export type WellnessActivity = typeof wellnessActivities.$inferSelect;
export type KarmaTransaction = typeof karmaTransactions.$inferSelect;
export type EnvironmentalImpact = typeof environmentalImpact.$inferSelect;
export type WellnessChallenge = typeof wellnessChallenges.$inferSelect;
export type CrisisSupport = typeof crisisSupport.$inferSelect;

export type InsertBiometric = z.infer<typeof insertBiometricSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertTherapySession = z.infer<typeof insertTherapySessionSchema>;
export type InsertTherapyMessage = z.infer<typeof insertTherapyMessageSchema>;
export type InsertWellnessActivity = z.infer<typeof insertWellnessActivitySchema>;
export type InsertKarmaTransaction = z.infer<typeof insertKarmaTransactionSchema>;
export type InsertEnvironmentalImpact = z.infer<typeof insertEnvironmentalImpactSchema>;
export type InsertCrisisSupport = z.infer<typeof insertCrisisSupportSchema>;

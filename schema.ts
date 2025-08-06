import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  learningProgress: integer("learning_progress").default(0),
  completedLessons: json("completed_lessons").$type<string[]>().default([]),
  favoriteTranslations: json("favorite_translations").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ukrainianText: text("ukrainian_text").notNull(),
  englishText: text("english_text").notNull(),
  userId: varchar("user_id"),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dictionaryEntries = pgTable("dictionary_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ukrainianWord: text("ukrainian_word").notNull(),
  englishTranslation: text("english_translation").notNull(),
  pronunciation: text("pronunciation"),
  partOfSpeech: text("part_of_speech"),
  examples: json("examples").$type<{ukrainian: string, english: string}[]>().default([]),
  category: text("category"),
});

export const historicalEvents = pgTable("historical_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  importance: integer("importance").default(1),
});

export const learningModules = pgTable("learning_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedTime: integer("estimated_time_minutes").notNull(),
  hasAudio: boolean("has_audio").default(true),
  hasVoicePractice: boolean("has_voice_practice").default(false),
  hasCertificate: boolean("has_certificate").default(false),
  content: json("content").$type<any>().notNull(),
  orderIndex: integer("order_index").default(0),
});

export const communityResources = pgTable("community_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'cultural_center', 'event', 'service'
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
  description: text("description"),
  eventDate: timestamp("event_date"),
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

export const insertDictionaryEntrySchema = createInsertSchema(dictionaryEntries).omit({
  id: true,
});

export const insertHistoricalEventSchema = createInsertSchema(historicalEvents).omit({
  id: true,
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
});

export const insertCommunityResourceSchema = createInsertSchema(communityResources).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;
export type InsertDictionaryEntry = z.infer<typeof insertDictionaryEntrySchema>;
export type DictionaryEntry = typeof dictionaryEntries.$inferSelect;
export type InsertHistoricalEvent = z.infer<typeof insertHistoricalEventSchema>;
export type HistoricalEvent = typeof historicalEvents.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type LearningModule = typeof learningModules.$inferSelect;
export type InsertCommunityResource = z.infer<typeof insertCommunityResourceSchema>;
export type CommunityResource = typeof communityResources.$inferSelect;

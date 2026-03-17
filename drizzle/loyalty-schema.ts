/**
 * Loyalty Points System Schema
 * Tracks customer loyalty points and rewards
 */

import { int, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Customer loyalty accounts
 */
export const loyaltyAccounts = mysqlTable("loyalty_accounts", {
  id: int("id").autoincrement().primaryKey(),
  customerId: varchar("customerId", { length: 255 }).notNull().unique(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  totalPoints: int("totalPoints").default(0).notNull(),
  totalSpent: decimal("totalSpent", { precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Points transactions log
 */
export const pointsTransactions = mysqlTable("points_transactions", {
  id: int("id").autoincrement().primaryKey(),
  loyaltyAccountId: int("loyaltyAccountId").notNull(),
  points: int("points").notNull(), // Can be positive (earned) or negative (redeemed)
  reason: varchar("reason", { length: 255 }).notNull(), // "purchase", "referral", "review", "redeem"
  orderReference: varchar("orderReference", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Loyalty rewards/tiers
 */
export const loyaltyRewards = mysqlTable("loyalty_rewards", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // "Bronze", "Silver", "Gold", "Platinum"
  minPoints: int("minPoints").notNull(),
  maxPoints: int("maxPoints"),
  discountPercentage: decimal("discountPercentage", { precision: 5, scale: 2 }).notNull(),
  benefits: text("benefits"), // JSON string of benefits
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Redeemed rewards
 */
export const redeemedRewards = mysqlTable("redeemed_rewards", {
  id: int("id").autoincrement().primaryKey(),
  loyaltyAccountId: int("loyaltyAccountId").notNull(),
  rewardId: int("rewardId").notNull(),
  pointsSpent: int("pointsSpent").notNull(),
  discountCode: varchar("discountCode", { length: 50 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyAccount = typeof loyaltyAccounts.$inferSelect;
export type InsertLoyaltyAccount = typeof loyaltyAccounts.$inferInsert;

export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type InsertPointsTransaction = typeof pointsTransactions.$inferInsert;

export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type InsertLoyaltyReward = typeof loyaltyRewards.$inferInsert;

export type RedeemedReward = typeof redeemedRewards.$inferSelect;
export type InsertRedeemedReward = typeof redeemedRewards.$inferInsert;

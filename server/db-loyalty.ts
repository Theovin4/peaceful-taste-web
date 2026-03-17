/**
 * Loyalty Points Database Helpers
 */

import { getDb } from './db';
import { eq, gte, lte, and } from 'drizzle-orm';
import { 
  loyaltyAccounts, 
  pointsTransactions, 
  loyaltyRewards,
  redeemedRewards,
  type InsertLoyaltyAccount,
  type InsertPointsTransaction,
  type InsertRedeemedReward,
} from '../drizzle/loyalty-schema';

/**
 * Get or create loyalty account for customer
 */
export async function getOrCreateLoyaltyAccount(
  customerId: string,
  email: string,
  phone: string
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    // Check if account exists
    const existing = await db
      .select()
      .from(loyaltyAccounts)
      .where(eq(loyaltyAccounts.customerId, customerId))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new account
    await db.insert(loyaltyAccounts).values({
      customerId,
      customerEmail: email,
      customerPhone: phone,
      totalPoints: 0,
      totalSpent: '0.00',
    });

    const newAccount = await db
      .select()
      .from(loyaltyAccounts)
      .where(eq(loyaltyAccounts.customerId, customerId))
      .limit(1);

    return newAccount[0];
  } catch (error) {
    console.error('[Loyalty] Failed to get/create account:', error);
    throw error;
  }
}

/**
 * Add points to customer account
 */
export async function addPoints(
  loyaltyAccountId: number,
  points: number,
  reason: 'purchase' | 'referral' | 'review' | 'bonus' | 'redeem',
  orderReference?: string,
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    // Add transaction record
    await db.insert(pointsTransactions).values({
      loyaltyAccountId,
      points,
      reason,
      orderReference,
      description,
    });

    // Update total points
    const account = await db
      .select()
      .from(loyaltyAccounts)
      .where(eq(loyaltyAccounts.id, loyaltyAccountId))
      .limit(1);

    if (account.length > 0) {
      const newTotal = (account[0].totalPoints || 0) + points;
      await db
        .update(loyaltyAccounts)
        .set({ totalPoints: newTotal })
        .where(eq(loyaltyAccounts.id, loyaltyAccountId));
    }

    return true;
  } catch (error) {
    console.error('[Loyalty] Failed to add points:', error);
    throw error;
  }
}

/**
 * Award points for purchase
 * 1 point per ₦100 spent
 */
export async function awardPurchasePoints(
  loyaltyAccountId: number,
  amount: number,
  orderReference: string
) {
  const pointsEarned = Math.floor(amount / 100);
  
  await addPoints(
    loyaltyAccountId,
    pointsEarned,
    'purchase',
    orderReference,
    `Earned ${pointsEarned} points from order ₦${amount}`
  );

  return pointsEarned;
}

/**
 * Award referral bonus points
 */
export async function awardReferralPoints(
  loyaltyAccountId: number,
  referredCustomerId: string
) {
  const referralBonus = 500; // 500 points = ₦500 credit
  
  await addPoints(
    loyaltyAccountId,
    referralBonus,
    'referral',
    undefined,
    `Referral bonus for customer ${referredCustomerId}`
  );

  return referralBonus;
}

/**
 * Get customer loyalty tier
 */
export async function getLoyaltyTier(totalPoints: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const tier = await db
      .select()
      .from(loyaltyRewards)
      .where(
        and(
          lte(loyaltyRewards.minPoints, totalPoints),
          gte(loyaltyRewards.maxPoints, totalPoints)
        )
      )
      .limit(1);

    return tier.length > 0 ? tier[0] : null;
  } catch (error) {
    console.error('[Loyalty] Failed to get tier:', error);
    return null;
  }
}

/**
 * Get customer loyalty account with tier
 */
export async function getLoyaltyAccountWithTier(customerId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const account = await db
      .select()
      .from(loyaltyAccounts)
      .where(eq(loyaltyAccounts.customerId, customerId))
      .limit(1);

    if (account.length === 0) return null;

    const tier = await getLoyaltyTier(account[0].totalPoints || 0);

    return {
      account: account[0],
      tier,
    };
  } catch (error) {
    console.error('[Loyalty] Failed to get account with tier:', error);
    return null;
  }
}

/**
 * Get points transactions history
 */
export async function getPointsHistory(loyaltyAccountId: number, limit = 10) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const history = await db
      .select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.loyaltyAccountId, loyaltyAccountId))
      .orderBy(pointsTransactions.createdAt)
      .limit(limit);

    return history;
  } catch (error) {
    console.error('[Loyalty] Failed to get history:', error);
    return [];
  }
}

/**
 * Redeem points for discount
 */
export async function redeemPointsForDiscount(
  loyaltyAccountId: number,
  pointsToRedeem: number,
  discountPercentage: number
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    // Generate discount code
    const discountCode = 'PEACE' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create redeemed reward
    await db.insert(redeemedRewards).values({
      loyaltyAccountId,
      rewardId: 1, // Default reward ID
      pointsSpent: pointsToRedeem,
      discountCode,
      expiresAt,
    });

    // Deduct points
    await addPoints(
      loyaltyAccountId,
      -pointsToRedeem,
      'redeem',
      undefined,
      `Redeemed ${pointsToRedeem} points for ${discountPercentage}% discount`
    );

    return {
      discountCode,
      discountPercentage,
      expiresAt,
    };
  } catch (error) {
    console.error('[Loyalty] Failed to redeem points:', error);
    throw error;
  }
}

/**
 * Initialize default loyalty tiers
 */
export async function initializeLoyaltyTiers() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const existing = await db.select().from(loyaltyRewards);
    
    if (existing.length > 0) {
      return; // Already initialized
    }

    const tiers = [
      {
        name: 'Bronze',
        minPoints: 0,
        maxPoints: 499,
        discountPercentage: '0',
        benefits: JSON.stringify(['Free shipping on orders over ₦5,000']),
      },
      {
        name: 'Silver',
        minPoints: 500,
        maxPoints: 1499,
        discountPercentage: '5',
        benefits: JSON.stringify(['5% discount on all orders', 'Free shipping', 'Birthday bonus']),
      },
      {
        name: 'Gold',
        minPoints: 1500,
        maxPoints: 4999,
        discountPercentage: '10',
        benefits: JSON.stringify(['10% discount on all orders', 'Free shipping', 'Birthday bonus', 'Early access to new products']),
      },
      {
        name: 'Platinum',
        minPoints: 5000,
        maxPoints: null,
        discountPercentage: '15',
        benefits: JSON.stringify(['15% discount on all orders', 'Free shipping', 'Birthday bonus', 'Early access', 'VIP customer service']),
      },
    ];

    for (const tier of tiers) {
      await db.insert(loyaltyRewards).values(tier);
    }

    console.log('[Loyalty] Initialized default tiers');
  } catch (error) {
    console.error('[Loyalty] Failed to initialize tiers:', error);
  }
}

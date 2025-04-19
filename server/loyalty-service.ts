import { db } from "./db";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { 
  LoyaltyTier, LoyaltyReward, LoyaltyTransaction, LoyaltyAchievement, 
  UserAchievement, User, InsertLoyaltyTransaction,
  loyaltyTiers, loyaltyTransactions, users, loyaltyRewards, 
  loyaltyAchievements, userAchievements
} from "@shared/schema";

/**
 * Loyalty Service to handle all loyalty program operations
 */
export class LoyaltyService {
  /**
   * Add points to a user's loyalty account
   * @param userId User ID
   * @param amount Points to add (positive number)
   * @param reason Reason for adding points (booking, referral, etc.)
   * @param reference Optional reference to link to (e.g., booking ID)
   * @param expiresAt Optional expiration date for these points
   * @returns The created transaction and updated user
   */
  async addPoints(
    userId: number,
    amount: number,
    reason: string,
    reference?: string,
    expiresAt?: Date
  ): Promise<{ transaction: LoyaltyTransaction; user: User }> {
    // Validate amount is positive
    if (amount <= 0) {
      throw new Error("Points amount must be positive");
    }

    // Create transaction data
    const transactionData: InsertLoyaltyTransaction = {
      userId,
      amount,
      type: "earn",
      reason,
      reference,
      expiresAt,
    };

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Get user with their current tier
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Calculate point multiplier based on tier
      let multiplier = 1;
      if (user.loyaltyTierId) {
        const [tier] = await tx
          .select()
          .from(loyaltyTiers)
          .where(eq(loyaltyTiers.id, user.loyaltyTierId));
        
        if (tier) {
          multiplier = Number(tier.multiplier);
        }
      }

      // Apply multiplier to points (rounded to nearest integer)
      const adjustedAmount = Math.round(amount * multiplier);
      transactionData.amount = adjustedAmount;

      // Create the transaction
      const [transaction] = await tx
        .insert(loyaltyTransactions)
        .values(transactionData)
        .returning();

      // Update user's points
      const newTotalPoints = (user.totalPointsEarned || 0) + adjustedAmount;
      const newCurrentPoints = (user.loyaltyPoints || 0) + adjustedAmount;

      const [updatedUser] = await tx
        .update(users)
        .set({
          loyaltyPoints: newCurrentPoints,
          totalPointsEarned: newTotalPoints,
          lastActivityAt: new Date(),
          loyaltyJoinDate: user.loyaltyJoinDate || new Date(), // Set join date if not already set
        })
        .where(eq(users.id, userId))
        .returning();

      // Check if user should be promoted to a new tier
      const newTier = await this.checkAndUpdateTier(tx, updatedUser);

      return { transaction, user: updatedUser };
    });

    return result;
  }

  /**
   * Redeem points for a reward
   * @param userId User ID
   * @param rewardId Reward ID
   * @returns The created transaction, updated user, and redemption
   */
  async redeemReward(
    userId: number,
    rewardId: number
  ): Promise<{ transaction: LoyaltyTransaction; user: User; success: boolean }> {
    return await db.transaction(async (tx) => {
      // Get user
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Get reward
      const [reward] = await tx
        .select()
        .from(loyaltyRewards)
        .where(eq(loyaltyRewards.id, rewardId));

      if (!reward) {
        throw new Error(`Reward with ID ${rewardId} not found`);
      }

      // Check if reward is active
      if (!reward.active) {
        throw new Error("This reward is not currently available");
      }

      // Check if user has enough points
      if ((user.loyaltyPoints || 0) < reward.pointsCost) {
        throw new Error("Not enough points to redeem this reward");
      }

      // Check if user meets tier requirement
      if (reward.tierRequirement && (!user.loyaltyTierId || user.loyaltyTierId < reward.tierRequirement)) {
        throw new Error("Your loyalty tier is not high enough for this reward");
      }

      // Create transaction
      const [transaction] = await tx
        .insert(loyaltyTransactions)
        .values({
          userId,
          amount: -reward.pointsCost, // Negative amount for redemption
          type: "redeem",
          reason: "reward_redemption",
          reference: `reward:${reward.id}`,
        })
        .returning();

      // Update user's points
      const newPoints = (user.loyaltyPoints || 0) - reward.pointsCost;
      const [updatedUser] = await tx
        .update(users)
        .set({
          loyaltyPoints: newPoints,
          lastActivityAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      return { transaction, user: updatedUser, success: true };
    });
  }

  /**
   * Check if a user should be promoted to a new tier and update if necessary
   * @param tx Database transaction
   * @param user User to check
   * @returns The updated user if tier changed, or null if no change
   */
  private async checkAndUpdateTier(tx: any, user: User): Promise<User | null> {
    // Get all tiers ordered by threshold
    const tiers = await tx
      .select()
      .from(loyaltyTiers)
      .orderBy(loyaltyTiers.threshold);

    if (!tiers.length) return null;

    // Find the highest tier the user qualifies for
    let highestQualifyingTier: LoyaltyTier | null = null;
    for (const tier of tiers) {
      if ((user.totalPointsEarned || 0) >= tier.threshold) {
        highestQualifyingTier = tier;
      } else {
        break; // Stop once we hit a tier they don't qualify for
      }
    }

    // If no qualifying tier or already at correct tier, return null
    if (!highestQualifyingTier || (user.loyaltyTierId === highestQualifyingTier.id)) {
      return null;
    }

    // Update user's tier
    const [updatedUser] = await tx
      .update(users)
      .set({
        loyaltyTierId: highestQualifyingTier.id,
      })
      .where(eq(users.id, user.id))
      .returning();

    return updatedUser;
  }

  /**
   * Get a user's loyalty profile with tier information
   * @param userId User ID
   * @returns Loyalty profile with points, tier, and tier progress
   */
  async getLoyaltyProfile(userId: number): Promise<{
    user: User;
    tier: LoyaltyTier | null;
    nextTier: LoyaltyTier | null;
    pointsToNextTier: number;
    transactionHistory: LoyaltyTransaction[];
    availableRewards: LoyaltyReward[];
    achievements: (LoyaltyAchievement & { progress: number; awarded: boolean })[];
  }> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Get current tier
    let tier: LoyaltyTier | null = null;
    if (user.loyaltyTierId) {
      const [currentTier] = await db
        .select()
        .from(loyaltyTiers)
        .where(eq(loyaltyTiers.id, user.loyaltyTierId));
      tier = currentTier || null;
    }

    // Get next tier
    let nextTier: LoyaltyTier | null = null;
    let pointsToNextTier = 0;
    
    if (tier) {
      const [next] = await db
        .select()
        .from(loyaltyTiers)
        .where(gt(loyaltyTiers.threshold, tier.threshold))
        .orderBy(loyaltyTiers.threshold)
        .limit(1);
      
      nextTier = next || null;
      if (nextTier) {
        pointsToNextTier = Math.max(0, nextTier.threshold - (user.totalPointsEarned || 0));
      }
    } else {
      // If no current tier, get the first tier
      const [first] = await db
        .select()
        .from(loyaltyTiers)
        .orderBy(loyaltyTiers.threshold)
        .limit(1);
      
      nextTier = first || null;
      if (nextTier) {
        pointsToNextTier = Math.max(0, nextTier.threshold - (user.totalPointsEarned || 0));
      }
    }

    // Get transaction history
    const transactionHistory = await db
      .select()
      .from(loyaltyTransactions)
      .where(eq(loyaltyTransactions.userId, userId))
      .orderBy(sql`${loyaltyTransactions.createdAt} DESC`)
      .limit(10);

    // Get available rewards
    let rewardQuery = db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.active, true));

    // Filter by tier if user has a tier
    if (user.loyaltyTierId) {
      rewardQuery = rewardQuery.where(
        sql`${loyaltyRewards.tierRequirement} IS NULL OR ${loyaltyRewards.tierRequirement} <= ${user.loyaltyTierId}`
      );
    } else {
      rewardQuery = rewardQuery.where(sql`${loyaltyRewards.tierRequirement} IS NULL`);
    }

    const availableRewards = await rewardQuery;

    // Get user achievements
    const achievements = await db
      .select({
        ...loyaltyAchievements,
        progress: userAchievements.progress,
        awarded: sql<boolean>`CASE WHEN ${userAchievements.id} IS NOT NULL THEN true ELSE false END`
      })
      .from(loyaltyAchievements)
      .leftJoin(
        userAchievements,
        and(
          eq(userAchievements.achievementId, loyaltyAchievements.id),
          eq(userAchievements.userId, userId)
        )
      )
      .where(eq(loyaltyAchievements.active, true));

    return {
      user,
      tier,
      nextTier,
      pointsToNextTier,
      transactionHistory,
      availableRewards,
      achievements: achievements as any,
    };
  }

  /**
   * Initialize the loyalty tiers in the database
   */
  async initializeDefaultTiers(): Promise<LoyaltyTier[]> {
    // Check if tiers already exist
    const existingTiers = await db.select().from(loyaltyTiers);
    if (existingTiers.length > 0) {
      return existingTiers;
    }

    // Create default tiers
    const defaultTiers = [
      {
        name: "Bronze",
        threshold: 0,
        multiplier: "1",
        color: "#CD7F32",
        icon: "award",
        perks: "Earn 1x points on all bookings",
      },
      {
        name: "Silver",
        threshold: 1000,
        multiplier: "1.25",
        color: "#C0C0C0",
        icon: "award",
        perks: "Earn 1.25x points on all bookings • Priority booking",
      },
      {
        name: "Gold",
        threshold: 5000,
        multiplier: "1.5",
        color: "#FFD700",
        icon: "crown",
        perks: "Earn 1.5x points on all bookings • Priority booking • Exclusive rewards • Free style consultation",
      },
      {
        name: "Platinum",
        threshold: 10000,
        multiplier: "2",
        color: "#E5E4E2",
        icon: "diamond",
        perks: "Earn 2x points on all bookings • VIP treatment • Exclusive rewards • Free products • Birthday gift",
      },
    ];

    const insertedTiers = await db.insert(loyaltyTiers).values(defaultTiers).returning();
    return insertedTiers;
  }

  /**
   * Initialize default rewards in the database
   */
  async initializeDefaultRewards(): Promise<LoyaltyReward[]> {
    // Check if rewards already exist
    const existingRewards = await db.select().from(loyaltyRewards);
    if (existingRewards.length > 0) {
      return existingRewards;
    }

    // Get tier IDs
    const tiers = await db.select().from(loyaltyTiers);
    const tierMap = new Map<string, number>();
    tiers.forEach(tier => tierMap.set(tier.name, tier.id));

    // Create default rewards
    const defaultRewards = [
      {
        name: "10% Off Next Booking",
        description: "Receive 10% off your next appointment",
        pointsCost: 500,
        type: "discount",
        value: "10",
        active: true,
        imageUrl: "/images/rewards/discount.svg",
      },
      {
        name: "Free Edge Treatment",
        description: "Complimentary edge treatment with your next service",
        pointsCost: 750,
        type: "service",
        value: "edge_treatment",
        active: true,
        imageUrl: "/images/rewards/service.svg",
      },
      {
        name: "25% Off Next Booking",
        description: "Receive 25% off your next appointment",
        pointsCost: 1200,
        type: "discount",
        value: "25",
        active: true,
        tierRequirement: tierMap.get("Silver"),
        imageUrl: "/images/rewards/discount.svg",
      },
      {
        name: "Free Hair Product",
        description: "Choose a free hair product from our selection",
        pointsCost: 2000,
        type: "product",
        value: "hair_product",
        active: true,
        tierRequirement: tierMap.get("Gold"),
        imageUrl: "/images/rewards/product.svg",
      },
      {
        name: "50% Off Next Booking",
        description: "Receive 50% off your next appointment",
        pointsCost: 3500,
        type: "discount",
        value: "50",
        active: true,
        tierRequirement: tierMap.get("Platinum"),
        imageUrl: "/images/rewards/discount.svg",
      },
    ];

    const insertedRewards = await db.insert(loyaltyRewards).values(defaultRewards).returning();
    return insertedRewards;
  }

  /**
   * Initialize default achievements in the database
   */
  async initializeDefaultAchievements(): Promise<LoyaltyAchievement[]> {
    // Check if achievements already exist
    const existingAchievements = await db.select().from(loyaltyAchievements);
    if (existingAchievements.length > 0) {
      return existingAchievements;
    }

    // Create default achievements
    const defaultAchievements = [
      {
        name: "First Appointment",
        description: "Complete your first appointment",
        type: "booking_count",
        threshold: 1,
        pointsReward: 100,
        icon: "scissors",
        active: true,
      },
      {
        name: "Loyal Customer",
        description: "Complete 5 appointments",
        type: "booking_count",
        threshold: 5,
        pointsReward: 300,
        icon: "repeat",
        active: true,
      },
      {
        name: "Super Fan",
        description: "Complete 10 appointments",
        type: "booking_count",
        threshold: 10,
        pointsReward: 500,
        icon: "star",
        active: true,
      },
      {
        name: "Refer a Friend",
        description: "Refer a friend who makes a booking",
        type: "referral",
        threshold: 1,
        pointsReward: 200,
        icon: "users",
        active: true,
      },
      {
        name: "Referral Pro",
        description: "Refer 3 friends who make bookings",
        type: "referral",
        threshold: 3,
        pointsReward: 500,
        icon: "award",
        active: true,
      },
      {
        name: "Social Sharer",
        description: "Share your hairstyle on social media and tag us",
        type: "social",
        threshold: 1,
        pointsReward: 150,
        icon: "share",
        active: true,
      },
      {
        name: "Spending Spree",
        description: "Spend a total of $500 at our salon",
        type: "spending",
        threshold: 500,
        pointsReward: 250,
        icon: "dollar-sign",
        active: true,
      },
    ];

    const insertedAchievements = await db
      .insert(loyaltyAchievements)
      .values(defaultAchievements)
      .returning();
    return insertedAchievements;
  }

  /**
   * Award an achievement to a user
   * @param userId User ID
   * @param achievementId Achievement ID
   * @returns The awarded achievement and transaction (if points were awarded)
   */
  async awardAchievement(
    userId: number,
    achievementId: number
  ): Promise<{ achievement: UserAchievement; transaction: LoyaltyTransaction | null }> {
    return db.transaction(async (tx) => {
      // Check if user already has this achievement
      const existingAchievements = await tx
        .select()
        .from(userAchievements)
        .where(
          and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievementId)
          )
        );

      if (existingAchievements.length > 0) {
        throw new Error("User already has this achievement");
      }

      // Get the achievement details
      const [achievement] = await tx
        .select()
        .from(loyaltyAchievements)
        .where(eq(loyaltyAchievements.id, achievementId));

      if (!achievement) {
        throw new Error(`Achievement with ID ${achievementId} not found`);
      }

      // Award the achievement
      const [userAchievement] = await tx
        .insert(userAchievements)
        .values({
          userId,
          achievementId,
          progress: achievement.threshold,
        })
        .returning();

      // If achievement awards points, create a transaction
      let transaction = null;
      if (achievement.pointsReward > 0) {
        // Create loyalty service with the transaction
        const loyaltyService = new LoyaltyService();
        const result = await loyaltyService.addPoints(
          userId,
          achievement.pointsReward,
          "achievement",
          `achievement:${achievement.id}`
        );
        transaction = result.transaction;
      }

      return { achievement: userAchievement, transaction };
    });
  }

  /**
   * Update a user's progress toward an achievement
   * @param userId User ID
   * @param achievementId Achievement ID
   * @param progress Progress value
   * @returns The updated achievement progress and whether it was awarded
   */
  async updateAchievementProgress(
    userId: number,
    achievementId: number,
    progress: number
  ): Promise<{ achievement: UserAchievement; awarded: boolean }> {
    return db.transaction(async (tx) => {
      // Get the achievement details
      const [achievement] = await tx
        .select()
        .from(loyaltyAchievements)
        .where(eq(loyaltyAchievements.id, achievementId));

      if (!achievement) {
        throw new Error(`Achievement with ID ${achievementId} not found`);
      }

      // Check if user already has this achievement
      const existingAchievements = await tx
        .select()
        .from(userAchievements)
        .where(
          and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievementId)
          )
        );

      // If the user already has the achievement, just return it
      if (existingAchievements.length > 0) {
        const existing = existingAchievements[0];
        // If already awarded, return without updating
        if (existing.progress >= achievement.threshold) {
          return { achievement: existing, awarded: true };
        }

        // Update progress
        const newProgress = existing.progress + progress;
        const awarded = newProgress >= achievement.threshold;

        const [updated] = await tx
          .update(userAchievements)
          .set({
            progress: newProgress,
            // If progress reached threshold, set awarded date
            awardedAt: awarded ? new Date() : existing.awardedAt,
          })
          .where(eq(userAchievements.id, existing.id))
          .returning();

        // If newly awarded, give points
        if (awarded && achievement.pointsReward > 0) {
          // Create loyalty service with the transaction
          const loyaltyService = new LoyaltyService();
          await loyaltyService.addPoints(
            userId,
            achievement.pointsReward,
            "achievement",
            `achievement:${achievement.id}`
          );
        }

        return { achievement: updated, awarded };
      } else {
        // Create new progress entry
        const awarded = progress >= achievement.threshold;
        const [created] = await tx
          .insert(userAchievements)
          .values({
            userId,
            achievementId,
            progress,
            awardedAt: awarded ? new Date() : null,
          })
          .returning();

        // If awarded on creation, give points
        if (awarded && achievement.pointsReward > 0) {
          // Create loyalty service with the transaction
          const loyaltyService = new LoyaltyService();
          await loyaltyService.addPoints(
            userId,
            achievement.pointsReward,
            "achievement",
            `achievement:${achievement.id}`
          );
        }

        return { achievement: created, awarded };
      }
    });
  }
}

// Create and export a singleton instance
export const loyaltyService = new LoyaltyService();
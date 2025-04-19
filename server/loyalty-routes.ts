import { Router } from "express";
import { z } from "zod";
import { loyaltyService } from "./loyalty-service";

const loyaltyRouter = Router();

// Auth middleware to ensure user is logged in
const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Get user's loyalty profile
loyaltyRouter.get("/profile", ensureAuthenticated, async (req, res) => {
  try {
    const profile = await loyaltyService.getLoyaltyProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Redeem a reward
loyaltyRouter.post("/redeem", ensureAuthenticated, async (req, res) => {
  try {
    const schema = z.object({
      rewardId: z.number(),
    });

    const { rewardId } = schema.parse(req.body);
    const result = await loyaltyService.redeemReward(req.user.id, rewardId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// For admin: initialize default tiers
loyaltyRouter.post("/init-tiers", ensureAuthenticated, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tiers = await loyaltyService.initializeDefaultTiers();
    res.json(tiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// For admin: initialize default rewards
loyaltyRouter.post("/init-rewards", ensureAuthenticated, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const rewards = await loyaltyService.initializeDefaultRewards();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// For admin: initialize default achievements
loyaltyRouter.post("/init-achievements", ensureAuthenticated, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const achievements = await loyaltyService.initializeDefaultAchievements();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// For admin: add points to a user
loyaltyRouter.post("/add-points", ensureAuthenticated, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const schema = z.object({
      userId: z.number(),
      amount: z.number().positive(),
      reason: z.string(),
      reference: z.string().optional(),
    });

    const { userId, amount, reason, reference } = schema.parse(req.body);
    const result = await loyaltyService.addPoints(userId, amount, reason, reference);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all loyalty tiers
loyaltyRouter.get("/tiers", async (req, res) => {
  try {
    const tiers = await loyaltyService.initializeDefaultTiers();
    res.json(tiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rewards
loyaltyRouter.get("/rewards", async (req, res) => {
  try {
    const rewards = await loyaltyService.initializeDefaultRewards();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default loyaltyRouter;
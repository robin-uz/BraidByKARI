import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useQuery } from "@tanstack/react-query";
import { LoyaltyTier, LoyaltyReward, LoyaltyTransaction } from "@shared/schema";
import { Loader2, Award, Crown, Diamond, Gift, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistance } from "date-fns";

// Define types for the loyalty profile response
interface LoyaltyProfile {
  user: {
    id: number;
    username: string;
    email: string;
    loyaltyPoints: number;
    totalPointsEarned: number;
    loyaltyJoinDate: string;
    lastActivityAt: string;
  };
  tier: LoyaltyTier | null;
  nextTier: LoyaltyTier | null;
  pointsToNextTier: number;
  transactionHistory: LoyaltyTransaction[];
  availableRewards: LoyaltyReward[];
  achievements: Array<{
    id: number;
    name: string;
    description: string;
    type: string;
    threshold: number;
    pointsReward: number;
    icon: string | null;
    active: boolean;
    createdAt: string;
    progress: number;
    awarded: boolean;
  }>;
}

export default function LoyaltyPage() {
  const { session, user } = useSupabaseAuth();
  const { toast } = useToast();

  // Query to fetch the user's loyalty profile
  const { data: profile, isLoading, error } = useQuery<LoyaltyProfile>({
    queryKey: ["/api/loyalty/profile"],
    enabled: !!session,
  });

  // Mutation to redeem a reward
  const redeemReward = async (rewardId: number) => {
    try {
      await apiRequest("POST", "/api/loyalty/redeem", { rewardId });
      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been successfully redeemed.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty/profile"] });
    } catch (error: any) {
      toast({
        title: "Redemption Failed",
        description: error.message || "There was an error redeeming your reward.",
        variant: "destructive",
      });
    }
  };

  // Helper to get tier icon
  const getTierIcon = (tierName: string | undefined) => {
    if (!tierName) return <Award className="h-6 w-6" />;
    
    switch (tierName.toLowerCase()) {
      case "gold":
        return <Crown className="h-6 w-6 text-amber-400" />;
      case "platinum":
        return <Diamond className="h-6 w-6 text-slate-300" />;
      case "silver":
        return <Award className="h-6 w-6 text-gray-400" />;
      default:
        return <Award className="h-6 w-6 text-amber-700" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-kari-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
        <p className="text-gray-500 mb-4">We couldn't load your loyalty information.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/loyalty/profile"] })}>
          Try Again
        </Button>
      </div>
    );
  }

  // If user is not logged in
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4">Login Required</h1>
        <p className="text-gray-500 mb-4">Please log in to access the loyalty program.</p>
        <Button href="/auth" asChild>
          <a>Login or Register</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold font-serif mb-2">KARI STYLEZ Rewards</h1>
      <p className="text-lg mb-8 text-gray-500">Earn points, unlock rewards, rise through tiers</p>

      {/* Points & Tier Overview */}
      <Card className="mb-8 border-kari-gold/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {profile?.tier ? getTierIcon(profile.tier.name) : <Award className="h-6 w-6" />}
            <span>{profile?.tier?.name || "Bronze"} Tier</span>
          </CardTitle>
          <CardDescription>
            Member since {profile?.user.loyaltyJoinDate 
              ? new Date(profile.user.loyaltyJoinDate).toLocaleDateString() 
              : "recently"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Available Points</p>
              <p className="text-4xl font-bold text-kari-gold">
                {profile?.user.loyaltyPoints || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total earned: {profile?.user.totalPointsEarned || 0}
              </p>
            </div>
            
            {profile?.nextTier && (
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Next Tier: {profile.nextTier.name}</p>
                  <p className="text-sm text-gray-500">
                    {profile.pointsToNextTier} points to go
                  </p>
                </div>
                <Progress 
                  value={Math.max(
                    5, 
                    100 - (profile.pointsToNextTier / profile.nextTier.threshold) * 100
                  )} 
                  className="h-2 mb-2"
                />
                <p className="text-xs text-gray-500">
                  {profile.tier?.perks || "Standard benefits"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <h2 className="text-2xl font-semibold font-serif mb-4">Available Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {profile?.availableRewards && profile.availableRewards.length > 0 ? (
          profile.availableRewards.map((reward) => (
            <Card key={reward.id} className="overflow-hidden hover:shadow-md transition-shadow border-kari-gold/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{reward.name}</CardTitle>
                <CardDescription>{reward.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <Badge variant="outline" className="mb-2 bg-kari-gold/10">
                  {reward.pointsCost} points
                </Badge>
                {reward.tierRequirement && (
                  <Badge variant="secondary" className="ml-2 mb-2">
                    {profile.tier?.name} Tier+
                  </Badge>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  onClick={() => redeemReward(reward.id)}
                  disabled={(profile?.user.loyaltyPoints || 0) < reward.pointsCost}
                  className="w-full bg-kari-gold hover:bg-amber-600"
                >
                  {(profile?.user.loyaltyPoints || 0) >= reward.pointsCost 
                    ? "Redeem Reward" 
                    : `Need ${reward.pointsCost - (profile?.user.loyaltyPoints || 0)} more points`}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <Gift className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No rewards available at the moment.</p>
          </div>
        )}
      </div>

      {/* Achievements */}
      <h2 className="text-2xl font-semibold font-serif mb-4">Your Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {profile?.achievements && profile.achievements.length > 0 ? (
          profile.achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`overflow-hidden transition-shadow ${
                achievement.awarded 
                  ? "border-kari-gold shadow" 
                  : "border-gray-200"
              }`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className={achievement.awarded ? "text-kari-gold" : "text-gray-400"}>
                    {achievement.name}
                  </span>
                </CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Progress 
                    value={(achievement.progress / achievement.threshold) * 100} 
                    className="h-2 flex-grow mr-4"
                  />
                  <span className="text-sm font-medium">
                    {achievement.progress}/{achievement.threshold}
                  </span>
                </div>
                {achievement.awarded && (
                  <p className="text-sm text-kari-gold mt-2">
                    +{achievement.pointsReward} points earned
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">Complete tasks to earn achievements.</p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <h2 className="text-2xl font-semibold font-serif mb-4">Points History</h2>
      <Card className="border-kari-gold/20">
        <CardContent className="pt-6">
          {profile?.transactionHistory && profile.transactionHistory.length > 0 ? (
            <div className="space-y-4">
              {profile.transactionHistory.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium capitalize">
                      {transaction.reason.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.createdAt ? (
                        formatDistance(new Date(transaction.createdAt), new Date(), { addSuffix: true })
                      ) : 'Recently'}
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No transaction history yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
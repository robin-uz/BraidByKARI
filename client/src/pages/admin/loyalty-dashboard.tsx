import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LoyaltyTier, LoyaltyReward, LoyaltyAchievement } from "@shared/schema";
import { Loader2, Plus, Award, Settings, Users, Gift, Target } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the add points form schema
const addPointsSchema = z.object({
  userId: z.number({
    required_error: "User ID is required",
  }),
  amount: z.number({
    required_error: "Amount is required",
  }).min(1, {
    message: "Amount must be at least 1 point",
  }),
  reason: z.string({
    required_error: "Reason is required",
  }).min(3, {
    message: "Reason must be at least 3 characters",
  }),
  reference: z.string().optional(),
});

type AddPointsFormValues = z.infer<typeof addPointsSchema>;

export default function LoyaltyDashboard() {
  const { session, user } = useSupabaseAuth();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Form for adding points
  const form = useForm<AddPointsFormValues>({
    resolver: zodResolver(addPointsSchema),
    defaultValues: {
      userId: 0,
      amount: 100,
      reason: "",
      reference: "",
    },
  });

  // Query to fetch loyalty tiers
  const { data: tiers, isLoading: loadingTiers } = useQuery<LoyaltyTier[]>({
    queryKey: ["/api/loyalty/tiers"],
    enabled: !!session && user?.role === "admin",
  });

  // Query to fetch loyalty rewards
  const { data: rewards, isLoading: loadingRewards } = useQuery<LoyaltyReward[]>({
    queryKey: ["/api/loyalty/rewards"],
    enabled: !!session && user?.role === "admin",
  });

  // Query to fetch users with loyalty data
  const { data: users, isLoading: loadingUsers } = useQuery<any[]>({
    queryKey: ["/api/users"],
    enabled: !!session && user?.role === "admin",
  });

  // Mutation to initialize tiers
  const initTiersMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/loyalty/init-tiers");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Loyalty tiers have been initialized.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty/tiers"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize tiers.",
        variant: "destructive",
      });
    },
  });

  // Mutation to initialize rewards
  const initRewardsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/loyalty/init-rewards");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Loyalty rewards have been initialized.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty/rewards"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize rewards.",
        variant: "destructive",
      });
    },
  });

  // Mutation to initialize achievements
  const initAchievementsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/loyalty/init-achievements");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Loyalty achievements have been initialized.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize achievements.",
        variant: "destructive",
      });
    },
  });

  // Mutation to add points to a user
  const addPointsMutation = useMutation({
    mutationFn: async (data: AddPointsFormValues) => {
      const response = await apiRequest("POST", "/api/loyalty/add-points", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Points have been added to the user.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add points.",
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  function onSubmit(data: AddPointsFormValues) {
    addPointsMutation.mutate(data);
  }

  // If not admin, show access denied
  if (session && user?.role !== "admin") {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-4">
          You do not have permission to access the loyalty dashboard.
        </p>
      </div>
    );
  }

  // Loading state
  if (loadingTiers || loadingRewards || loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-kari-gold" />
      </div>
    );
  }

  // Check if user is logged in
  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">Login Required</h1>
        <p className="text-gray-500 mb-4">
          Please log in to access the loyalty dashboard.
        </p>
        <Button asChild>
          <Link href="/auth">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold font-serif mb-2">Loyalty Program Management</h1>
      <p className="text-lg mb-8 text-gray-500">
        Manage loyalty tiers, rewards, and user points
      </p>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="tiers" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Tiers</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span>Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Setup</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User List */}
            <div className="md:col-span-2">
              <Card className="border-kari-gold/20">
                <CardHeader>
                  <CardTitle>Loyalty Users</CardTitle>
                  <CardDescription>
                    View and manage user loyalty points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <div 
                          key={user.id} 
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedUserId === user.id ? 'bg-kari-gold/10' : 'hover:bg-muted'
                          }`}
                          onClick={() => {
                            setSelectedUserId(user.id);
                            form.setValue('userId', user.id);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{user.username || user.email}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <Badge variant="outline" className="bg-kari-gold/10">
                              {user.loyaltyPoints || 0} points
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              Tier: {user.loyaltyTierName || "Bronze"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Total: {user.totalPointsEarned || 0}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No users found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add Points Form */}
            <div>
              <Card className="border-kari-gold/20">
                <CardHeader>
                  <CardTitle>Add Points</CardTitle>
                  <CardDescription>
                    Award loyalty points to users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User ID</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                disabled={true}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Select a user from the list
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Points</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number"
                                min="1"
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Number of points to award
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Booking, Referral, Promotion" />
                            </FormControl>
                            <FormDescription>
                              Reason for awarding points
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reference (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Order #123" />
                            </FormControl>
                            <FormDescription>
                              Optional reference ID
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-kari-gold hover:bg-amber-600"
                        disabled={addPointsMutation.isPending || !selectedUserId}
                      >
                        {addPointsMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Add Points"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers && tiers.length > 0 ? (
              tiers.map((tier) => (
                <Card key={tier.id} className="border-kari-gold/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle 
                        className="flex items-center gap-2"
                        style={{ color: tier.color || undefined }}
                      >
                        <Award className="h-5 w-5" />
                        <span>{tier.name}</span>
                      </CardTitle>
                      <Badge variant="outline" className="bg-kari-gold/10">
                        {tier.threshold} points
                      </Badge>
                    </div>
                    <CardDescription>Multiply points by {tier.multiplier}x</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{tier.perks}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" disabled>
                      Edit Tier
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-4">No tiers found. Initialize the default tiers to get started.</p>
                <Button 
                  onClick={() => initTiersMutation.mutate()}
                  className="bg-kari-gold hover:bg-amber-600"
                  disabled={initTiersMutation.isPending}
                >
                  {initTiersMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    "Initialize Default Tiers"
                  )}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards && rewards.length > 0 ? (
              rewards.map((reward) => (
                <Card key={reward.id} className="border-kari-gold/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <Badge variant="outline" className="bg-kari-gold/10">
                        {reward.pointsCost} points
                      </Badge>
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        Type: {reward.type}
                      </Badge>
                      {reward.tierRequirement && (
                        <Badge variant="secondary">
                          Tier required
                        </Badge>
                      )}
                      <Badge variant={reward.active ? "default" : "destructive"}>
                        {reward.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" disabled>
                      Edit Reward
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-4">No rewards found. Initialize the default rewards to get started.</p>
                <Button 
                  onClick={() => initRewardsMutation.mutate()}
                  className="bg-kari-gold hover:bg-amber-600"
                  disabled={initRewardsMutation.isPending || !tiers || tiers.length === 0}
                >
                  {initRewardsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    "Initialize Default Rewards"
                  )}
                </Button>
                {(!tiers || tiers.length === 0) && (
                  <p className="text-sm text-gray-500 mt-2">
                    You need to initialize tiers first before setting up rewards.
                  </p>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Setup Tab */}
        <TabsContent value="setup">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-kari-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>System Configuration</span>
                </CardTitle>
                <CardDescription>
                  Initialize and manage the loyalty program components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium">Loyalty Tiers</p>
                    <p className="text-sm text-gray-500">
                      Initialize Bronze, Silver, Gold and Platinum tiers
                    </p>
                  </div>
                  <Button 
                    onClick={() => initTiersMutation.mutate()}
                    className="bg-kari-gold hover:bg-amber-600"
                    disabled={initTiersMutation.isPending}
                  >
                    {initTiersMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Initialize"
                    )}
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium">Loyalty Rewards</p>
                    <p className="text-sm text-gray-500">
                      Initialize default rewards for each tier
                    </p>
                  </div>
                  <Button 
                    onClick={() => initRewardsMutation.mutate()}
                    className="bg-kari-gold hover:bg-amber-600"
                    disabled={initRewardsMutation.isPending || !tiers || tiers.length === 0}
                  >
                    {initRewardsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Initialize"
                    )}
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium">Achievements</p>
                    <p className="text-sm text-gray-500">
                      Initialize badges and achievements
                    </p>
                  </div>
                  <Button 
                    onClick={() => initAchievementsMutation.mutate()}
                    className="bg-kari-gold hover:bg-amber-600"
                    disabled={initAchievementsMutation.isPending}
                  >
                    {initAchievementsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Initialize"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-kari-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span>Loyalty Program Stats</span>
                </CardTitle>
                <CardDescription>
                  Overview of the loyalty program metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-kari-gold">
                      {users?.length || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium mb-1">Total Rewards</p>
                    <p className="text-3xl font-bold text-kari-gold">
                      {rewards?.length || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium mb-1">Total Tiers</p>
                    <p className="text-3xl font-bold text-kari-gold">
                      {tiers?.length || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium mb-1">Points Issued</p>
                    <p className="text-3xl font-bold text-kari-gold">
                      {users?.reduce((sum, user) => sum + (user.totalPointsEarned || 0), 0) || 0}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Tier Distribution</h3>
                  {tiers && tiers.length > 0 && users && users.length > 0 ? (
                    <div className="space-y-2">
                      {tiers.map(tier => {
                        const usersInTier = users.filter(u => u.loyaltyTierId === tier.id).length;
                        const percentage = users.length > 0 ? (usersInTier / users.length) * 100 : 0;
                        
                        return (
                          <div key={tier.id}>
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-medium">{tier.name}</p>
                              <p className="text-sm text-gray-500">
                                {usersInTier} users ({percentage.toFixed(1)}%)
                              </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-kari-gold h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                      {/* Add users without a tier (Bronze by default) */}
                      {(() => {
                        const usersWithoutTier = users.filter(u => !u.loyaltyTierId).length;
                        const percentage = users.length > 0 ? (usersWithoutTier / users.length) * 100 : 0;
                        
                        return (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-medium">Bronze (Default)</p>
                              <p className="text-sm text-gray-500">
                                {usersWithoutTier} users ({percentage.toFixed(1)}%)
                              </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-amber-700 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No data available. Set up the loyalty program first.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
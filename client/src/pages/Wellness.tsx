import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BiometricCard from "@/components/BiometricCard";
import AICoach from "@/components/AICoach";

interface WellnessActivity {
  id: string;
  type: string;
  name: string;
  duration?: number;
  intensity?: string;
  mood?: string;
  completedAt: Date;
  karmaEarned: number;
}

interface EnvironmentalImpact {
  id: string;
  carbonOffset: number;
  waterSaved: number;
  treesPlanted: number;
  activityType: string;
  description: string;
  recordedAt: Date;
}

export default function Wellness() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState("");

  // Fetch biometric history
  const { data: biometricHistory = [] } = useQuery<any[]>({
    queryKey: ["/api/biometrics/history"],
    enabled: !!user,
  });

  // Fetch wellness activities
  const { data: activities = [] } = useQuery<WellnessActivity[]>({
    queryKey: ["/api/wellness/activities"],
    enabled: !!user,
  });

  // Fetch environmental impact
  const { data: environmentalImpact = [] } = useQuery<EnvironmentalImpact[]>({
    queryKey: ["/api/environmental/impact"],
    enabled: !!user,
  });

  // Activity completion mutation
  const activityMutation = useMutation({
    mutationFn: (activity: { type: string; name: string; duration?: number; intensity?: string }) =>
      apiRequest("POST", "/api/wellness/activities", activity),
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Activity Completed!",
        description: `Great job! You earned ${result.karmaEarned} karma points.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wellness/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  // Environmental impact mutation
  const environmentalMutation = useMutation({
    mutationFn: (impact: { activityType: string; description: string; carbonOffset?: number; waterSaved?: number; treesPlanted?: number }) =>
      apiRequest("POST", "/api/environmental/impact", impact),
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Environmental Impact Logged!",
        description: `Thank you for helping the planet! Earned ${result.karmaEarned} karma points.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/environmental/impact"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const wellnessActivities = [
    {
      type: "meditation",
      name: "Morning Meditation",
      duration: 15,
      intensity: "low",
      icon: "fa-leaf",
      color: "from-sage-500 to-emerald-500",
      description: "Start your day with mindfulness",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      type: "workout",
      name: "HIIT Workout",
      duration: 20,
      intensity: "high",
      icon: "fa-dumbbell",
      color: "from-red-500 to-pink-500",
      description: "High-intensity interval training",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      type: "breathing",
      name: "4-7-8 Breathing",
      duration: 5,
      intensity: "low",
      icon: "fa-wind",
      color: "from-blue-500 to-cyan-500",
      description: "Relaxation breathing technique",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      type: "journaling",
      name: "Gratitude Journal",
      duration: 10,
      intensity: "low",
      icon: "fa-pen",
      color: "from-amber-500 to-orange-500",
      description: "Reflect on positive moments",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
  ];

  const handleCompleteActivity = (activity: typeof wellnessActivities[0]) => {
    activityMutation.mutate({
      type: activity.type,
      name: activity.name,
      duration: activity.duration,
      intensity: activity.intensity,
    });
  };

  const handleEnvironmentalAction = (type: string) => {
    const impacts = {
      transport: { carbonOffset: 2.5, description: "Used eco-friendly transportation" },
      consumption: { waterSaved: 15, description: "Mindful consumption choices" },
      tree_planting: { treesPlanted: 1, description: "Participated in tree planting initiative" },
    };

    const impact = impacts[type as keyof typeof impacts];
    if (impact) {
      environmentalMutation.mutate({
        activityType: type,
        ...impact,
      });
    }
  };

  // Calculate wellness score based on recent activities
  const calculateWellnessScore = () => {
    if (!activities || activities.length === 0) return 0;
    
    const recentActivities = activities.slice(0, 7); // Last 7 activities
    const totalKarma = recentActivities.reduce((sum: number, activity: WellnessActivity) => sum + activity.karmaEarned, 0);
    return Math.min(Math.floor(totalKarma / 10), 100);
  };

  const wellnessScore = calculateWellnessScore();

  // Calculate environmental totals
  const environmentalTotals = environmentalImpact?.reduce(
    (totals: any, impact: EnvironmentalImpact) => ({
      carbonOffset: totals.carbonOffset + (parseFloat(impact.carbonOffset?.toString() || "0")),
      waterSaved: totals.waterSaved + (parseFloat(impact.waterSaved?.toString() || "0")),
      treesPlanted: totals.treesPlanted + impact.treesPlanted,
    }),
    { carbonOffset: 0, waterSaved: 0, treesPlanted: 0 }
  ) || { carbonOffset: 0, waterSaved: 0, treesPlanted: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900 nature:from-sage-50 nature:via-emerald-50 nature:to-sage-100 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-slate-800 dark:text-white mb-4">
            Your Wellness Dashboard
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Comprehensive health tracking powered by AI insights and biometric integration
          </p>
        </div>

        {/* Wellness Score */}
        <div className="glassmorphism rounded-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-playfair font-semibold text-slate-800 dark:text-white mb-2">
              Overall Wellness Score
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-sage-500 to-ocean-500 bg-clip-text text-transparent">
                {wellnessScore}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <p className="text-sm">out of 100</p>
                <p className="text-xs">Based on recent activities</p>
              </div>
            </div>
            <Progress value={wellnessScore} className="w-full max-w-md mx-auto mt-4" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <i className="fas fa-trophy text-3xl text-amber-500 mb-2"></i>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {activities?.length || 0}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Activities Completed</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <i className="fas fa-calendar-check text-3xl text-sage-500 mb-2"></i>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {Math.floor((activities?.length || 0) / 7)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Weeks Active</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <i className="fas fa-leaf text-3xl text-emerald-500 mb-2"></i>
              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                {environmentalTotals.treesPlanted}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Trees Planted</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biometric Overview */}
            {biometricHistory && biometricHistory.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <BiometricCard
                  title="Avg Heart Rate"
                  value={Math.round(biometricHistory.reduce((sum: number, b: any) => sum + (b.heartRate || 0), 0) / biometricHistory.length) || "--"}
                  unit="BPM"
                  icon="fa-heartbeat"
                  color="from-red-500 to-pink-500"
                  progress={70}
                />
                <BiometricCard
                  title="Sleep Quality"
                  value={Math.round(biometricHistory.reduce((sum: number, b: any) => sum + (b.sleepQuality || 0), 0) / biometricHistory.length) || "--"}
                  unit="%"
                  icon="fa-bed"
                  color="from-blue-500 to-cyan-500"
                  progress={85}
                />
                <BiometricCard
                  title="Stress Level"
                  value={Math.round(biometricHistory.reduce((sum: number, b: any) => sum + (b.stressLevel || 0), 0) / biometricHistory.length) || "--"}
                  unit="%"
                  icon="fa-brain"
                  color="from-yellow-500 to-orange-500"
                  progress={25}
                />
                <BiometricCard
                  title="Avg Steps"
                  value={Math.round(biometricHistory.reduce((sum: number, b: any) => sum + (b.steps || 0), 0) / biometricHistory.length) || "--"}
                  unit="steps"
                  icon="fa-running"
                  color="from-sage-500 to-emerald-500"
                  progress={82}
                />
              </div>
            )}

            {/* Wellness Activities */}
            <div className="glassmorphism rounded-xl p-8">
              <h3 className="text-2xl font-playfair font-semibold text-slate-800 dark:text-white mb-6">
                Today's Wellness Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wellnessActivities.map((activity) => (
                  <div 
                    key={activity.type}
                    className="group cursor-pointer"
                    onClick={() => handleCompleteActivity(activity)}
                    data-testid={`wellness-activity-${activity.type}`}
                  >
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img 
                        src={activity.image} 
                        alt={activity.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white px-2 py-1 rounded-full text-xs font-medium">
                        {activity.duration} min
                      </div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <h4 className="font-semibold">{activity.name}</h4>
                        <p className="text-sm opacity-90">{activity.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center`}>
                          <i className={`fas ${activity.icon} text-white text-sm`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white text-sm">{activity.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{activity.intensity} intensity</p>
                        </div>
                      </div>
                      {activityMutation.isPending && selectedActivity === activity.type ? (
                        <i className="fas fa-spinner animate-spin text-sage-500"></i>
                      ) : (
                        <i className="fas fa-play text-sage-500 group-hover:scale-110 transition-transform"></i>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Impact Tracking */}
            <div className="glassmorphism rounded-xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-playfair font-semibold text-slate-800 dark:text-white mb-4">
                  Environmental Wellness Impact
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your wellness journey contributes to global environmental health
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-sage-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-tree text-white text-2xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-sage-600 mb-2">
                    {environmentalTotals.carbonOffset.toFixed(1)} lbs
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Carbon offset</p>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnvironmentalAction("transport")}
                    data-testid="log-transport-action"
                    className="border-sage-500 text-sage-600 hover:bg-sage-50"
                  >
                    Log Transport
                  </Button>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-ocean-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-water text-white text-2xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-ocean-600 mb-2">
                    {environmentalTotals.waterSaved.toFixed(0)} gal
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Water conservation</p>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnvironmentalAction("consumption")}
                    data-testid="log-consumption-action"
                    className="border-ocean-500 text-ocean-600 hover:bg-ocean-50"
                  >
                    Log Conservation
                  </Button>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-seedling text-white text-2xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-amber-600 mb-2">
                    {environmentalTotals.treesPlanted}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Trees planted</p>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnvironmentalAction("tree_planting")}
                    data-testid="log-tree-planting-action"
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    Plant Tree
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Your wellness actions fund reforestation and environmental initiatives
                </p>
                <Button 
                  variant="outline"
                  data-testid="view-environmental-report"
                  className="border-sage-500 text-sage-600 hover:bg-sage-50"
                >
                  View Full Environmental Report
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* AI Coach */}
            <AICoach />

            {/* Recent Activities */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Recent Activities
                </h3>
                <div className="space-y-3">
                  {activities?.slice(0, 5).map((activity: WellnessActivity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {activity.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(activity.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-sage-600">
                          +{activity.karmaEarned}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {activity.duration}min
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
                      Complete an activity to see your progress!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AR/VR Experience Preview */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Immersive Experiences
                </h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1617469165786-8007eda41999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200" 
                        alt="Virtual forest meditation"
                        className="w-full h-24 object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-2 right-2 bg-lavender-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        AR
                      </div>
                      <div className="absolute bottom-2 left-2 text-white">
                        <h4 className="font-semibold text-sm">Virtual Forest</h4>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      data-testid="start-ar-meditation"
                      className="w-full mt-2 bg-gradient-to-r from-lavender-500 to-sage-500 hover:from-lavender-600 hover:to-sage-600"
                    >
                      Start AR Meditation
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="relative overflow-hidden rounded-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200" 
                        alt="AI personal trainer"
                        className="w-full h-24 object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-2 right-2 bg-ocean-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        AI
                      </div>
                      <div className="absolute bottom-2 left-2 text-white">
                        <h4 className="font-semibold text-sm">AI Trainer</h4>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      data-testid="start-ai-workout"
                      className="w-full mt-2 bg-gradient-to-r from-ocean-500 to-sage-500 hover:from-ocean-600 hover:to-sage-600"
                    >
                      Start AI Workout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

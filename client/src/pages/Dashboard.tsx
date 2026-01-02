import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { websocket } from "@/lib/websocket";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BiometricCard from "@/components/BiometricCard";
import AICoach from "@/components/AICoach";
import CrisisSupport from "@/components/CrisisSupport";

interface BiometricData {
  heartRate?: number;
  sleepHours?: number;
  sleepQuality?: number;
  stressLevel?: number;
  steps?: number;
  mood?: string;
}

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

interface GlobalStats {
  totalUsers: number;
  activeToday: number;
  totalKarma: number;
  totalActivities: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [biometricData, setBiometricData] = useState<BiometricData>({});

  // Fetch latest biometrics
  const { data: latestBiometrics = {} as BiometricData } = useQuery<BiometricData>({
    queryKey: ["/api/biometrics/latest"],
    enabled: !!user,
  });

  // Fetch recent activities
  const { data: recentActivities = [] as WellnessActivity[] } = useQuery<WellnessActivity[]>({
    queryKey: ["/api/wellness/activities"],
    enabled: !!user,
  });

  // Fetch global stats
  const { data: globalStats = { totalUsers: 0, activeToday: 0, totalKarma: 0, totalActivities: 0 } } = useQuery<GlobalStats>({
    queryKey: ["/api/analytics/global"],
  });

  // Biometric submission mutation
  const biometricMutation = useMutation({
    mutationFn: (data: BiometricData) => apiRequest("POST", "/api/biometrics", data),
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Biometrics Updated",
        description: `Wellness analysis complete! Earned ${result.karmaEarned || 0} karma points.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/biometrics/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Activity logging mutation
  const activityMutation = useMutation({
    mutationFn: (activity: { type: string; name: string; duration?: number; intensity?: string; mood?: string }) =>
      apiRequest("POST", "/api/wellness/activities", activity),
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Activity Logged",
        description: `Great work! Earned ${result.karmaEarned || 0} karma points.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wellness/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  // Setup WebSocket for real-time updates
  useEffect(() => {
    const handleBiometricUpdate = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/biometrics/latest"] });
    };

    const handleWellnessAchievement = (data: any) => {
      toast({
        title: "Achievement Unlocked!",
        description: data.message,
      });
    };

    websocket.on("biometric_update", handleBiometricUpdate);
    websocket.on("wellness_achievement", handleWellnessAchievement);

    return () => {
      websocket.off("biometric_update", handleBiometricUpdate);
      websocket.off("wellness_achievement", handleWellnessAchievement);
    };
  }, [queryClient, toast]);

  const handleBiometricSubmit = () => {
    if (Object.keys(biometricData).length === 0) {
      toast({
        title: "No Data",
        description: "Please enter some biometric data first.",
        variant: "destructive",
      });
      return;
    }
    biometricMutation.mutate(biometricData);
  };

  const handleQuickActivity = (type: string, name: string) => {
    activityMutation.mutate({
      type,
      name,
      duration: 10,
      intensity: "medium",
      mood: "positive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunset-50 via-warmth-50 to-ocean-50 dark:from-sunset-900 dark:via-ocean-900 dark:to-peace-900 nature:from-peace-50 nature:via-flow-50 nature:to-sunset-100 pb-20 md:pb-0 transition-all duration-1000">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(255, 140, 0, 0.2) 0%, rgba(255, 165, 0, 0.3) 30%, rgba(30, 144, 255, 0.3) 70%, rgba(0, 191, 255, 0.2) 100%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-5xl font-playfair font-bold text-white mb-6 drop-shadow-xl">
              Welcome to Your Sacred Path
            </h2>
            <p className="text-xl text-warmth-100 mb-8 max-w-3xl mx-auto drop-shadow-lg">
              Track your spiritual evolution, receive divine insights, and transform your essence with personalized guidance from the cosmos.
            </p>
            
            {/* AI Wellness Coach Preview */}
            <div className="glassmorphism rounded-2xl p-6 max-w-md mx-auto meditation-aura">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 sunset-glow rounded-full flex items-center justify-center animate-pulse-slow">
                  <i className="fas fa-eye text-white text-2xl drop-shadow-md"></i>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white drop-shadow-md">Divine Oracle</h3>
                  <p className="text-warmth-200 text-sm drop-shadow-sm">Awakened and ready to guide</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-sunset-500/10 to-ocean-500/10 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <p className="text-white text-sm drop-shadow-sm font-medium">
                  "The universe awaits your energy signature. Share your sacred data below to unlock personalized cosmic insights and begin your transformation! ✨"
                </p>
              </div>
              <Button 
                onClick={() => document.getElementById('biometrics-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-sunset-500 via-warmth-500 to-ocean-500 text-white hover:from-sunset-600 hover:via-warmth-600 hover:to-ocean-600 karma-glow transform hover:scale-105 transition-all duration-500"
                data-testid="start-tracking-button"
              >
                Begin Sacred Tracking 🧘‍♀️
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center glassmorphism rounded-xl p-4">
            <p className="text-2xl font-bold text-sage-600" data-testid="global-users">
              {globalStats?.totalUsers?.toLocaleString() || "Loading..."}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Global Members</p>
          </div>
          <div className="text-center glassmorphism rounded-xl p-4">
            <p className="text-2xl font-bold text-lavender-600" data-testid="active-today">
              {globalStats?.activeToday?.toLocaleString() || "Loading..."}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active Today</p>
          </div>
          <div className="text-center glassmorphism rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-600" data-testid="total-activities">
              {globalStats?.totalActivities?.toLocaleString() || "Loading..."}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Activities</p>
          </div>
          <div className="text-center glassmorphism rounded-xl p-4">
            <p className="text-2xl font-bold text-ocean-600" data-testid="total-karma">
              {globalStats?.totalKarma?.toLocaleString() || "Loading..."}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Community Karma</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biometric Tracking */}
            <section id="biometrics-section">
              <div className="glassmorphism rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-playfair font-semibold text-slate-800 dark:text-white mb-6">
                  Biometric Tracking
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Heart Rate (BPM)
                    </label>
                    <input
                      type="number"
                      data-testid="heart-rate-input"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      placeholder="72"
                      onChange={(e) => setBiometricData(prev => ({
                        ...prev,
                        heartRate: parseInt(e.target.value) || undefined
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Sleep Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      data-testid="sleep-hours-input"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      placeholder="7.5"
                      onChange={(e) => setBiometricData(prev => ({
                        ...prev,
                        sleepHours: parseFloat(e.target.value) || undefined
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Sleep Quality (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      data-testid="sleep-quality-input"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      placeholder="85"
                      onChange={(e) => setBiometricData(prev => ({
                        ...prev,
                        sleepQuality: parseInt(e.target.value) || undefined
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Stress Level (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      data-testid="stress-level-input"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      placeholder="25"
                      onChange={(e) => setBiometricData(prev => ({
                        ...prev,
                        stressLevel: parseInt(e.target.value) || undefined
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Steps Today
                    </label>
                    <input
                      type="number"
                      data-testid="steps-input"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      placeholder="8200"
                      onChange={(e) => setBiometricData(prev => ({
                        ...prev,
                        steps: parseInt(e.target.value) || undefined
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Current Mood
                    </label>
                    <select
                      data-testid="mood-select"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                      onChange={(e) => setBiometricData(prev => ({
                        ...prev,
                        mood: e.target.value || undefined
                      }))}
                    >
                      <option value="">Select mood</option>
                      <option value="very_happy">😍 Very Happy</option>
                      <option value="happy">😊 Happy</option>
                      <option value="neutral">😐 Neutral</option>
                      <option value="sad">😔 Sad</option>
                      <option value="very_sad">😢 Very Sad</option>
                    </select>
                  </div>
                </div>
                
                <Button
                  onClick={handleBiometricSubmit}
                  disabled={biometricMutation.isPending}
                  data-testid="submit-biometrics-button"
                  className="w-full bg-gradient-to-r from-sage-500 to-ocean-500 hover:from-sage-600 hover:to-ocean-600"
                >
                  {biometricMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner animate-spin mr-2"></i>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-chart-line mr-2"></i>
                      Update & Analyze
                    </>
                  )}
                </Button>
              </div>
            </section>

            {/* Current Biometrics Display */}
            {latestBiometrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <BiometricCard
                  title="Heart Rate"
                  value={latestBiometrics.heartRate || "--"}
                  unit="BPM"
                  icon="fa-heartbeat"
                  color="from-red-500 to-pink-500"
                  progress={latestBiometrics.heartRate ? Math.min((latestBiometrics.heartRate / 100) * 100, 100) : 0}
                />
                <BiometricCard
                  title="Sleep Quality"
                  value={latestBiometrics.sleepHours ? `${latestBiometrics.sleepHours}h` : "--"}
                  unit="Quality"
                  icon="fa-bed"
                  color="from-blue-500 to-cyan-500"
                  progress={latestBiometrics.sleepQuality || 0}
                />
                <BiometricCard
                  title="Stress Level"
                  value={latestBiometrics.stressLevel ? `${latestBiometrics.stressLevel}%` : "--"}
                  unit="Stress"
                  icon="fa-brain"
                  color="from-yellow-500 to-orange-500"
                  progress={latestBiometrics.stressLevel ? 100 - latestBiometrics.stressLevel : 0}
                />
                <BiometricCard
                  title="Activity"
                  value={latestBiometrics.steps ? `${(latestBiometrics.steps / 1000).toFixed(1)}K` : "--"}
                  unit="Steps"
                  icon="fa-running"
                  color="from-sage-500 to-emerald-500"
                  progress={latestBiometrics.steps ? Math.min((latestBiometrics.steps / 10000) * 100, 100) : 0}
                />
              </div>
            )}

            {/* Quick Activities */}
            <div className="glassmorphism rounded-xl p-8">
              <h3 className="text-2xl font-playfair font-semibold text-slate-800 dark:text-white mb-6">
                Quick Wellness Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group cursor-pointer" onClick={() => handleQuickActivity("meditation", "Quick Meditation")}>
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
                      alt="Meditation session" 
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-lavender-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      5 min
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Quick Meditation</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">5-minute mindfulness practice</p>
                </div>

                <div className="group cursor-pointer" onClick={() => handleQuickActivity("breathing", "Breathing Exercise")}>
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
                      alt="Breathing exercise" 
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-sage-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      3 min
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Breathing Exercise</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Stress-relief breathing technique</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* AI Coach */}
            <AICoach 
              insights={[]}
              isAnalyzing={biometricMutation.isPending}
            />

            {/* Recent Activities */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {recentActivities?.slice(0, 5).map((activity: WellnessActivity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{activity.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(activity.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-300">
                        +{activity.karmaEarned}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
                      No activities yet. Start tracking to see your progress!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Crisis Support */}
            <CrisisSupport />
          </div>
        </div>
      </div>
    </div>
  );
}

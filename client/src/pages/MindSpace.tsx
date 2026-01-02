import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "@/components/ChatInterface";
import CrisisSupport from "@/components/CrisisSupport";

interface TherapySession {
  id: string;
  sessionType: string;
  duration?: number;
  mood?: string;
  topics?: string[];
  summary?: string;
  createdAt: Date;
}

interface TherapyMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MindfulnessExercise {
  id: string;
  type: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
}

export default function MindSpace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<string>("neutral");
  const [weeklyMood, setWeeklyMood] = useState<Record<string, string>>({
    monday: "happy",
    tuesday: "neutral", 
    wednesday: "very_happy",
    thursday: "neutral"
  });
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [crisisResponse, setCrisisResponse] = useState("");

  // Fetch therapy sessions
  const { data: therapySessions = [] as TherapySession[] } = useQuery<TherapySession[]>({
    queryKey: ["/api/therapy/sessions"],
    enabled: !!user,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    },
  });

  // Fetch current session messages
  const { data: sessionMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/therapy/sessions", currentSessionId, "messages"],
    enabled: !!currentSessionId,
    queryFn: async () => {
      const response = await fetch(`/api/therapy/sessions/${currentSessionId}/messages`, {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized", 
            description: "You are logged out. Logging in again...",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/api/login";
          }, 500);
          return [];
        }
        throw new Error("Failed to fetch messages");
      }
      return response.json();
    },
  });

  // Create therapy session mutation
  const createSessionMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/therapy/sessions", {
      sessionType: "chat",
      mood: currentMood,
      topics: ["general_wellness"]
    }),
    onSuccess: async (response) => {
      const session = await response.json();
      setCurrentSessionId(session.id);
      queryClient.invalidateQueries({ queryKey: ["/api/therapy/sessions"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Session Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => {
      if (!currentSessionId) throw new Error("No active session");
      return apiRequest("POST", "/api/therapy/messages", {
        sessionId: currentSessionId,
        role: "user",
        content: message
      });
    },
    onSuccess: async (response) => {
      const result = await response.json();
      
      // Check for crisis detection
      if (result.crisisDetected) {
        setCrisisDetected(true);
        setCrisisResponse(result.crisisResponse);
      }
      
      queryClient.invalidateQueries({ 
        queryKey: ["/api/therapy/sessions", currentSessionId, "messages"] 
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Message Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const mindfulnessExercises: MindfulnessExercise[] = [
    {
      id: "breathing",
      type: "breathing",
      title: "4-7-8 Breathing",
      description: "A simple breathing technique to reduce stress and promote relaxation.",
      duration: "5 minutes",
      icon: "fa-wind",
      color: "from-sage-50 to-emerald-50 dark:from-sage-900/20 dark:to-emerald-900/20"
    },
    {
      id: "body-scan",
      type: "meditation",
      title: "Body Scan",
      description: "Progressive relaxation technique to release physical tension.",
      duration: "10 minutes", 
      icon: "fa-eye",
      color: "from-lavender-50 to-purple-50 dark:from-lavender-900/20 dark:to-purple-900/20"
    },
    {
      id: "loving-kindness",
      type: "meditation",
      title: "Loving Kindness",
      description: "Cultivate compassion and positive emotions toward yourself and others.",
      duration: "8 minutes",
      icon: "fa-heart",
      color: "from-ocean-50 to-blue-50 dark:from-ocean-900/20 dark:to-blue-900/20"
    },
    {
      id: "gratitude",
      type: "journaling",
      title: "Gratitude Practice",
      description: "Daily reflection to boost positive emotions and life satisfaction.",
      duration: "3 minutes",
      icon: "fa-journal-whills",
      color: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
    }
  ];

  const wellnessResources = [
    {
      id: "library",
      title: "Mental Health Library",
      description: "Articles & guides",
      icon: "fa-book",
      color: "bg-sage-50 dark:bg-sage-900/20"
    },
    {
      id: "meditations",
      title: "Guided Meditations", 
      description: "Audio sessions",
      icon: "fa-headphones",
      color: "bg-lavender-50 dark:bg-lavender-900/20"
    },
    {
      id: "support-groups",
      title: "Support Groups",
      description: "Community support", 
      icon: "fa-users",
      color: "bg-ocean-50 dark:bg-ocean-900/20"
    }
  ];

  // Auto-create session if none exists
  useEffect(() => {
    if (user && !currentSessionId && !createSessionMutation.isPending) {
      createSessionMutation.mutate();
    }
  }, [user, currentSessionId]);

  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  const handleMoodUpdate = (mood: string) => {
    setCurrentMood(mood);
    // Save mood for today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    setWeeklyMood(prev => ({ ...prev, [today]: mood }));
  };

  const handleStartExercise = (exerciseId: string) => {
    const exercise = mindfulnessExercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      toast({
        title: "Exercise Started",
        description: `Starting ${exercise.title} - ${exercise.duration}`,
      });
    }
  };

  const handleConnectCounselor = () => {
    toast({
      title: "Connecting to Crisis Counselor",
      description: "A professional counselor will be with you shortly.",
    });
  };

  const handleViewContacts = () => {
    toast({
      title: "Emergency Contacts",
      description: "Crisis support resources are available 24/7.",
    });
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'very_happy': return '🤩';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      case 'very_sad': return '😢';
      default: return '😐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900 nature:from-sage-50 nature:via-emerald-50 nature:to-sage-100 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-slate-800 dark:text-white mb-4">
            MindSpace™ AI Therapy
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Safe, private, and personalized mental wellness support powered by advanced AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Therapist Interface */}
          <div className="lg:col-span-2">
            <div className="glassmorphism rounded-xl p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-sage-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-brain text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white">AI Wellness Therapist</h3>
                  <p className="text-slate-600 dark:text-slate-400">Available 24/7 for support</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-sage-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-sage-600 font-medium">Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="h-96">
                <ChatInterface
                  messages={sessionMessages || []}
                  onSendMessage={handleSendMessage}
                  isLoading={sendMessageMutation.isPending || messagesLoading}
                  crisisDetected={crisisDetected}
                  crisisResponse={crisisResponse}
                />
              </div>
            </div>

            {/* Mindfulness Exercises */}
            <div className="glassmorphism rounded-xl p-8">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                Recommended Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mindfulnessExercises.map((exercise) => (
                  <div 
                    key={exercise.id}
                    className={`bg-gradient-to-br ${exercise.color} rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-300`}
                    onClick={() => handleStartExercise(exercise.id)}
                    data-testid={`mindfulness-exercise-${exercise.id}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-sage-500 rounded-lg flex items-center justify-center">
                        <i className={`fas ${exercise.icon} text-white`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">{exercise.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{exercise.duration}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      {exercise.description}
                    </p>
                    <Button 
                      size="sm"
                      className="bg-sage-500 hover:bg-sage-600 text-white"
                      data-testid={`start-exercise-${exercise.id}`}
                    >
                      Start Exercise
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Mood Tracker */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Mood Tracker
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      How are you feeling right now?
                    </label>
                    <div className="flex justify-between">
                      {[
                        { mood: 'very_sad', emoji: '😢', title: 'Very Sad' },
                        { mood: 'sad', emoji: '😔', title: 'Sad' },
                        { mood: 'neutral', emoji: '😐', title: 'Neutral' },
                        { mood: 'happy', emoji: '😊', title: 'Happy' },
                        { mood: 'very_happy', emoji: '🤩', title: 'Very Happy' }
                      ].map((moodOption) => (
                        <button
                          key={moodOption.mood}
                          onClick={() => handleMoodUpdate(moodOption.mood)}
                          data-testid={`mood-${moodOption.mood}`}
                          className={`text-2xl hover:scale-110 transition-transform p-1 rounded-full ${
                            currentMood === moodOption.mood ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''
                          }`}
                          title={moodOption.title}
                        >
                          {moodOption.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium text-slate-800 dark:text-white mb-3">This Week</h4>
                    <div className="space-y-2">
                      {[
                        { day: 'Monday', key: 'monday' },
                        { day: 'Tuesday', key: 'tuesday' },
                        { day: 'Wednesday', key: 'wednesday' },
                        { day: 'Today', key: new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() }
                      ].map((dayInfo, index) => (
                        <div 
                          key={dayInfo.key}
                          className="flex items-center justify-between"
                          data-testid={`mood-history-${index}`}
                        >
                          <span className="text-sm text-slate-600 dark:text-slate-400">{dayInfo.day}</span>
                          <span className={`text-lg ${dayInfo.day === 'Today' ? 'bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-1' : ''}`}>
                            {getMoodEmoji(weeklyMood[dayInfo.key] || currentMood)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crisis Support */}
            <CrisisSupport 
              onConnectCounselor={handleConnectCounselor}
              onViewContacts={handleViewContacts}
            />

            {/* Session History */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Recent Sessions
                </h3>
                <div className="space-y-3">
                  {therapySessions?.slice(0, 3).map((session: TherapySession, index: number) => (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                      data-testid={`session-history-${index}`}
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {session.sessionType === 'chat' ? 'AI Chat Session' : session.sessionType}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-300">
                        {session.duration || 25} min
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
                      No previous sessions. Start chatting to begin your wellness journey!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Wellness Resources */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Wellness Resources
                </h3>
                <div className="space-y-3">
                  {wellnessResources.map((resource) => (
                    <button
                      key={resource.id}
                      data-testid={`wellness-resource-${resource.id}`}
                      className={`w-full text-left p-3 ${resource.color} rounded-lg hover:opacity-80 transition-opacity duration-200`}
                    >
                      <div className="flex items-center space-x-3">
                        <i className={`fas ${resource.icon} text-sage-600`}></i>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {resource.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

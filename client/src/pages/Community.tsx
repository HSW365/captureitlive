import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import CommunityPost from "@/components/CommunityPost";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Post {
  id: string;
  userId: string;
  type: string;
  title?: string;
  content: string;
  mood?: string;
  imageUrl?: string;
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  featured: boolean;
  karmaAwarded: number;
  createdAt: Date;
}

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    type: "text" as const,
    mood: "neutral" as const,
  });

  // Fetch community posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  // Fetch featured posts
  const { data: featuredPosts } = useQuery({
    queryKey: ["/api/posts/featured"],
    queryFn: async () => {
      const response = await fetch("/api/posts/featured", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch featured posts");
      return response.json();
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (postData: typeof newPost) => apiRequest("POST", "/api/posts", postData),
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Post Created",
        description: `Your post has been shared! Earned ${result.karmaEarned} karma points.`,
      });
      setIsCreatePostOpen(false);
      setNewPost({ title: "", content: "", type: "text", mood: "neutral" });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Post Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Post engagement mutation
  const engagementMutation = useMutation({
    mutationFn: ({ postId, type }: { postId: string; type: string }) =>
      apiRequest("POST", `/api/posts/${postId}/engage`, { type }),
    onSuccess: async (response) => {
      const result = await response.json();
      if (result.karmaEarned > 0) {
        toast({
          title: "Thanks for engaging!",
          description: `Earned ${result.karmaEarned} karma points.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please write something to share with the community.",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPost);
  };

  const handlePostEngagement = (postId: string, type: string) => {
    engagementMutation.mutate({ postId, type });
  };

  const trendingTopics = [
    { tag: "MindfulMondays", posts: 1200, color: "bg-sage-50 dark:bg-sage-900/20 text-sage-700 dark:text-sage-300" },
    { tag: "DigitalDetox", posts: 847, color: "bg-lavender-50 dark:bg-lavender-900/20 text-lavender-700 dark:text-lavender-300" },
    { tag: "GratitudePractice", posts: 623, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" },
    { tag: "WellnessWins", posts: 456, color: "bg-ocean-50 dark:bg-ocean-900/20 text-ocean-700 dark:text-ocean-300" },
  ];

  const suggestedConnections = [
    { 
      id: "1", 
      name: "Elena Rodriguez", 
      interest: "Yoga enthusiast nearby",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
    },
    { 
      id: "2", 
      name: "David Kim", 
      interest: "Meditation teacher",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
    },
    { 
      id: "3", 
      name: "Maya Patel", 
      interest: "Holistic wellness coach",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunset-50 via-warmth-50 to-ocean-50 dark:from-sunset-900 dark:via-ocean-900 dark:to-peace-900 nature:from-peace-50 nature:via-flow-50 nature:to-sunset-100 pb-20 md:pb-0 transition-all duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-playfair font-bold bg-gradient-to-r from-sunset-700 to-ocean-700 bg-clip-text text-transparent dark:from-warmth-300 dark:to-ocean-300">
              Sacred Circle Community
            </h2>
            <p className="text-peace-600 dark:text-warmth-400 font-medium">
              Share your soul's journey, inspire kindred spirits, and ascend together ✨
            </p>
          </div>
          
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button 
                data-testid="create-post-button"
                className="bg-gradient-to-r from-sunset-500 via-warmth-500 to-ocean-500 text-white hover:from-sunset-600 hover:via-warmth-600 hover:to-ocean-600 karma-glow transform hover:scale-105 transition-all duration-500"
              >
                <i className="fas fa-plus mr-2"></i>Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Share with the Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Post title (optional)"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  data-testid="post-title-input"
                />
                <Textarea
                  placeholder="Share something positive and inspiring..."
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  data-testid="post-content-input"
                  rows={4}
                />
                <div className="flex space-x-4">
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost(prev => ({ ...prev, type: e.target.value as any }))}
                    data-testid="post-type-select"
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  >
                    <option value="text">Text Post</option>
                    <option value="image">Image Post</option>
                    <option value="meditation">Meditation</option>
                    <option value="workout">Workout</option>
                  </select>
                  <select
                    value={newPost.mood}
                    onChange={(e) => setNewPost(prev => ({ ...prev, mood: e.target.value as any }))}
                    data-testid="post-mood-select"
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  >
                    <option value="very_happy">😍 Very Happy</option>
                    <option value="happy">😊 Happy</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="sad">😔 Sad</option>
                    <option value="very_sad">😢 Very Sad</option>
                  </select>
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={createPostMutation.isPending}
                  data-testid="submit-post-button"
                  className="w-full bg-gradient-to-r from-sunset-500 via-warmth-500 to-ocean-500 hover:from-sunset-600 hover:via-warmth-600 hover:to-ocean-600 karma-glow transform hover:scale-105 transition-all duration-500"
                >
                  {createPostMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner animate-spin mr-2"></i>
                      Sharing...
                    </>
                  ) : (
                    "Share Post"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Posts */}
            {featuredPosts && featuredPosts.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  Featured Posts
                </h3>
                {featuredPosts.slice(0, 2).map((post: Post) => (
                  <div key={post.id} className="mb-6">
                    <CommunityPost
                      {...post}
                      author={{
                        id: post.userId,
                        firstName: "Community",
                        lastName: "Member",
                        level: "Wellness Guardian"
                      }}
                      onLike={() => handlePostEngagement(post.id, "like")}
                      onComment={() => handlePostEngagement(post.id, "comment")}
                      onShare={() => handlePostEngagement(post.id, "share")}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Recent Posts */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                Community Feed
              </h3>
              
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="glassmorphism animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post: Post) => (
                    <CommunityPost
                      key={post.id}
                      {...post}
                      author={{
                        id: post.userId,
                        firstName: "Community",
                        lastName: "Member",
                        level: "Wellness Seeker"
                      }}
                      onLike={() => handlePostEngagement(post.id, "like")}
                      onComment={() => handlePostEngagement(post.id, "comment")}
                      onShare={() => handlePostEngagement(post.id, "share")}
                    />
                  ))}
                </div>
              ) : (
                <Card className="glassmorphism">
                  <CardContent className="p-12 text-center">
                    <i className="fas fa-users text-4xl text-slate-400 mb-4"></i>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-peace-500 dark:text-warmth-400 mb-6">
                      Be the first soul to share divine inspiration with our sacred circle! ✨
                    </p>
                    <Button 
                      onClick={() => setIsCreatePostOpen(true)}
                      className="bg-gradient-to-r from-sunset-500 via-warmth-500 to-ocean-500 hover:from-sunset-600 hover:via-warmth-600 hover:to-ocean-600 karma-glow transform hover:scale-105 transition-all duration-500"
                    >
                      Share Divine Light 🥰
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Community Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div 
                      key={topic.tag}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${topic.color}`}
                      data-testid={`trending-topic-${topic.tag.toLowerCase()}`}
                    >
                      <span className="font-medium">#{topic.tag}</span>
                      <span className="text-sm">{topic.posts.toLocaleString()} posts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Connections */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Suggested Connections
                </h3>
                <div className="space-y-4">
                  {suggestedConnections.map((connection) => (
                    <div key={connection.id} className="flex items-center space-x-3">
                      <img 
                        src={connection.avatar} 
                        alt={connection.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 dark:text-white text-sm">
                          {connection.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {connection.interest}
                        </p>
                      </div>
                      <Button 
                        variant="ghost"
                        size="sm"
                        data-testid={`connect-${connection.id}`}
                        className="text-sage-500 hover:text-sage-600 text-sm font-medium"
                      >
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Community Guidelines
                </h3>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-heart text-sage-500 mt-1"></i>
                    <p>Share with kindness and respect</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-shield-alt text-ocean-500 mt-1"></i>
                    <p>Keep content wellness-focused and positive</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-users text-lavender-500 mt-1"></i>
                    <p>Support others on their wellness journey</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-ban text-red-500 mt-1"></i>
                    <p>No politics, religion, or hate content</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            <Card className="glassmorphism bg-gradient-to-br from-lavender-50 to-sage-50 dark:from-lavender-900/20 dark:to-sage-900/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-sage-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-trophy text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">Weekly Challenge</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Join the community</p>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  7-Day Gratitude Practice 🙏
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  Share one thing you're grateful for each day. Join 2,847 other community members!
                </p>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <p className="text-xl font-bold text-sage-600">2,847</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Participants</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-lavender-600">3</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Days Left</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-amber-600">100</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Karma Reward</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  data-testid="join-challenge-button"
                  className="w-full bg-gradient-to-r from-lavender-500 to-sage-500 hover:from-lavender-600 hover:to-sage-600"
                >
                  Join Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  imageUrl?: string;
  memberCount: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export default function GlobalMap() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch community groups
  const { data: communityGroups, isLoading } = useQuery({
    queryKey: ["/api/community/groups", selectedLocation],
    queryFn: async () => {
      const params = selectedLocation ? `?location=${encodeURIComponent(selectedLocation)}` : "";
      const response = await fetch(`/api/community/groups${params}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch community groups");
      return response.json();
    },
  });

  const filteredGroups = communityGroups?.filter((group: CommunityGroup) => 
    selectedCategory === "all" || group.category === selectedCategory
  ) || [];

  const locations = [
    { name: "San Francisco, CA", members: 127, coords: { top: "25%", left: "20%" } },
    { name: "Amsterdam, NL", members: 89, coords: { top: "33%", left: "50%" } },
    { name: "Tokyo, Japan", members: 256, coords: { top: "40%", right: "25%" } },
    { name: "Sydney, AU", members: 43, coords: { bottom: "25%", right: "33%" } },
    { name: "Rio de Janeiro, BR", members: 78, coords: { bottom: "33%", left: "33%" } },
  ];

  const categories = [
    { id: "all", name: "All Activities", icon: "fa-globe" },
    { id: "meditation", name: "Meditation", icon: "fa-leaf" },
    { id: "fitness", name: "Fitness", icon: "fa-dumbbell" },
    { id: "support", name: "Support Groups", icon: "fa-heart" },
    { id: "nutrition", name: "Nutrition", icon: "fa-apple-alt" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900 nature:from-sage-50 nature:via-emerald-50 nature:to-sage-100 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-slate-800 dark:text-white">
              Global Wellness Map
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Connect with wellness communities worldwide
            </p>
          </div>
          <div className="flex space-x-4">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              data-testid="category-filter"
              className="glassmorphism rounded-lg px-4 py-2 text-slate-700 dark:text-slate-300 border-0 bg-white/10"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive World Map */}
        <div className="glassmorphism rounded-2xl p-8 mb-8">
          <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 nature:from-sage-100 nature:to-emerald-100 rounded-xl overflow-hidden">
            {/* World Map Background */}
            <img 
              src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=600" 
              alt="Interactive world map showing global wellness communities" 
              className="w-full h-full object-cover opacity-70"
            />
            
            {/* Activity Markers */}
            <div className="absolute inset-0">
              {locations.map((location, index) => (
                <div 
                  key={location.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={location.coords}
                >
                  <div 
                    className={`w-${4 + Math.floor(location.members/50)} h-${4 + Math.floor(location.members/50)} bg-gradient-to-r ${
                      index % 4 === 0 ? 'from-sage-500 to-emerald-500' :
                      index % 4 === 1 ? 'from-lavender-500 to-purple-500' :
                      index % 4 === 2 ? 'from-amber-500 to-orange-500' :
                      'from-ocean-500 to-blue-500'
                    } rounded-full animate-pulse cursor-pointer hover:scale-110 transition-transform`}
                    onClick={() => setSelectedLocation(location.name)}
                    data-testid={`location-marker-${index}`}
                  />
                  
                  <div className="absolute -top-12 -left-16 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{location.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{location.members} active members</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="map-zoom-in"
                className="glassmorphism w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/20"
              >
                <i className="fas fa-plus"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="map-zoom-out"
                className="glassmorphism w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/20"
              >
                <i className="fas fa-minus"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="map-fullscreen"
                className="glassmorphism w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/20"
              >
                <i className="fas fa-expand"></i>
              </Button>
            </div>
          </div>

          {/* Map Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-sage-600">2.3M</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Global Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-lavender-600">156</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">12.7K</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-ocean-600">98%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Uptime</p>
            </div>
          </div>
        </div>

        {/* Community Groups */}
        <div>
          <h3 className="text-2xl font-playfair font-semibold text-slate-800 dark:text-white mb-6">
            {selectedLocation ? `Communities in ${selectedLocation}` : "Global Wellness Communities"}
          </h3>
          
          {selectedLocation && (
            <div className="mb-4">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedLocation("")}
                data-testid="clear-location-filter"
                className="text-sage-600 hover:text-sage-700"
              >
                <i className="fas fa-times mr-2"></i>
                Show all locations
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glassmorphism animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group: CommunityGroup) => (
                <Card key={group.id} className="glassmorphism hover:shadow-lg transition-all duration-300" data-testid={`community-group-${group.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={group.imageUrl} alt={group.name} />
                        <AvatarFallback className="bg-gradient-to-r from-sage-500 to-ocean-500 text-white text-xl">
                          {group.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 dark:text-white">{group.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{group.location}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-300">
                            {group.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-users text-sage-500 text-xs"></i>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {group.memberCount} members
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {group.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sage-600 font-medium">
                        Active community
                      </span>
                      <Button 
                        size="sm"
                        data-testid={`join-group-${group.id}`}
                        className="bg-sage-500 hover:bg-sage-600 text-white"
                      >
                        Join Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glassmorphism">
              <CardContent className="p-12 text-center">
                <i className="fas fa-globe text-4xl text-slate-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  No communities found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  {selectedLocation 
                    ? `No wellness communities found in ${selectedLocation} for the selected category.`
                    : "No wellness communities match your current filters."
                  }
                </p>
                <Button 
                  onClick={() => {
                    setSelectedLocation("");
                    setSelectedCategory("all");
                  }}
                  className="bg-gradient-to-r from-sage-500 to-ocean-500 hover:from-sage-600 hover:to-ocean-600"
                >
                  View All Communities
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

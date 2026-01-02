import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import KarmaDisplay from "@/components/KarmaDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: "fa-home" },
    { name: "Global Map", href: "/map", icon: "fa-globe" },
    { name: "Community", href: "/community", icon: "fa-users" },
    { name: "Wellness", href: "/wellness", icon: "fa-heartbeat" },
    { name: "MindSpace", href: "/mindspace", icon: "fa-brain" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light": return "fa-sun";
      case "dark": return "fa-moon";
      case "nature": return "fa-leaf";
      default: return "fa-sun";
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header data-testid="navigation-header" className="sticky top-0 z-50 glassmorphism border-b border-sunset-200/30 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" data-testid="logo-link">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src="/attached_assets/captureit.live logo_1754605698795.png" 
                  alt="CaptureIt Logo" 
                  className="w-12 h-12 rounded-xl animate-float object-cover meditation-aura shadow-lg"
                />
                <div>
                  <h1 className="text-2xl font-playfair font-bold bg-gradient-to-r from-sunset-600 via-warmth-600 to-ocean-600 bg-clip-text text-transparent drop-shadow-sm">
                    CaptureIt™
                  </h1>
                  <p className="text-xs text-sunset-600 dark:text-warmth-400 font-medium">Sacred Wellness Circle</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-sunset-500/20 to-ocean-500/20 text-sunset-800 dark:text-warmth-200 shadow-inner"
                        : "text-peace-700 dark:text-ocean-300 hover:bg-gradient-to-r hover:from-warmth-500/10 hover:to-ocean-500/10 hover:shadow-md"
                    }`}
                  >
                    <i className={`fas ${item.icon} mr-2`}></i>
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Karma Display */}
              <div className="meditation-aura">
                <KarmaDisplay karma={user?.karma || 0} level={user?.level || "Wellness Seeker"} />
              </div>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    data-testid="theme-toggle"
                    className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    <i className={`fas ${getThemeIcon()} text-slate-600 dark:text-slate-300`}></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTheme("light")} data-testid="theme-light">
                    <i className="fas fa-sun mr-2"></i>Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} data-testid="theme-dark">
                    <i className="fas fa-moon mr-2"></i>Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("nature")} data-testid="theme-nature">
                    <i className="fas fa-leaf mr-2"></i>Nature
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                {/* Biometric status indicator */}
                <div className="relative">
                  <div className="w-3 h-3 bg-sage-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-sage-500 rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild data-testid="user-profile-menu">
                    <Avatar className="w-10 h-10 cursor-pointer border-2 border-white/20">
                      <AvatarImage src={user?.profileImageUrl || ""} alt="User profile" />
                      <AvatarFallback className="bg-gradient-to-r from-sunset-500 to-ocean-500 text-white">
                        {user?.firstName?.[0] || user?.email?.[0] || "🧘"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      <div className="flex flex-col">
                        <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                        <span className="text-sm text-slate-500">{user?.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" data-testid="logout-link">
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50" data-testid="mobile-navigation">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                data-testid={`mobile-nav-${item.name.toLowerCase().replace(" ", "-")}`}
                className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-sage-600 bg-sage-50 dark:bg-sage-900/20"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <i className={`fas ${item.icon} text-lg mb-1`}></i>
                <span>{item.name.split(" ")[0]}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

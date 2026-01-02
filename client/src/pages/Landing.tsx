import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sunset-50 via-warmth-50 to-ocean-50 dark:from-sunset-900 dark:via-ocean-900 dark:to-peace-900 transition-all duration-1000">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(255, 140, 0, 0.3) 0%, rgba(255, 165, 0, 0.4) 30%, rgba(30, 144, 255, 0.4) 70%, rgba(0, 191, 255, 0.3) 100%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        
        {/* Floating meditation elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-4 h-4 bg-sunset-400 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-ocean-400 rounded-full animate-float opacity-50" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-peace-400 rounded-full animate-float opacity-70" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-48 right-20 w-5 h-5 bg-warmth-400 rounded-full animate-float opacity-55" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <img 
              src="/attached_assets/captureit.live logo_1754605698795.png" 
              alt="CaptureIt Logo" 
              className="w-20 h-20 md:w-24 md:h-24 rounded-xl animate-float object-cover shadow-lg"
            />
            <div>
              <h1 className="text-4xl md:text-6xl font-playfair font-bold bg-gradient-to-r from-sunset-400 via-warmth-500 to-ocean-400 bg-clip-text text-transparent drop-shadow-lg">
                CaptureIt™
              </h1>
              <p className="text-warmth-100 text-lg font-medium drop-shadow-md">Global Wellness Community</p>
            </div>
          </div>

          {/* Hero Content */}
          <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 drop-shadow-xl">
            Transform Your Wellness Journey
          </h2>
          <p className="text-xl md:text-2xl text-warmth-50 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Embrace the harmony of AI-driven wellness coaching, connect with souls worldwide, 
            and elevate your consciousness through mindful practices and personalized insights.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="glassmorphism border-white/20" data-testid="feature-ai-coach">
              <CardContent className="p-6 text-center meditation-aura">
                <div className="w-16 h-16 sunset-glow rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                  <i className="fas fa-brain text-white text-2xl drop-shadow-md"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">AI Wellness Oracle</h3>
                <p className="text-warmth-100 text-sm drop-shadow-sm">
                  Divine insights and sacred wisdom channeled through advanced consciousness
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-white/20" data-testid="feature-global-community">
              <CardContent className="p-6 text-center meditation-aura">
                <div className="w-16 h-16 bg-gradient-to-r from-ocean-400 to-peace-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow" style={{animationDelay: '1s'}}>
                  <i className="fas fa-users text-white text-2xl drop-shadow-md"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">Sacred Circle</h3>
                <p className="text-ocean-100 text-sm drop-shadow-sm">
                  Unite with kindred spirits across continents in our healing sanctuary
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-white/20" data-testid="feature-karma-system">
              <CardContent className="p-6 text-center meditation-aura">
                <div className="w-16 h-16 karma-glow rounded-full flex items-center justify-center mx-auto mb-4" style={{animationDelay: '2s'}}>
                  <i className="fas fa-lotus text-white text-2xl drop-shadow-md"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">Karma Essence</h3>
                <p className="text-warmth-100 text-sm drop-shadow-sm">
                  Manifest positive energy and earn sacred karma through mindful actions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button 
              size="lg"
              data-testid="login-button"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-sunset-500 via-warmth-500 to-ocean-500 hover:from-sunset-600 hover:via-warmth-600 hover:to-ocean-600 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 karma-glow transform hover:scale-105"
            >
              Begin Your Sacred Journey
              <i className="fas fa-meditation ml-2"></i>
            </Button>
            
            <p className="text-blue-300 text-sm">
              Join thousands of wellness seekers transforming their lives
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">2.3M+</p>
              <p className="text-blue-200 text-sm">Global Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">156</p>
              <p className="text-blue-200 text-sm">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">12.7K</p>
              <p className="text-blue-200 text-sm">Daily Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-blue-200 text-sm">Wellness Growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/attached_assets/captureit.live logo_1754605698795.png" 
                alt="CaptureIt Logo" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-white font-semibold">CaptureIt™</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a 
                href="/privacy" 
                className="text-warmth-200 hover:text-white transition-colors"
                data-testid="privacy-link"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-warmth-200 hover:text-white transition-colors"
                data-testid="terms-link"
              >
                Terms of Service
              </a>
              <a 
                href="mailto:support@captureit.live" 
                className="text-warmth-200 hover:text-white transition-colors"
                data-testid="contact-link"
              >
                Contact
              </a>
            </div>
            
            <p className="text-warmth-300 text-sm">
              © 2024 CaptureIt™. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

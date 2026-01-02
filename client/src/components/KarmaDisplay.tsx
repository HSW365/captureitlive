interface KarmaDisplayProps {
  karma: number;
  level: string;
  showProgress?: boolean;
}

export default function KarmaDisplay({ karma, level, showProgress = false }: KarmaDisplayProps) {
  const getLevelProgress = (karma: number) => {
    // Simple level progression system
    const levels = [
      { name: "Wellness Seeker", threshold: 0, color: "from-peace-500 to-ocean-500" },
      { name: "Mindful Beginner", threshold: 250, color: "from-ocean-500 to-flow-500" },
      { name: "Sacred Explorer", threshold: 500, color: "from-warmth-500 to-sunset-500" },
      { name: "Light Guardian", threshold: 1000, color: "from-sunset-500 to-warmth-600" },
      { name: "Divine Healer", threshold: 2000, color: "from-serenity-500 to-peace-600" },
      { name: "Enlightened Master", threshold: 5000, color: "from-sunset-600 to-serenity-600" },
    ];

    const currentLevel = levels.findLast(l => karma >= l.threshold) || levels[0];
    const nextLevel = levels.find(l => l.threshold > karma);
    
    const progress = nextLevel 
      ? ((karma - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
      : 100;

    return {
      currentLevel,
      nextLevel,
      progress: Math.min(progress, 100),
      remaining: nextLevel ? nextLevel.threshold - karma : 0
    };
  };

  const levelInfo = getLevelProgress(karma);

  return (
    <div className="flex items-center space-x-2" data-testid="karma-display">
      <div className={`bg-gradient-to-r ${levelInfo.currentLevel.color} karma-glow px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all duration-300`}>
        <i className="fas fa-lotus text-white text-sm animate-pulse"></i>
        <span className="text-white font-bold text-sm" data-testid="karma-amount">
          {karma.toLocaleString()}
        </span>
        <span className="text-white/80 text-xs font-medium">✨</span>
      </div>
      
      {showProgress && (
        <div className="hidden sm:block">
          <div className="text-xs text-slate-600 dark:text-slate-400" data-testid="karma-level">
            {level}
          </div>
          {levelInfo.nextLevel && (
            <div className="text-xs text-slate-500 dark:text-slate-500" data-testid="karma-progress">
              {levelInfo.remaining} to {levelInfo.nextLevel.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

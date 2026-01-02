import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WellnessInsight {
  type: 'recommendation' | 'achievement' | 'concern';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AICoachProps {
  insights?: WellnessInsight[];
  isAnalyzing?: boolean;
}

export default function AICoach({ insights = [], isAnalyzing = false }: AICoachProps) {
  const [currentInsight, setCurrentInsight] = useState(0);

  const getInsightColor = (type: string, priority: string) => {
    if (type === 'achievement') return 'from-amber-500 to-orange-500';
    if (type === 'concern') return 'from-red-500 to-pink-500';
    if (priority === 'high') return 'from-sage-500 to-emerald-500';
    if (priority === 'medium') return 'from-lavender-500 to-purple-500';
    return 'from-ocean-500 to-blue-500';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return 'fa-trophy';
      case 'concern': return 'fa-exclamation-triangle';
      case 'recommendation': return 'fa-lightbulb';
      default: return 'fa-info-circle';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  if (isAnalyzing) {
    return (
      <Card className="glassmorphism" data-testid="ai-coach-analyzing">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-sage-500 rounded-full flex items-center justify-center animate-pulse">
              <i className="fas fa-robot text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">AI Wellness Coach</h3>
              <p className="text-slate-600 dark:text-slate-400">Analyzing your wellness data...</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-6 h-6 border-4 border-lavender-500 border-t-transparent rounded-full"></div>
              <p className="text-slate-700 dark:text-slate-300">Generating personalized insights...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights.length) {
    return (
      <Card className="glassmorphism" data-testid="ai-coach-empty">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-sage-500 rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">AI Wellness Coach</h3>
              <p className="text-slate-600 dark:text-slate-400">Ready to provide insights</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Log some wellness data or activities to receive personalized AI insights and recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const insight = insights[currentInsight];

  return (
    <Card className="glassmorphism" data-testid="ai-coach">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-sage-500 rounded-full flex items-center justify-center animate-pulse-slow">
            <i className="fas fa-robot text-white text-2xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">AI Wellness Coach</h3>
            <p className="text-slate-600 dark:text-slate-400">Personalized insights ready</p>
          </div>
        </div>

        {insight && (
          <div className={`border-l-4 border-gradient-to-b ${getInsightColor(insight.type, insight.priority)} pl-6 py-4 bg-white/5 rounded-r-lg mb-4`}>
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 bg-gradient-to-r ${getInsightColor(insight.type, insight.priority)} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                <i className={`fas ${getInsightIcon(insight.type)} text-white text-sm`}></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-slate-800 dark:text-white">{insight.title}</h4>
                  <Badge className={getPriorityBadge(insight.priority)} data-testid="insight-priority">
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{insight.description}</p>
                {insight.action && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-sage-500 to-ocean-500 hover:from-sage-600 hover:to-ocean-600"
                    data-testid="insight-action"
                  >
                    {insight.action} <i className="fas fa-arrow-right ml-1"></i>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {insights.length > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex space-x-1">
              {insights.map((_, index) => (
                <button
                  key={index}
                  data-testid={`insight-indicator-${index}`}
                  onClick={() => setCurrentInsight(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentInsight ? 'bg-sage-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="insight-prev"
                onClick={() => setCurrentInsight(Math.max(0, currentInsight - 1))}
                disabled={currentInsight === 0}
              >
                <i className="fas fa-chevron-left"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="insight-next"
                onClick={() => setCurrentInsight(Math.min(insights.length - 1, currentInsight + 1))}
                disabled={currentInsight === insights.length - 1}
              >
                <i className="fas fa-chevron-right"></i>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

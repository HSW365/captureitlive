import OpenAI from "openai";

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getOpenAIClient(): OpenAI {
  if (!openai) {
    throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your secrets.');
  }
  return openai;
}

export interface WellnessInsight {
  type: 'recommendation' | 'achievement' | 'concern';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface BiometricAnalysis {
  overall_score: number; // 0-100
  insights: WellnessInsight[];
  recommendations: {
    sleep: string;
    stress: string;
    activity: string;
    nutrition: string;
  };
}

export async function analyzeWellnessData(data: {
  heartRate?: number;
  sleepHours?: number;
  sleepQuality?: number;
  stressLevel?: number;
  steps?: number;
  mood?: string;
  recentActivities?: string[];
}): Promise<BiometricAnalysis> {
  try {
    const prompt = `Analyze this wellness data and provide personalized insights and recommendations in JSON format:

    Heart Rate: ${data.heartRate || 'N/A'} BPM
    Sleep: ${data.sleepHours || 'N/A'} hours, Quality: ${data.sleepQuality || 'N/A'}%
    Stress Level: ${data.stressLevel || 'N/A'}%
    Steps: ${data.steps || 'N/A'}
    Mood: ${data.mood || 'N/A'}
    Recent Activities: ${data.recentActivities?.join(', ') || 'None'}

    Provide a wellness analysis with:
    - overall_score (0-100): Overall wellness score
    - insights: Array of specific insights about the data
    - recommendations: Specific recommendations for sleep, stress, activity, and nutrition

    Format as JSON with this structure:
    {
      "overall_score": number,
      "insights": [
        {
          "type": "recommendation|achievement|concern",
          "title": "string",
          "description": "string", 
          "action": "string (optional)",
          "priority": "low|medium|high"
        }
      ],
      "recommendations": {
        "sleep": "string",
        "stress": "string", 
        "activity": "string",
        "nutrition": "string"
      }
    }`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a certified wellness coach and health expert. Provide personalized, actionable wellness insights based on biometric data. Focus on positive reinforcement and practical recommendations. Be encouraging and supportive."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as BiometricAnalysis;
  } catch (error) {
    console.error('Error analyzing wellness data:', error);
    
    // Fallback response
    return {
      overall_score: 75,
      insights: [{
        type: 'recommendation',
        title: 'Keep Up the Good Work',
        description: 'Your wellness journey is progressing well. Continue with your current habits.',
        priority: 'medium'
      }],
      recommendations: {
        sleep: 'Aim for 7-9 hours of quality sleep each night.',
        stress: 'Practice deep breathing or meditation for 10 minutes daily.',
        activity: 'Try to get 150 minutes of moderate exercise per week.',
        nutrition: 'Focus on whole foods and stay hydrated.'
      }
    };
  }
}

export async function generateTherapyResponse(
  userMessage: string,
  context: {
    mood?: string;
    recentTopics?: string[];
    sessionType?: string;
  }
): Promise<string> {
  try {
    const systemPrompt = `You are a compassionate, professional AI wellness therapist. Provide supportive, therapeutic responses that:

    1. Validate emotions and experiences
    2. Ask thoughtful follow-up questions
    3. Offer practical coping strategies when appropriate
    4. Maintain professional boundaries
    5. Encourage healthy behaviors and self-care
    6. Recognize when issues may need professional human intervention

    Context:
    - Current mood: ${context.mood || 'unknown'}
    - Recent session topics: ${context.recentTopics?.join(', ') || 'none'}
    - Session type: ${context.sessionType || 'general'}

    Keep responses conversational, empathetic, and under 200 words. If the user expresses thoughts of self-harm or suicide, provide crisis resources and encourage immediate professional help.`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm here to listen and support you. Could you tell me more about what you're experiencing?";
  } catch (error) {
    console.error('Error generating therapy response:', error);
    return "I'm here to support you. Could you share more about what's on your mind today?";
  }
}

export async function detectCrisisContent(message: string): Promise<{
  isCrisis: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'emotional' | 'anxiety' | 'depression' | 'suicidal';
  confidence: number;
}> {
  try {
    const prompt = `Analyze this message for crisis indicators and mental health concerns. Respond in JSON format:

    Message: "${message}"

    Evaluate for:
    - Signs of self-harm or suicidal ideation
    - Severe depression or anxiety
    - Emotional crisis
    - Substance abuse references
    - Relationship violence

    Provide assessment as JSON:
    {
      "isCrisis": boolean,
      "severity": "low|medium|high|critical",
      "type": "emotional|anxiety|depression|suicidal",
      "confidence": number (0-1)
    }`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a mental health crisis detection system. Analyze text for signs of mental health crisis with high sensitivity to protect user safety."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      isCrisis: result.isCrisis || false,
      severity: result.severity || 'low',
      type: result.type || 'emotional',
      confidence: result.confidence || 0
    };
  } catch (error) {
    console.error('Error detecting crisis content:', error);
    
    // Default to safe response if analysis fails
    const suicideKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead'];
    const harmKeywords = ['hurt myself', 'self-harm', 'cutting', 'overdose'];
    
    const lowerMessage = message.toLowerCase();
    const hasSuicideKeywords = suicideKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasHarmKeywords = harmKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasSuicideKeywords) {
      return { isCrisis: true, severity: 'critical', type: 'suicidal', confidence: 0.9 };
    } else if (hasHarmKeywords) {
      return { isCrisis: true, severity: 'high', type: 'emotional', confidence: 0.8 };
    }
    
    return { isCrisis: false, severity: 'low', type: 'emotional', confidence: 0.3 };
  }
}

export function calculateKarmaReward(activityType: string, duration?: number, quality?: number): number {
  const baseRewards: Record<string, number> = {
    meditation: 10,
    workout: 15,
    breathing: 5,
    journaling: 8,
    community_help: 25,
    challenge_completion: 50,
    daily_goal: 20,
    environmental_action: 30,
    crisis_support: 100
  };

  let baseReward = baseRewards[activityType] || 5;
  
  // Duration bonus (1 point per 5 minutes, max 20 bonus)
  if (duration) {
    const durationBonus = Math.min(Math.floor(duration / 5), 20);
    baseReward += durationBonus;
  }
  
  // Quality bonus (10% to 50% based on quality score)
  if (quality && quality > 50) {
    const qualityMultiplier = 1 + ((quality - 50) / 100);
    baseReward = Math.floor(baseReward * qualityMultiplier);
  }
  
  return baseReward;
}

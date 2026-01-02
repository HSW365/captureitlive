import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  analyzeWellnessData,
  generateTherapyResponse,
  detectCrisisContent,
  calculateKarmaReward
} from "./wellness";
import {
  insertBiometricSchema,
  insertPostSchema,
  insertTherapySessionSchema,
  insertTherapyMessageSchema,
  insertWellnessActivitySchema,
  insertKarmaTransactionSchema,
  insertEnvironmentalImpactSchema,
  insertCrisisSupportSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Biometric routes
  app.post('/api/biometrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const biometricData = insertBiometricSchema.parse({
        ...req.body,
        userId
      });

      const biometric = await storage.createBiometric(biometricData);
      
      // Analyze wellness data and provide insights
      const analysis = await analyzeWellnessData({
        heartRate: biometric.heartRate || undefined,
        sleepHours: biometric.sleepHours ? parseFloat(biometric.sleepHours) : undefined,
        sleepQuality: biometric.sleepQuality || undefined,
        stressLevel: biometric.stressLevel || undefined,
        steps: biometric.steps || undefined,
        mood: biometric.mood || undefined
      });

      // Award karma for logging biometrics
      const karmaReward = calculateKarmaReward('biometric_logging', undefined, analysis.overall_score);
      await storage.addKarmaTransaction({
        userId,
        amount: karmaReward,
        reason: 'biometric_logging',
        description: 'Logged biometric data',
        relatedId: biometric.id,
        relatedType: 'biometric'
      });

      res.json({ biometric, analysis, karmaEarned: karmaReward });
    } catch (error) {
      console.error("Error creating biometric:", error);
      res.status(400).json({ message: "Failed to create biometric entry" });
    }
  });

  app.get('/api/biometrics/latest', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const biometric = await storage.getLatestBiometrics(userId);
      res.json(biometric);
    } catch (error) {
      console.error("Error fetching biometrics:", error);
      res.status(500).json({ message: "Failed to fetch biometrics" });
    }
  });

  app.get('/api/biometrics/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const days = parseInt(req.query.days as string) || 7;
      const history = await storage.getBiometricHistory(userId, days);
      res.json(history);
    } catch (error) {
      console.error("Error fetching biometric history:", error);
      res.status(500).json({ message: "Failed to fetch biometric history" });
    }
  });

  // Post routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse({
        ...req.body,
        userId
      });

      const post = await storage.createPost(postData);
      
      // Award karma for creating posts
      const karmaReward = calculateKarmaReward('community_post');
      await storage.addKarmaTransaction({
        userId,
        amount: karmaReward,
        reason: 'community_post',
        description: 'Created community post',
        relatedId: post.id,
        relatedType: 'post'
      });

      res.json({ post, karmaEarned: karmaReward });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/posts', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const posts = await storage.getPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/featured', async (req, res) => {
    try {
      const posts = await storage.getFeaturedPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      res.status(500).json({ message: "Failed to fetch featured posts" });
    }
  });

  app.post('/api/posts/:id/engage', isAuthenticated, async (req: any, res) => {
    try {
      const postId = req.params.id;
      const { type } = req.body; // 'like', 'comment', 'share'
      
      if (!['like', 'comment', 'share'].includes(type)) {
        return res.status(400).json({ message: "Invalid engagement type" });
      }

      await storage.updatePostEngagement(postId, type);
      
      // Award karma for engagement
      const userId = req.user.claims.sub;
      const karmaReward = type === 'like' ? 1 : type === 'comment' ? 3 : 2;
      await storage.addKarmaTransaction({
        userId,
        amount: karmaReward,
        reason: 'community_engagement',
        description: `${type} on community post`,
        relatedId: postId,
        relatedType: 'post'
      });

      res.json({ success: true, karmaEarned: karmaReward });
    } catch (error) {
      console.error("Error engaging with post:", error);
      res.status(500).json({ message: "Failed to engage with post" });
    }
  });

  // Community routes
  app.get('/api/community/groups', async (req, res) => {
    try {
      const location = req.query.location as string;
      const groups = await storage.getCommunityGroups(location);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching community groups:", error);
      res.status(500).json({ message: "Failed to fetch community groups" });
    }
  });

  app.post('/api/community/groups/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupId = req.params.id;
      
      await storage.joinGroup(userId, groupId);
      
      // Award karma for joining community
      const karmaReward = calculateKarmaReward('community_join');
      await storage.addKarmaTransaction({
        userId,
        amount: karmaReward,
        reason: 'community_join',
        description: 'Joined wellness community group',
        relatedId: groupId,
        relatedType: 'group'
      });

      res.json({ success: true, karmaEarned: karmaReward });
    } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ message: "Failed to join group" });
    }
  });

  // Therapy routes
  app.post('/api/therapy/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertTherapySessionSchema.parse({
        ...req.body,
        userId
      });

      const session = await storage.createTherapySession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating therapy session:", error);
      res.status(400).json({ message: "Failed to create therapy session" });
    }
  });

  app.post('/api/therapy/messages', isAuthenticated, async (req: any, res) => {
    try {
      const messageData = insertTherapyMessageSchema.parse(req.body);
      
      // Check for crisis content if this is a user message
      if (messageData.role === 'user') {
        const crisisDetection = await detectCrisisContent(messageData.content);
        
        if (crisisDetection.isCrisis && crisisDetection.severity === 'critical') {
          // Create crisis support record
          const userId = req.user?.claims?.sub;
          if (userId) {
            await storage.createCrisisSupport({
              userId,
              severity: crisisDetection.severity,
              type: crisisDetection.type,
              supportProvided: 'Crisis detected in AI therapy session',
              followUpRequired: true
            });
          }
          
          return res.json({
            message: await storage.addTherapyMessage(messageData),
            crisisDetected: true,
            crisisResponse: "I'm very concerned about what you've shared. Please reach out to a crisis counselor immediately or call 988 (Suicide & Crisis Lifeline) if you're in the US. You don't have to go through this alone."
          });
        }
      }

      const message = await storage.addTherapyMessage(messageData);
      
      // Generate AI response if this was a user message
      if (messageData.role === 'user') {
        const aiResponse = await generateTherapyResponse(messageData.content, {
          sessionType: 'chat'
        });
        
        const aiMessage = await storage.addTherapyMessage({
          sessionId: messageData.sessionId,
          role: 'assistant',
          content: aiResponse
        });
        
        res.json({ userMessage: message, aiMessage });
      } else {
        res.json({ message });
      }
    } catch (error) {
      console.error("Error adding therapy message:", error);
      res.status(400).json({ message: "Failed to add therapy message" });
    }
  });

  app.get('/api/therapy/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getTherapySessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching therapy sessions:", error);
      res.status(500).json({ message: "Failed to fetch therapy sessions" });
    }
  });

  app.get('/api/therapy/sessions/:id/messages', isAuthenticated, async (req, res) => {
    try {
      const sessionId = req.params.id;
      const messages = await storage.getTherapyMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching therapy messages:", error);
      res.status(500).json({ message: "Failed to fetch therapy messages" });
    }
  });

  // Wellness activities routes
  app.post('/api/wellness/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activityData = insertWellnessActivitySchema.parse({
        ...req.body,
        userId
      });

      const activity = await storage.createWellnessActivity(activityData);
      
      // Award karma for completing wellness activities
      const karmaReward = calculateKarmaReward(
        activity.type,
        activity.duration || undefined,
        activity.intensity === 'high' ? 90 : activity.intensity === 'medium' ? 70 : 50
      );
      
      await storage.addKarmaTransaction({
        userId,
        amount: karmaReward,
        reason: 'wellness_activity',
        description: `Completed ${activity.type} activity`,
        relatedId: activity.id,
        relatedType: 'activity'
      });

      res.json({ activity, karmaEarned: karmaReward });
    } catch (error) {
      console.error("Error creating wellness activity:", error);
      res.status(400).json({ message: "Failed to create wellness activity" });
    }
  });

  app.get('/api/wellness/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getUserActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching wellness activities:", error);
      res.status(500).json({ message: "Failed to fetch wellness activities" });
    }
  });

  // Karma routes
  app.get('/api/karma/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getUserKarmaHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching karma history:", error);
      res.status(500).json({ message: "Failed to fetch karma history" });
    }
  });

  // Environmental impact routes
  app.post('/api/environmental/impact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const impactData = insertEnvironmentalImpactSchema.parse({
        ...req.body,
        userId
      });

      const impact = await storage.addEnvironmentalImpact(impactData);
      
      // Award karma for environmental actions
      const karmaReward = calculateKarmaReward('environmental_action');
      await storage.addKarmaTransaction({
        userId,
        amount: karmaReward,
        reason: 'environmental_action',
        description: 'Contributed to environmental wellness',
        relatedId: impact.id,
        relatedType: 'environmental'
      });

      res.json({ impact, karmaEarned: karmaReward });
    } catch (error) {
      console.error("Error adding environmental impact:", error);
      res.status(400).json({ message: "Failed to add environmental impact" });
    }
  });

  app.get('/api/environmental/impact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const impact = await storage.getUserEnvironmentalImpact(userId);
      res.json(impact);
    } catch (error) {
      console.error("Error fetching environmental impact:", error);
      res.status(500).json({ message: "Failed to fetch environmental impact" });
    }
  });

  // Crisis support routes
  app.post('/api/crisis/support', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const crisisData = insertCrisisSupportSchema.parse({
        ...req.body,
        userId
      });

      const crisis = await storage.createCrisisSupport(crisisData);
      
      // Award karma for seeking help (encouraging help-seeking behavior)
      const karmaReward = calculateKarmaReward('crisis_support');
      await storage.addKarmaTransaction({
        userId,
        amount: karmaReward,
        reason: 'seeking_help',
        description: 'Reached out for crisis support',
        relatedId: crisis.id,
        relatedType: 'crisis'
      });

      res.json({ crisis, karmaEarned: karmaReward });
    } catch (error) {
      console.error("Error creating crisis support:", error);
      res.status(400).json({ message: "Failed to create crisis support record" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/global', async (req, res) => {
    try {
      const stats = await storage.getGlobalStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching global stats:", error);
      res.status(500).json({ message: "Failed to fetch global stats" });
    }
  });

  // WebSocket setup for real-time features
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Handle different types of real-time updates
        switch (data.type) {
          case 'biometric_update':
            // Broadcast biometric updates to relevant clients
            broadcastToUsers(wss, data.userId, {
              type: 'biometric_update',
              data: data.biometrics
            });
            break;
            
          case 'community_activity':
            // Broadcast community activities
            broadcastToAll(wss, {
              type: 'community_activity',
              data: data.activity
            });
            break;
            
          case 'wellness_achievement':
            // Broadcast wellness achievements
            broadcastToAll(wss, {
              type: 'wellness_achievement',
              data: data.achievement
            });
            break;
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    // Send welcome message
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to CaptureIt wellness network'
      }));
    }
  });

  return httpServer;
}

function broadcastToAll(wss: WebSocketServer, data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function broadcastToUsers(wss: WebSocketServer, userId: string, data: any) {
  // In a production app, you'd maintain user-to-websocket mapping
  // For now, broadcast to all clients
  broadcastToAll(wss, data);
}

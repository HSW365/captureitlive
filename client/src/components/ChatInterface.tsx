import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  crisisDetected?: boolean;
  crisisResponse?: string;
}

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading = false,
  crisisDetected = false,
  crisisResponse
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="chat-interface">
      {/* Crisis Alert */}
      {crisisDetected && crisisResponse && (
        <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800" data-testid="crisis-alert">
          <i className="fas fa-exclamation-triangle text-red-500"></i>
          <AlertDescription className="text-red-700 dark:text-red-300">
            {crisisResponse}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Container */}
      <Card className="flex-1 bg-white dark:bg-slate-800">
        <CardContent className="p-6 h-96 overflow-y-auto" data-testid="chat-messages">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`chat-message-${message.role}`}
              >
                <div className="flex items-start space-x-3 max-w-[80%]">
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-robot text-white text-sm"></i>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-sage-50 dark:bg-sage-900/20 text-slate-700 dark:text-slate-300'
                        : 'bg-lavender-50 dark:bg-lavender-900/20 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap" data-testid="message-content">
                      {message.content}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2" data-testid="message-timestamp">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user text-white text-sm"></i>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start" data-testid="typing-indicator">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-white text-sm"></i>
                  </div>
                  <div className="bg-lavender-50 dark:bg-lavender-900/20 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-lavender-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-lavender-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-lavender-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <div className="flex items-center space-x-4 mt-4">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          data-testid="chat-input"
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          data-testid="chat-send-button"
          className="bg-gradient-to-r from-sage-500 to-ocean-500 hover:from-sage-600 hover:to-ocean-600"
        >
          <i className="fas fa-paper-plane"></i>
        </Button>
      </div>

      {/* Safety Notice */}
      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <i className="fas fa-shield-alt text-amber-600 mt-1"></i>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Privacy & Safety</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Your conversations are encrypted and private. If you're experiencing a crisis, 
              please use our emergency support or contact local emergency services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

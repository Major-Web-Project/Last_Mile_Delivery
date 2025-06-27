
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

interface AIAssistantProps {
  onClose: () => void;
  context: 'agent' | 'customer' | 'dashboard';
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = ({ onClose, context }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: getWelcomeMessage(context),
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  function getWelcomeMessage(context: string) {
    switch (context) {
      case 'agent':
        return "Hi! I'm your AI delivery assistant. I can help you with route optimization, address verification, delay reporting, and customer communication. How can I help you today?";
      case 'customer':
        return "Hello! I'm here to help with your delivery. I can assist with rescheduling, address changes, delivery instructions, or any concerns you might have. What can I help you with?";
      case 'dashboard':
        return "Welcome to the AI Operations Assistant. I can help analyze delivery patterns, generate reports, optimize routes, and provide insights on fleet performance. What would you like to know?";
      default:
        return "Hello! How can I assist you today?";
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText, context);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, context: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Context-specific responses
    if (context === 'agent') {
      if (lowerInput.includes('delay') || lowerInput.includes('late')) {
        return "I understand there's a delay. I've automatically notified the customer with an updated ETA. Would you like me to suggest an alternative route or contact the customer directly?";
      }
      if (lowerInput.includes('address') || lowerInput.includes('location')) {
        return "I can help verify the address. Based on the delivery details, I've cross-referenced the address with our database. The corrected address is: 123 Main Street, Suite 4B. Should I update the delivery information?";
      }
      if (lowerInput.includes('route') || lowerInput.includes('traffic')) {
        return "I've analyzed current traffic conditions. There's heavy traffic on your current route. I recommend taking Highway 101 instead - it will save you approximately 8 minutes. Should I update your navigation?";
      }
    }
    
    if (context === 'customer') {
      if (lowerInput.includes('reschedule') || lowerInput.includes('change')) {
        return "I can help you reschedule your delivery. What time would work better for you today? I have availability between 2-4 PM and 6-8 PM.";
      }
      if (lowerInput.includes('where') || lowerInput.includes('location')) {
        return "Your delivery agent is currently 0.8 miles away and should arrive in approximately 12-15 minutes. They're on Oak Avenue heading towards your location.";
      }
      if (lowerInput.includes('problem') || lowerInput.includes('issue')) {
        return "I'm sorry to hear about the issue. Can you provide more details? I can connect you with your delivery agent or escalate this to our support team immediately.";
      }
    }

    if (context === 'dashboard') {
      if (lowerInput.includes('performance') || lowerInput.includes('analytics')) {
        return "Based on today's data: Average delivery time is 23 minutes (3% improvement from yesterday), on-time delivery rate is 94.2%, and customer satisfaction is 4.7/5. Would you like a detailed breakdown by agent or region?";
      }
      if (lowerInput.includes('optimize') || lowerInput.includes('improve')) {
        return "I've identified several optimization opportunities: Route efficiency can be improved by 12% by adjusting Agent Maria's route, and delivery clustering in the downtown area could reduce overall time by 15 minutes. Should I implement these suggestions?";
      }
    }

    // Generic helpful responses
    const genericResponses = [
      "I'm here to help! Can you provide more specific details about what you need assistance with?",
      "That's a great question. Let me analyze the current situation and provide you with the best recommendation.",
      "I understand your concern. Based on the current data, here's what I suggest...",
      "I'm processing your request. This might take a moment to provide you with the most accurate information."
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span>AI Assistant</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 p-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {message.text}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-slate-100 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputText.trim() || isTyping}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;

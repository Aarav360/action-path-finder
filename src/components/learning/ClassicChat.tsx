
import React, { useState } from 'react';
import { useTreeLearning } from '@/contexts/TreeLearningContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Plus } from 'lucide-react';

export const ClassicChat = () => {
  const { messages, nodes, sendMessage, isLoading, createRootNode } = useTreeLearning();
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    if (messages.length === 0) {
      // First message - create root node
      const response = await simulateInitialResponse(input);
      createRootNode(input, response);
    } else {
      await sendMessage(input);
    }
    
    setInput('');
  };

  const simulateInitialResponse = async (question: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `Great question about "${question}"! Let me provide you with a comprehensive overview. This topic involves several key areas that we can explore together: fundamental concepts, practical applications, and advanced techniques. Each of these areas has its own depth and can be broken down further based on your interests and learning goals.`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getNodeContext = (nodeId?: string) => {
    if (!nodeId || !nodes[nodeId]) return null;
    return nodes[nodeId].title;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-300px)]">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">Classic Learning Mode</h2>
        <p className="text-gray-600">Traditional chat interface with full conversation history</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl">
          {messages.map((message) => {
            const contextNode = getNodeContext(message.nodeId);
            
            return (
              <div key={message.id}>
                {contextNode && message.role === 'assistant' && (
                  <div className="text-xs text-blue-600 font-medium mb-2 ml-12">
                    📍 Context Node: {contextNode}
                  </div>
                )}
                
                <Card className={`p-4 ${
                  message.role === 'user' 
                    ? 'ml-12 bg-blue-50 border-blue-200' 
                    : 'mr-12 bg-gray-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-600 text-white'
                    }`}>
                      {message.role === 'user' ? 'You' : 'AI'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-3">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
          
          {isLoading && (
            <Card className="mr-12 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-medium">
                  AI
                </div>
                <div className="flex-1">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2 max-w-4xl">
          <Input
            placeholder={messages.length === 0 ? "What would you like to learn about?" : "Continue the conversation..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {messages.length > 0 && (
          <div className="mt-3 max-w-4xl">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Expand Tree (Coming Soon)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

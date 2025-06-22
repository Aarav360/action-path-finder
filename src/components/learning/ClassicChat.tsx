
import React, { useState } from 'react';
import { useTreeLearning } from '@/contexts/TreeLearningContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat messages area */}
      <ScrollArea className="flex-1 px-4">
        <div className="max-w-4xl mx-auto py-8">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Classic Learning Mode</h2>
              <p className="text-gray-500 mb-8">Start a conversation to begin your learning journey</p>
            </div>
          )}
          
          <div className="space-y-6">
            {messages.map((message) => {
              const contextNode = getNodeContext(message.nodeId);
              
              return (
                <div key={message.id} className="flex flex-col">
                  {contextNode && message.role === 'assistant' && (
                    <div className="text-xs text-blue-600 font-medium mb-2 ml-16">
                      📍 Context Node: {contextNode}
                    </div>
                  )}
                  
                  <div className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-medium flex-shrink-0">
                        AI
                      </div>
                    )}
                    
                    <div className={`max-w-3xl px-6 py-4 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-3 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium flex-shrink-0">
                        You
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-medium flex-shrink-0">
                  AI
                </div>
                <div className="max-w-3xl px-6 py-4 rounded-2xl bg-white border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                placeholder={messages.length === 0 ? "What would you like to learn about?" : "Continue the conversation..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="min-h-[48px] px-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              size="lg"
              className="h-12 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {messages.length > 0 && (
            <div className="mt-3 flex justify-center">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Expand Tree (Coming Soon)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

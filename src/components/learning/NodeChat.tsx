import React, { useState } from 'react';
import { useTreeLearning } from '@/contexts/TreeLearningContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X } from 'lucide-react';

interface NodeChatProps {
  onClose?: () => void;
}

export const NodeChat = ({ onClose }: NodeChatProps) => {
  const { nodes, selectedNodeId, sendMessage, isLoading } = useTreeLearning();
  const [input, setInput] = useState('');

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedNodeId) return;
    
    await sendMessage(input, selectedNodeId);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedNode) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="mb-2">Select a node to start chatting</p>
          <p className="text-sm">Click on any node in the tree to explore that concept</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{selectedNode.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Level {selectedNode.level + 1} • Context inherited from parent nodes</p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {selectedNode.messages.map((message) => (
            <Card key={message.id} className={`p-3 ${
              message.role === 'user' 
                ? 'ml-8 bg-blue-50 border-blue-200' 
                : 'mr-8 bg-gray-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
          
          {isLoading && (
            <Card className="mr-8 bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-medium">
                  AI
                </div>
                <div className="flex-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about this concept..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

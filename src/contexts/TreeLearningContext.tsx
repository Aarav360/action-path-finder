
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TreeNode {
  id: string;
  title: string;
  description: string;
  level: number;
  parentId?: string;
  children: string[];
  messages: ChatMessage[];
  x: number;
  y: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  nodeId?: string;
  contextNodes?: string[];
}

interface TreeLearningContextType {
  nodes: Record<string, TreeNode>;
  messages: ChatMessage[];
  selectedNodeId: string | null;
  isLoading: boolean;
  createRootNode: (question: string, response: string) => void;
  createChildNodes: (parentId: string, childTitles: string[]) => void;
  selectNode: (nodeId: string | null) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  sendMessage: (content: string, nodeId?: string) => Promise<void>;
}

const TreeLearningContext = createContext<TreeLearningContextType | undefined>(undefined);

export const useTreeLearning = () => {
  const context = useContext(TreeLearningContext);
  if (!context) {
    throw new Error('useTreeLearning must be used within TreeLearningProvider');
  }
  return context;
};

export const TreeLearningProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<Record<string, TreeNode>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const createRootNode = (question: string, response: string) => {
    const nodeId = generateId();
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: question,
      timestamp: new Date(),
      nodeId,
    };
    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      nodeId,
    };

    const newNode: TreeNode = {
      id: nodeId,
      title: question.length > 50 ? question.substring(0, 50) + '...' : question,
      description: response.length > 100 ? response.substring(0, 100) + '...' : response,
      level: 0,
      children: [],
      messages: [userMessage, assistantMessage],
      x: 50,
      y: 300,
    };

    setNodes({ [nodeId]: newNode });
    setMessages([userMessage, assistantMessage]);
    setSelectedNodeId(nodeId);
  };

  const createChildNodes = (parentId: string, childTitles: string[]) => {
    const parent = nodes[parentId];
    if (!parent) return;

    const newNodes = { ...nodes };
    const childIds: string[] = [];

    childTitles.forEach((title, index) => {
      const childId = generateId();
      childIds.push(childId);
      
      newNodes[childId] = {
        id: childId,
        title,
        description: `Learn more about ${title}`,
        level: parent.level + 1,
        parentId,
        children: [],
        messages: [],
        x: parent.x + 250,
        y: parent.y - (childTitles.length - 1) * 60 + index * 120,
      };
    });

    newNodes[parentId] = {
      ...parent,
      children: [...parent.children, ...childIds],
    };

    setNodes(newNodes);
  };

  const selectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    if (message.nodeId && nodes[message.nodeId]) {
      setNodes(prev => ({
        ...prev,
        [message.nodeId!]: {
          ...prev[message.nodeId!],
          messages: [...prev[message.nodeId!].messages, newMessage],
        },
      }));
    }
  };

  const sendMessage = async (content: string, nodeId?: string) => {
    setIsLoading(true);
    
    try {
      // Add user message
      addMessage({
        role: 'user',
        content,
        nodeId,
        contextNodes: nodeId ? getContextNodes(nodeId) : undefined,
      });

      // Get context for the message
      const context = nodeId ? buildContextString(nodeId) : '';
      
      // Simulate API call (replace with actual OpenAI integration)
      const response = await simulateAIResponse(content, context);
      
      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response,
        nodeId,
        contextNodes: nodeId ? getContextNodes(nodeId) : undefined,
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getContextNodes = (nodeId: string): string[] => {
    const contextNodes = [nodeId];
    let currentNode = nodes[nodeId];
    
    // Add parent nodes for context
    while (currentNode?.parentId) {
      contextNodes.unshift(currentNode.parentId);
      currentNode = nodes[currentNode.parentId];
    }
    
    return contextNodes;
  };

  const buildContextString = (nodeId: string): string => {
    const contextNodes = getContextNodes(nodeId);
    let context = '';
    
    contextNodes.forEach(id => {
      const node = nodes[id];
      if (node) {
        context += `Node: ${node.title}\n`;
        node.messages.forEach(msg => {
          context += `${msg.role}: ${msg.content}\n`;
        });
        context += '\n';
      }
    });
    
    return context;
  };

  const simulateAIResponse = async (content: string, context: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response simulation - replace with actual OpenAI API call
    const responses = [
      "That's a great question! Let me explain this concept in more detail...",
      "I understand what you're asking about. Here's how this works...",
      "This is an important topic. Let me break it down for you...",
      "Excellent point! This connects to several key concepts...",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           ` Based on our discussion about "${context.split('Node:')[1]?.split('\n')[0] || 'this topic'}", here's what you should know...`;
  };

  return (
    <TreeLearningContext.Provider
      value={{
        nodes,
        messages,
        selectedNodeId,
        isLoading,
        createRootNode,
        createChildNodes,
        selectNode,
        addMessage,
        sendMessage,
      }}
    >
      {children}
    </TreeLearningContext.Provider>
  );
};

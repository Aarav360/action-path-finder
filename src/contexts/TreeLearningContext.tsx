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

  const generateChildConcepts = (parentTitle: string, parentContent: string): string[] => {
    const concepts: Record<string, string[]> = {};
    
    // Define concept mappings for common learning topics
    if (parentTitle.toLowerCase().includes('coding') || parentTitle.toLowerCase().includes('programming')) {
      return ['Programming Languages', 'Development Environments', 'Basic Syntax', 'Data Structures', 'Algorithms'];
    }
    
    if (parentTitle.toLowerCase().includes('machine learning') || parentTitle.toLowerCase().includes('ai')) {
      return ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Model Training', 'Data Preprocessing'];
    }
    
    if (parentTitle.toLowerCase().includes('mathematics') || parentTitle.toLowerCase().includes('math')) {
      return ['Algebra', 'Calculus', 'Statistics', 'Geometry', 'Number Theory'];
    }
    
    if (parentTitle.toLowerCase().includes('history')) {
      return ['Ancient Civilizations', 'Medieval Period', 'Renaissance', 'Industrial Revolution', 'Modern Era'];
    }
    
    if (parentTitle.toLowerCase().includes('science')) {
      return ['Physics', 'Chemistry', 'Biology', 'Scientific Method', 'Laboratory Techniques'];
    }
    
    if (parentTitle.toLowerCase().includes('language') || parentContent.toLowerCase().includes('language')) {
      return ['Grammar', 'Vocabulary', 'Pronunciation', 'Writing Skills', 'Conversation Practice'];
    }
    
    // Extract key topics from the content for more specific suggestions
    const keyTopics = extractKeyTopics(parentContent);
    if (keyTopics.length > 0) {
      return keyTopics;
    }
    
    // Default fallback concepts
    return ['Core Concepts', 'Practical Applications', 'Advanced Topics', 'Common Challenges', 'Best Practices'];
  };

  const extractKeyTopics = (content: string): string[] => {
    const topics: string[] = [];
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      // Look for patterns like "types of", "kinds of", "include", etc.
      const typePatterns = [
        /types of ([^,.:;]+)/gi,
        /kinds of ([^,.:;]+)/gi,
        /include ([^,.:;]+)/gi,
        /such as ([^,.:;]+)/gi,
        /examples are ([^,.:;]+)/gi
      ];
      
      typePatterns.forEach(pattern => {
        const matches = sentence.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const topic = match.replace(pattern, '$1').trim();
            if (topic.length > 3 && topic.length < 30) {
              // Capitalize first letter
              const formatted = topic.charAt(0).toUpperCase() + topic.slice(1);
              topics.push(formatted);
            }
          });
        }
      });
    });
    
    return topics.slice(0, 5); // Limit to 5 topics
  };

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

  const createChildNodes = (parentId: string, childTitles?: string[]) => {
    const parent = nodes[parentId];
    if (!parent) return;

    const newNodes = { ...nodes };
    const childIds: string[] = [];
    
    // Generate specific child concepts if not provided
    const conceptTitles = childTitles || generateChildConcepts(parent.title, parent.description);

    conceptTitles.forEach((title, index) => {
      const childId = generateId();
      childIds.push(childId);
      
      newNodes[childId] = {
        id: childId,
        title,
        description: `Learn more about ${title.toLowerCase()} in the context of ${parent.title.toLowerCase()}`,
        level: parent.level + 1,
        parentId,
        children: [],
        messages: [],
        x: parent.x + 250,
        y: parent.y - (conceptTitles.length - 1) * 60 + index * 120,
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
      const response = await simulateAIResponse(content, context, nodeId);
      
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

  const simulateAIResponse = async (content: string, context: string, nodeId?: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentNode = nodeId ? nodes[nodeId] : null;
    const nodeTopic = currentNode?.title || 'this topic';
    
    // Generate more contextually relevant responses
    const responses = [
      `Great question about ${nodeTopic.toLowerCase()}! Let me explain this concept in detail. This is fundamental to understanding how these principles work in practice.`,
      `I understand what you're asking about ${nodeTopic.toLowerCase()}. Here's how this connects to the broader concepts we've been discussing.`,
      `This is an important aspect of ${nodeTopic.toLowerCase()}. Let me break down the key components and how they relate to each other.`,
      `Excellent point about ${nodeTopic.toLowerCase()}! This connects to several key principles that are worth exploring further.`,
    ];
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add more specific content based on the node topic
    let specificContent = '';
    if (currentNode?.title.toLowerCase().includes('programming') || currentNode?.title.toLowerCase().includes('language')) {
      specificContent = ' Programming languages can be categorized by their level of abstraction, syntax style, and intended use cases. Each has unique strengths and trade-offs.';
    } else if (currentNode?.title.toLowerCase().includes('algorithm')) {
      specificContent = ' Algorithms are step-by-step procedures for solving problems efficiently. The choice of algorithm significantly impacts performance and resource usage.';
    } else if (currentNode?.title.toLowerCase().includes('data')) {
      specificContent = ' Data structures organize information in memory to enable efficient access and manipulation. Different structures optimize for different types of operations.';
    }
    
    return baseResponse + specificContent + ' What specific aspect would you like to explore further?';
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

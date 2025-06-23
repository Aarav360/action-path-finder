import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreeView } from '@/components/learning/TreeView';
import { ClassicChat } from '@/components/learning/ClassicChat';
import { NodeChat } from '@/components/learning/NodeChat';
import { TreeLearningProvider, useTreeLearning } from '@/contexts/TreeLearningContext';
import { Separator } from '@/components/ui/separator';

const TreeLearning = () => {
  return (
    <TreeLearningProvider>
      <div className="min-h-screen bg-white">
        <Tabs defaultValue="tree" className="w-full h-screen">
          <TabsContent value="tree" className="space-y-0 h-full">
            <TreeModeLayout />
          </TabsContent>
          
          <TabsContent value="classic" className="space-y-0 h-full">
            <ClassicModeLayout />
          </TabsContent>
        </Tabs>
      </div>
    </TreeLearningProvider>
  );
};

const TreeModeLayout = () => {
  const { selectedNodeId, selectNode, nodes } = useTreeLearning();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleNodeSelect = (nodeId: string) => {
    if (selectedNodeId === nodeId && isChatOpen) {
      // Close chat if same node is clicked
      setIsChatOpen(false);
      selectNode(null);
    } else {
      // Open chat for selected node
      selectNode(nodeId);
      setIsChatOpen(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tree Learning Interface</h1>
            <p className="text-gray-600">Explore knowledge through connected concepts and hierarchical understanding</p>
          </div>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="tree" className="data-[state=active]:bg-white">Tree Mode</TabsTrigger>
            <TabsTrigger value="classic" className="data-[state=active]:bg-white">Classic Mode</TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Tree View - Full width when chat closed, partial when open */}
        <div className={`transition-all duration-300 ease-in-out ${
          isChatOpen ? 'w-1/2' : 'w-full'
        } h-full`}>
          <TreeView onNodeSelect={handleNodeSelect} />
        </div>

        {/* Sliding Chat Panel */}
        <div className={`absolute right-0 top-0 h-full bg-white border-l border-gray-200 transition-all duration-300 ease-in-out transform ${
          isChatOpen ? 'translate-x-0 w-1/2' : 'translate-x-full w-1/2'
        }`}>
          {isChatOpen && selectedNodeId && (
            <NodeChat 
              onClose={() => {
                setIsChatOpen(false);
                selectNode(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ClassicModeLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Main chat area */}
      <div className="flex-1">
        <ClassicChat />
      </div>
      
      {/* Right sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tree Learning Interface</h1>
          <p className="text-gray-600 text-sm">Explore knowledge through connected concepts and hierarchical understanding</p>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="mb-6">
          <TabsList className="w-full">
            <TabsTrigger value="tree" className="flex-1">Tree Mode</TabsTrigger>
            <TabsTrigger value="classic" className="flex-1">Classic Mode</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1">
          <div className="text-sm text-gray-500">
            <p className="mb-2">💡 <strong>Tip:</strong> Switch to Tree Mode to visualize your learning journey as connected concepts.</p>
            <p>Your conversations will automatically create knowledge nodes that you can explore and expand upon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeLearning;

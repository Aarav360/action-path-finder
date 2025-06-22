
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreeView } from '@/components/learning/TreeView';
import { ClassicChat } from '@/components/learning/ClassicChat';
import { NodeChat } from '@/components/learning/NodeChat';
import { TreeLearningProvider } from '@/contexts/TreeLearningContext';
import { Separator } from '@/components/ui/separator';

const TreeLearning = () => {
  return (
    <TreeLearningProvider>
      <div className="min-h-screen bg-gray-50">
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
  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tree Learning Interface</h1>
              <p className="text-gray-600">Explore knowledge through connected concepts and hierarchical understanding</p>
            </div>
            <TabsList>
              <TabsTrigger value="tree">Tree Mode</TabsTrigger>
              <TabsTrigger value="classic">Classic Mode</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <Card className="p-4 overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">Knowledge Tree</h2>
            <TreeView />
          </Card>
          
          <Card className="p-4">
            <NodeChat />
          </Card>
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


import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreeView } from '@/components/learning/TreeView';
import { ClassicChat } from '@/components/learning/ClassicChat';
import { NodeChat } from '@/components/learning/NodeChat';
import { TreeLearningProvider } from '@/contexts/TreeLearningContext';

const TreeLearning = () => {
  return (
    <TreeLearningProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tree Learning Interface</h1>
            <p className="text-gray-600">Explore knowledge through connected concepts and hierarchical understanding</p>
          </div>
          
          <Tabs defaultValue="tree" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tree">Tree Mode</TabsTrigger>
              <TabsTrigger value="classic">Classic Mode</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tree" className="space-y-0">
              <TreeModeLayout />
            </TabsContent>
            
            <TabsContent value="classic" className="space-y-0">
              <ClassicModeLayout />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TreeLearningProvider>
  );
};

const TreeModeLayout = () => {
  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      <Card className="p-4 overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Knowledge Tree</h2>
        <TreeView />
      </Card>
      
      <Card className="p-4">
        <NodeChat />
      </Card>
    </div>
  );
};

const ClassicModeLayout = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <ClassicChat />
      </Card>
    </div>
  );
};

export default TreeLearning;

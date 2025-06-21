
import React, { useEffect, useRef } from 'react';
import { useTreeLearning } from '@/contexts/TreeLearningContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const TreeView = () => {
  const { nodes, selectedNodeId, selectNode, createChildNodes } = useTreeLearning();
  const svgRef = useRef<SVGSVGElement>(null);

  const nodeEntries = Object.entries(nodes);

  const handleNodeClick = (nodeId: string) => {
    selectNode(nodeId);
  };

  const handleCreateChildren = (nodeId: string) => {
    // For demo purposes, create sample child nodes
    const sampleChildren = ['Concept A', 'Concept B', 'Concept C'];
    createChildNodes(nodeId, sampleChildren);
  };

  const renderConnections = () => {
    return nodeEntries.map(([nodeId, node]) => {
      if (!node.parentId) return null;
      
      const parent = nodes[node.parentId];
      if (!parent) return null;

      return (
        <path
          key={`connection-${nodeId}`}
          d={`M ${parent.x + 20} ${parent.y + 20} Q ${parent.x + 135} ${parent.y + 20} ${node.x} ${node.y + 20}`}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          className="opacity-60"
        />
      );
    });
  };

  if (nodeEntries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Start a conversation to begin building your knowledge tree</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-auto">
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ minWidth: '800px', minHeight: '600px' }}
      >
        {renderConnections()}
        
        {nodeEntries.map(([nodeId, node]) => (
          <g key={nodeId}>
            <circle
              cx={node.x + 20}
              cy={node.y + 20}
              r="8"
              fill={selectedNodeId === nodeId ? '#3b82f6' : '#6b7280'}
              className="cursor-pointer hover:fill-blue-500 transition-colors"
              onClick={() => handleNodeClick(nodeId)}
            />
            
            <foreignObject
              x={node.x + 35}
              y={node.y}
              width="180"
              height="40"
              className="cursor-pointer"
              onClick={() => handleNodeClick(nodeId)}
            >
              <div className={`p-2 rounded-md text-sm font-medium transition-colors ${
                selectedNodeId === nodeId 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                {node.title}
              </div>
            </foreignObject>
            
            {node.children.length === 0 && (
              <foreignObject
                x={node.x + 220}
                y={node.y + 5}
                width="30"
                height="30"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0"
                  onClick={() => handleCreateChildren(nodeId)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </foreignObject>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

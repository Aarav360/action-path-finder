import React, { useEffect, useRef } from 'react';
import { useTreeLearning } from '@/contexts/TreeLearningContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TreeViewProps {
  onNodeSelect?: (nodeId: string) => void;
}

export const TreeView = ({ onNodeSelect }: TreeViewProps) => {
  const { nodes, selectedNodeId, selectNode, createChildNodes } = useTreeLearning();
  const svgRef = useRef<SVGSVGElement>(null);

  const nodeEntries = Object.entries(nodes);

  const handleNodeClick = (nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    } else {
      selectNode(nodeId);
    }
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
      <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Tree Learning Mode</h2>
          <p className="text-gray-500 mb-2">Start a conversation in Classic Mode to begin building your knowledge tree</p>
          <p className="text-sm text-gray-400">Or create your first learning concept to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-auto bg-gray-50">
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
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200'
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
                  className="w-8 h-8 p-0 bg-white shadow-sm"
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

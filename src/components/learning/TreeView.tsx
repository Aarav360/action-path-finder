
import React, { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useTreeLearning } from '@/contexts/TreeLearningContext';
import { Button } from '@/components/ui/button';
import { Plus, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface TreeViewProps {
  onNodeSelect?: (nodeId: string) => void;
}

export const TreeView = ({ onNodeSelect }: TreeViewProps) => {
  const { nodes, selectedNodeId, selectNode, createChildNodes } = useTreeLearning();
  const svgRef = useRef<SVGSVGElement>(null);

  const nodeEntries = Object.entries(nodes);

  // Calculate positions for nodes in a pyramid/tree shape
  const calculateNodePositions = () => {
    const positionedNodes: { [key: string]: { x: number; y: number } } = {};
    
    // Group nodes by level
    const nodesByLevel: { [level: number]: string[] } = {};
    const nodesByParent: { [parentId: string]: string[] } = {};
    
    nodeEntries.forEach(([nodeId, node]) => {
      if (!nodesByLevel[node.level]) {
        nodesByLevel[node.level] = [];
      }
      nodesByLevel[node.level].push(nodeId);
      
      if (node.parentId) {
        if (!nodesByParent[node.parentId]) {
          nodesByParent[node.parentId] = [];
        }
        nodesByParent[node.parentId].push(nodeId);
      }
    });

    const LEVEL_HEIGHT = 200;
    const BASE_X = 600; // Center point for root node
    
    // Position nodes level by level
    Object.keys(nodesByLevel).sort((a, b) => parseInt(a) - parseInt(b)).forEach(levelStr => {
      const level = parseInt(levelStr);
      const nodesAtLevel = nodesByLevel[level];
      
      if (level === 0) {
        // Root node at center top
        const rootId = nodesAtLevel[0];
        positionedNodes[rootId] = { x: BASE_X, y: 100 };
      } else {
        // For each level, position children under their parents
        const levelNodes: Array<{ nodeId: string; parentId: string; siblingIndex: number; totalSiblings: number }> = [];
        
        // Collect all nodes at this level with their parent info
        nodesAtLevel.forEach(nodeId => {
          const node = nodes[nodeId];
          if (node.parentId && nodesByParent[node.parentId]) {
            const siblings = nodesByParent[node.parentId];
            const siblingIndex = siblings.indexOf(nodeId);
            levelNodes.push({
              nodeId,
              parentId: node.parentId,
              siblingIndex,
              totalSiblings: siblings.length
            });
          }
        });
        
        // Position each node based on its parent and sibling position
        levelNodes.forEach(({ nodeId, parentId, siblingIndex, totalSiblings }) => {
          const parentPos = positionedNodes[parentId];
          if (!parentPos) return;
          
          const y = parentPos.y + LEVEL_HEIGHT;
          
          if (totalSiblings === 1) {
            // Single child directly below parent
            positionedNodes[nodeId] = { x: parentPos.x, y };
          } else {
            // Multiple children spread horizontally around parent
            const spacing = Math.min(200, 400 / Math.max(1, totalSiblings - 1));
            const totalWidth = spacing * (totalSiblings - 1);
            const startX = parentPos.x - totalWidth / 2;
            const x = startX + (siblingIndex * spacing);
            
            positionedNodes[nodeId] = { x, y };
          }
        });
      }
    });

    return positionedNodes;
  };

  const nodePositions = calculateNodePositions();

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

      const parentPos = nodePositions[node.parentId];
      const childPos = nodePositions[nodeId];
      
      if (!parentPos || !childPos) return null;

      // Create a smooth curved line from parent to child
      const midY = parentPos.y + (childPos.y - parentPos.y) * 0.6;
      
      return (
        <path
          key={`connection-${nodeId}`}
          d={`M ${parentPos.x + 20} ${parentPos.y + 40} Q ${parentPos.x + 20} ${midY} ${childPos.x + 20} ${childPos.y}`}
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

  // Calculate canvas bounds based on node positions with padding
  const positions = Object.values(nodePositions);
  const minX = Math.min(...positions.map(pos => pos.x)) - 200;
  const maxX = Math.max(...positions.map(pos => pos.x)) + 400;
  const minY = Math.min(...positions.map(pos => pos.y)) - 100;
  const maxY = Math.max(...positions.map(pos => pos.y)) + 200;
  
  const canvasWidth = Math.max(1400, maxX - minX);
  const canvasHeight = Math.max(1000, maxY - minY);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={3}
        wheel={{ step: 0.1 }}
        centerOnInit={true}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white shadow-sm"
                onClick={() => zoomIn()}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white shadow-sm"
                onClick={() => zoomOut()}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white shadow-sm"
                onClick={() => resetTransform()}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="w-full h-full"
            >
              <svg
                ref={svgRef}
                className="cursor-grab active:cursor-grabbing"
                width={canvasWidth}
                height={canvasHeight}
                style={{ minWidth: canvasWidth, minHeight: canvasHeight }}
              >
                {renderConnections()}
                
                {nodeEntries.map(([nodeId, node]) => {
                  const position = nodePositions[nodeId];
                  if (!position) return null;
                  
                  return (
                    <g key={nodeId}>
                      <circle
                        cx={position.x + 20}
                        cy={position.y + 20}
                        r="8"
                        fill={selectedNodeId === nodeId ? '#3b82f6' : '#6b7280'}
                        className="cursor-pointer hover:fill-blue-500 transition-colors"
                        onClick={() => handleNodeClick(nodeId)}
                      />
                      
                      <foreignObject
                        x={position.x + 35}
                        y={position.y}
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
                          x={position.x + 220}
                          y={position.y + 5}
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
                  );
                })}
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

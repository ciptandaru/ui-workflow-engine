import { useCallback, useRef, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  OnConnect,
  OnNodesChange,
  ReactFlowProvider,
  OnMove,
} from "@xyflow/react";
import { Plus, Search } from "lucide-react";
import { useWorkflowStore } from "../../stores/workflowStore";
import { WorkflowNode } from "./WorkflowNode";
import { WorkflowEdge } from "./WorkflowEdge";
import { cn } from "../../lib/utils";

// Custom node types
const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
};

// Custom edge types
const edgeTypes: EdgeTypes = {
  workflowEdge: WorkflowEdge,
};

const WorkflowCanvasInner: React.FC = () => {
  const {
    workflows,
    activeWorkflowId,
    addEdge: addWorkflowEdge,
    isAddNodePanelOpen,
    isDarkMode,
    openAddNodePanel,
  } = useWorkflowStore();

  const [showMinimap, setShowMinimap] = useState(false);
  const minimapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Convert workflow nodes to React Flow format
  const initialNodes: Node[] =
    activeWorkflow?.nodes.map((node) => ({
      id: node.id,
      type: "workflowNode",
      position: node.position,
      data: {
        ...node.data,
        nodeDefinitionId: node.type, // Store the node definition ID
      },
    })) || [];

  // Convert workflow edges to React Flow format
  const initialEdges: Edge[] =
    activeWorkflow?.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: "workflowEdge",
      animated: edge.animated,
    })) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes with store
  useEffect(() => {
    if (activeWorkflow) {
      setNodes(
        activeWorkflow.nodes.map((node) => ({
          id: node.id,
          type: "workflowNode",
          position: node.position,
          data: {
            ...node.data,
            nodeDefinitionId: node.type, // Store the node definition ID
          },
        })),
      );
      setEdges(
        activeWorkflow.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: "workflowEdge",
          animated: edge.animated,
        })),
      );
    }
  }, [activeWorkflowId, activeWorkflow, setNodes, setEdges]);

  // Handle node position changes
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
    },
    [onNodesChange],
  );

  // Handle new connections
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      addWorkflowEdge(
        connection.source!,
        connection.target!,
        connection.sourceHandle ?? undefined,
        connection.targetHandle ?? undefined,
      );
    },
    [addWorkflowEdge],
  );

  // Handle viewport move to show/hide minimap
  const onMove: OnMove = useCallback(() => {
    setShowMinimap(true);

    // Clear existing timeout
    if (minimapTimeoutRef.current) {
      clearTimeout(minimapTimeoutRef.current);
    }

    // Hide minimap after 1.5 seconds of no movement
    minimapTimeoutRef.current = setTimeout(() => {
      setShowMinimap(false);
    }, 1500);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (minimapTimeoutRef.current) {
        clearTimeout(minimapTimeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab to toggle Add Node Panel
      if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useWorkflowStore.getState().toggleAddNodePanel();
      }

      // Escape to close panels
      if (e.key === "Escape") {
        useWorkflowStore.getState().closeAddNodePanel();
        useWorkflowStore.getState().closeRightPanel();
      }

      // Delete selected node
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        const { selectedNodeId, deleteNode } = useWorkflowStore.getState();
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onMove={onMove}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: "workflowEdge",
          animated: true,
        }}
        className={isDarkMode ? "dark" : ""}
        style={{ background: isDarkMode ? "#111827" : "#f8fafc" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={isDarkMode ? "#374151" : "#cbd5e1"}
        />
        <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg" />

        {/* Minimap - only visible when canvas is moving */}
        {showMinimap && (
          <MiniMap
            nodeColor={(node) => {
              const data = node.data as { nodeType?: string };
              switch (data?.nodeType) {
                case "trigger":
                  return "#3b82f6";
                case "action":
                  return "#22c55e";
                case "flow":
                  return "#f59e0b";
                case "ai":
                  return "#a855f7";
                case "core":
                  return "#6b7280";
                default:
                  return "#94a3b8";
              }
            }}
            maskColor={
              isDarkMode ? "rgba(17, 24, 39, 0.8)" : "rgba(248, 250, 252, 0.8)"
            }
            className={cn(
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-opacity duration-300",
              // isAddNodePanelOpen && "right-[360px]",
            )}
          />
        )}
      </ReactFlow>

      {/* Floating Action Buttons - Inside React Flow (Top Right) */}
      <div
        className={cn(
          "absolute top-4 flex gap-2 z-10 transition-all duration-300",
          isAddNodePanelOpen ? "right-4" : "right-4",
        )}
      >
        {/* Add Node Button */}
        <button
          onClick={() => openAddNodePanel()}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all",
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "text-gray-700 dark:text-gray-300",
          )}
          title="Add Node (Tab)"
        >
          <div className="relative">
            <Plus className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </button>

        {/* Search Button */}
        <button
          onClick={() => openAddNodePanel()}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all",
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "text-gray-700 dark:text-gray-300",
          )}
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas Hint Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-xs text-gray-500 dark:text-gray-400 shadow-lg">
        <span>Single-click = select</span>
        <span className="mx-2">·</span>
        <span>Double-click = edit</span>
        <span className="mx-2">·</span>
        <span>Tab = add node</span>
        <span className="mx-2">·</span>
        <span>Del = delete</span>
      </div>
    </div>
  );
};

export const WorkflowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
};

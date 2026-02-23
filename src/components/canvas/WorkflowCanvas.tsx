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
import {
  Plus,
  Search,
  Copy,
  Trash2,
  Scissors,
  Clipboard,
  Settings,
  Grid3X3,
} from "lucide-react";
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
    updateNodePosition,
    isAddNodePanelOpen,
    isDarkMode,
    openAddNodePanel,
    setSelectedNode,
    openRightPanel,
    deleteNode,
    duplicateNode,
    copyNode,
    cutNode,
    copiedNode,
    pasteNode,
    layoutNodes,
  } = useWorkflowStore();

  const [showMinimap, setShowMinimap] = useState(false);
  const minimapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string | null;
    isCanvas: boolean;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

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

  // Track if we're currently dragging to prevent sync during drag
  const isDraggingRef = useRef(false);

  // Store the last synced node/edge IDs to detect structural changes
  const lastNodeIdsRef = useRef<string>("");
  const lastEdgeIdsRef = useRef<string>("");

  // Sync nodes with store only when workflow structure changes (add/remove nodes/edges)
  // NOT when positions change
  useEffect(() => {
    if (activeWorkflow && !isDraggingRef.current) {
      // Create a key based on node and edge IDs (not positions)
      const nodeIds = activeWorkflow.nodes
        .map((n) => n.id)
        .sort()
        .join(",");
      const edgeIds = activeWorkflow.edges
        .map((e) => e.id)
        .sort()
        .join(",");

      // Only sync if structure changed (nodes/edges added/removed)
      if (
        lastNodeIdsRef.current !== nodeIds ||
        lastEdgeIdsRef.current !== edgeIds
      ) {
        lastNodeIdsRef.current = nodeIds;
        lastEdgeIdsRef.current = edgeIds;

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
    }
  }, [activeWorkflowId, activeWorkflow, setNodes, setEdges]);

  // Handle node position changes
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // Mark that we're starting a drag
      const hasPositionChange = changes.some((c) => c.type === "position");
      if (hasPositionChange) {
        isDraggingRef.current = true;
      }

      onNodesChange(changes);
    },
    [onNodesChange],
  );

  // Handle node drag stop - save position to store
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      isDraggingRef.current = false;
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition],
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

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as HTMLElement)
      ) {
        setContextMenu(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Handle node right-click context menu
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectedNode(node.id);
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        isCanvas: false,
      });
    },
    [setSelectedNode],
  );

  // Handle pane (canvas) right-click context menu
  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: null,
        isCanvas: true,
      });
    },
    [],
  );

  // Handle pane click to close context menu
  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const {
        selectedNodeId,
        deleteNode,
        duplicateNode,
        copyNode,
        pasteNode,
        cutNode,
        copiedNode,
      } = useWorkflowStore.getState();

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
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
      }

      // Copy: Ctrl+C or Cmd+C
      if (e.key === "c" && (e.ctrlKey || e.metaKey) && selectedNodeId) {
        e.preventDefault();
        copyNode(selectedNodeId);
      }

      // Cut: Ctrl+X or Cmd+X
      if (e.key === "x" && (e.ctrlKey || e.metaKey) && selectedNodeId) {
        e.preventDefault();
        cutNode(selectedNodeId);
      }

      // Paste: Ctrl+V or Cmd+V
      if (e.key === "v" && (e.ctrlKey || e.metaKey) && copiedNode) {
        e.preventDefault();
        pasteNode();
      }

      // Duplicate: Ctrl+D or Cmd+D
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && selectedNodeId) {
        e.preventDefault();
        duplicateNode(selectedNodeId);
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
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
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

        {/* Auto Layout Button */}
        <button
          onClick={() => layoutNodes()}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all",
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "text-gray-700 dark:text-gray-300",
          )}
          title="Auto Layout - Rapikan tampilan node"
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
      </div>

      {/* Empty State Placeholder */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-6 pointer-events-auto max-w-md px-6">
            {/* Visual Illustration */}
            <div className="relative">
              {/* Main circle with pulse animation */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800/50 dark:to-blue-700/50 border border-blue-300 dark:border-blue-600 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
              {/* Pulse ring animation */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-300 dark:border-blue-600 animate-ping opacity-20" />
              {/* Decorative nodes */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-500" />
              </div>
              <div className="absolute -bottom-1 -left-3 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-500" />
              </div>
              <div className="absolute top-1/2 -right-4 w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900/50 border border-orange-300 dark:border-orange-600 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-orange-400 dark:bg-orange-500" />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Start building your workflow
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Add nodes to create automated workflows. Connect triggers,
                actions, and logic to build powerful automations.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => openAddNodePanel("triggers")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>Add first node</span>
              </button>
              <button
                onClick={() => openAddNodePanel()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Search className="w-4 h-4" />
                <span>Browse nodes</span>
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px] font-mono shadow-sm">
                  Tab
                </kbd>
                <span>Quick add</span>
              </div>
              <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px] font-mono shadow-sm">
                  ⌘K
                </kbd>
                <span>Search</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-[1000] min-w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 overflow-hidden"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          {/* Canvas Context Menu */}
          {contextMenu.isCanvas ? (
            <>
              {/* Header */}
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Canvas Actions
                </span>
              </div>

              {/* Add Node Button */}
              <button
                onClick={() => {
                  setContextMenu(null);
                  openAddNodePanel();
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="flex-1 text-left">Add Node</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  Tab
                </span>
              </button>

              {/* Paste Button - only shown if there's a copied node */}
              <button
                onClick={() => {
                  if (copiedNode) {
                    pasteNode({ x: contextMenu.x, y: contextMenu.y });
                  }
                  setContextMenu(null);
                }}
                disabled={!copiedNode}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-3 text-sm transition-colors",
                  copiedNode
                    ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "opacity-50 cursor-not-allowed text-gray-700 dark:text-gray-300",
                )}
              >
                <Clipboard className="w-4 h-4" />
                <span className="flex-1 text-left">Paste</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ⌘V
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Node Context Menu */}
              {/* Header */}
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Node Actions
                </span>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  if (contextMenu.nodeId) {
                    setSelectedNode(contextMenu.nodeId);
                    openRightPanel();
                  }
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="flex-1 text-left">Edit</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ⏎
                </span>
              </button>

              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

              <button
                onClick={() => {
                  if (contextMenu.nodeId) {
                    duplicateNode(contextMenu.nodeId);
                  }
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="flex-1 text-left">Duplicate</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ⌘D
                </span>
              </button>

              <button
                onClick={() => {
                  if (contextMenu.nodeId) {
                    copyNode(contextMenu.nodeId);
                  }
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Clipboard className="w-4 h-4" />
                <span className="flex-1 text-left">Copy</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ⌘C
                </span>
              </button>

              <button
                onClick={() => {
                  if (contextMenu.nodeId) {
                    cutNode(contextMenu.nodeId);
                  }
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Scissors className="w-4 h-4" />
                <span className="flex-1 text-left">Cut</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ⌘X
                </span>
              </button>

              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

              <button
                onClick={() => {
                  if (copiedNode) {
                    pasteNode({ x: contextMenu.x + 50, y: contextMenu.y + 50 });
                  }
                  setContextMenu(null);
                }}
                disabled={!copiedNode}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-3 text-sm transition-colors",
                  copiedNode
                    ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "opacity-50 cursor-not-allowed text-gray-700 dark:text-gray-300",
                )}
              >
                <Clipboard className="w-4 h-4" />
                <span className="flex-1 text-left">Paste</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ⌘V
                </span>
              </button>

              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

              <button
                onClick={() => {
                  if (contextMenu.nodeId) {
                    deleteNode(contextMenu.nodeId);
                  }
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="flex-1 text-left">Delete</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  ⌫
                </span>
              </button>
            </>
          )}
        </div>
      )}
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

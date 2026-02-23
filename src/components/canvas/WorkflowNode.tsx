import React, { memo, useState, useMemo } from "react";
import { Handle, Position, NodeProps, useEdges } from "@xyflow/react";
import { Plus } from "lucide-react";
import { getIcon } from "../../lib/icons";
import { getNodeDefinition } from "../../utils/nodeConfig";
import { useWorkflowStore } from "../../stores/workflowStore";
import { cn } from "../../lib/utils";

interface WorkflowNodeData {
  label: string;
  nodeType: string;
  nodeDefinitionId?: string;
  parameters?: Record<string, string | number | boolean>;
  output?: Record<string, unknown>;
}

export const WorkflowNode: React.FC<NodeProps> = memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as WorkflowNodeData;
    const {
      setSelectedNode,
      openRightPanel,
      deleteNode,
      selectedNodeId,
      openAddNodePanelForSource,
    } = useWorkflowStore();

    // Use useEdges hook to get edges reactively
    const edges = useEdges();

    const [showAddButton, setShowAddButton] = useState(false);

    const nodeDef = getNodeDefinition(
      nodeData.nodeDefinitionId || nodeData.nodeType || "telegram-trigger",
    );

    // Check if this node has any outgoing connections
    const hasOutgoingConnection = useMemo(() => {
      return edges.some((edge) => edge.source === id);
    }, [edges, id]);

    // Check if specific handle has connection (for branch nodes)
    const hasHandleConnection = useMemo(() => {
      return (handleId: string) =>
        edges.some(
          (edge) => edge.source === id && edge.sourceHandle === handleId,
        );
    }, [edges, id]);

    if (!nodeDef) {
      return (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
          <span className="text-sm text-gray-500">Unknown Node</span>
        </div>
      );
    }

    const handleClick = () => {
      setSelectedNode(id);
    };

    const handleDoubleClick = () => {
      setSelectedNode(id);
      openRightPanel();
    };

    const handleAddNodeClick = (e: React.MouseEvent, sourceHandle?: string) => {
      e.stopPropagation();
      openAddNodePanelForSource(id, sourceHandle);
    };

    const isSelected = selectedNodeId === id;

    return (
      <>
        <div
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={cn(
            "relative group",
            "min-w-[180px] rounded-lg border-2 shadow-node transition-all duration-200",
            nodeDef.color.border,
            nodeDef.color.bg,
            "hover:shadow-node-hover",
            (selected || isSelected) &&
              "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900",
          )}
        >
          {/* Input Handle */}
          {nodeDef.hasInput && (
            <Handle
              type="target"
              position={Position.Left}
              isConnectable={true}
              className="!w-4 !h-4 !bg-gray-400 dark:!bg-gray-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-blue-500 hover:!scale-125 transition-all cursor-crosshair"
            />
          )}

          {/* Node Content */}
          <div className="p-3">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  nodeDef.color.iconBg || nodeDef.color.bg,
                )}
              >
                {getIcon(nodeDef.icon, {
                  className: cn("w-5 h-5", nodeDef.color.text, "text-white"),
                })}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {nodeData.label || nodeDef.label}
                </div>
                {nodeDef.subtitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {nodeDef.subtitle}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Output Handles */}
          {nodeDef.hasOutput && !nodeDef.hasBranch && (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center"
              onMouseEnter={() => setShowAddButton(true)}
              onMouseLeave={() => setShowAddButton(false)}
            >
              {/* Connector Line - always show for consistent positioning */}
              <div
                className={cn(
                  "w-6 h-0.5 transition-colors",
                  hasOutgoingConnection
                    ? "bg-gray-400 dark:bg-gray-500"
                    : "bg-gray-300 dark:bg-gray-600",
                )}
              />
              {/* Main Output Handle - always present for connections */}
              <Handle
                type="source"
                position={Position.Right}
                isConnectable={true}
                className={cn(
                  "!w-4 !h-4 !rounded-full !border-2 !border-white dark:!border-gray-800 !transition-all !cursor-crosshair",
                  hasOutgoingConnection
                    ? "!bg-blue-500 hover:!bg-blue-600 hover:!scale-125"
                    : "!bg-white dark:!bg-gray-800 !border-dashed !border-gray-300 dark:!border-gray-600 hover:!border-blue-500 hover:!scale-110",
                )}
                style={{ position: "relative", transform: "none", top: "auto" }}
                onClick={(e: React.MouseEvent) => {
                  if (!hasOutgoingConnection) {
                    e.stopPropagation();
                    handleAddNodeClick(e);
                  }
                }}
              >
                {/* Plus icon inside handle - only show if no connection */}
                {!hasOutgoingConnection && (
                  <Plus
                    className={cn(
                      "w-2.5 h-2.5 text-gray-400 dark:text-gray-500 transition-opacity pointer-events-none",
                      showAddButton
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100",
                    )}
                  />
                )}
              </Handle>
            </div>
          )}

          {/* Branch Handles (If/Else) */}
          {nodeDef.hasBranch && (
            <>
              {/* True Handle Container */}
              <div
                className="absolute right-0 top-[30%] translate-y-[-50%] flex items-center"
                onMouseEnter={() => setShowAddButton(true)}
                onMouseLeave={() => setShowAddButton(false)}
              >
                {/* Connector Line - always show for consistent positioning */}
                <div
                  className={cn(
                    "w-5 h-0.5 transition-colors",
                    hasHandleConnection("true")
                      ? "bg-green-500 dark:bg-green-400"
                      : "bg-gray-300 dark:bg-gray-600",
                  )}
                />
                {/* True Handle */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id="true"
                  isConnectable={true}
                  className={cn(
                    "!w-4 !h-4 !rounded-full !border-2 !border-white dark:!border-gray-800 !transition-all !cursor-crosshair",
                    hasHandleConnection("true")
                      ? "!bg-green-500 hover:!bg-green-600 hover:!scale-125"
                      : "!bg-white dark:!bg-gray-800 !border-dashed !border-green-300 dark:!border-green-600 hover:!border-green-500 hover:!scale-110",
                  )}
                  style={{
                    position: "relative",
                    transform: "none",
                    top: "auto",
                  }}
                  onClick={(e: React.MouseEvent) => {
                    if (!hasHandleConnection("true")) {
                      e.stopPropagation();
                      handleAddNodeClick(e, "true");
                    }
                  }}
                >
                  {!hasHandleConnection("true") && (
                    <Plus
                      className={cn(
                        "w-2.5 h-2.5 text-green-500 dark:text-green-400 transition-opacity pointer-events-none",
                        showAddButton
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100",
                      )}
                    />
                  )}
                </Handle>
                {/* Label */}
                <div className="ml-1 text-xs text-green-600 dark:text-green-400 font-medium">
                  T
                </div>
              </div>

              {/* False Handle Container */}
              <div
                className="absolute right-0 top-[70%] translate-y-[-50%] flex items-center"
                onMouseEnter={() => setShowAddButton(true)}
                onMouseLeave={() => setShowAddButton(false)}
              >
                {/* Connector Line - always show for consistent positioning */}
                <div
                  className={cn(
                    "w-5 h-0.5 transition-colors",
                    hasHandleConnection("false")
                      ? "bg-red-500 dark:bg-red-400"
                      : "bg-gray-300 dark:bg-gray-600",
                  )}
                />
                {/* False Handle */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id="false"
                  isConnectable={true}
                  className={cn(
                    "!w-4 !h-4 !rounded-full !border-2 !border-white dark:!border-gray-800 !transition-all !cursor-crosshair",
                    hasHandleConnection("false")
                      ? "!bg-red-500 hover:!bg-red-600 hover:!scale-125"
                      : "!bg-white dark:!bg-gray-800 !border-dashed !border-red-300 dark:!border-red-600 hover:!border-red-500 hover:!scale-110",
                  )}
                  style={{
                    position: "relative",
                    transform: "none",
                    top: "auto",
                  }}
                  onClick={(e: React.MouseEvent) => {
                    if (!hasHandleConnection("false")) {
                      e.stopPropagation();
                      handleAddNodeClick(e, "false");
                    }
                  }}
                >
                  {!hasHandleConnection("false") && (
                    <Plus
                      className={cn(
                        "w-2.5 h-2.5 text-red-500 dark:text-red-400 transition-opacity pointer-events-none",
                        showAddButton
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100",
                      )}
                    />
                  )}
                </Handle>
                {/* Label */}
                <div className="ml-1 text-xs text-red-600 dark:text-red-400 font-medium">
                  F
                </div>
              </div>
            </>
          )}

          {/* Tooltip */}
          <div
            className={cn(
              "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap",
              "text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded",
              "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
            )}
          >
            Double-click to edit · Right-click for options
          </div>

          {/* Delete Button (shown when selected) */}
          {(selected || isSelected) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(id);
              }}
              className={cn(
                "absolute -top-2 -right-2 w-5 h-5 rounded-full",
                "bg-red-500 hover:bg-red-600 text-white",
                "flex items-center justify-center text-xs",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "shadow-lg",
              )}
              title="Delete node"
            >
              ×
            </button>
          )}
        </div>
      </>
    );
  },
);

WorkflowNode.displayName = "WorkflowNode";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
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
    const { setSelectedNode, openRightPanel, deleteNode, selectedNodeId } =
      useWorkflowStore();

    const nodeDef = getNodeDefinition(
      nodeData.nodeDefinitionId || nodeData.nodeType || "telegram-trigger",
    );

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

    const isSelected = selectedNodeId === id;

    return (
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
            className="!w-3 !h-3 !bg-gray-400 dark:!bg-gray-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-blue-500 transition-colors"
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
          <Handle
            type="source"
            position={Position.Right}
            className="!w-3 !h-3 !bg-gray-400 dark:!bg-gray-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-blue-500 transition-colors"
          />
        )}

        {/* Branch Handles (If/Else) */}
        {nodeDef.hasBranch && (
          <>
            {/* True Handle */}
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              className="!w-3 !h-3 !bg-green-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-green-600 transition-colors"
              style={{ top: "30%" }}
            />
            {/* False Handle */}
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              className="!w-3 !h-3 !bg-red-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-red-600 transition-colors"
              style={{ top: "70%" }}
            />
            {/* Labels */}
            <div className="absolute right-0 top-[30%] translate-x-full pr-1 text-xs text-green-600 dark:text-green-400 font-medium">
              T
            </div>
            <div className="absolute right-0 top-[70%] translate-x-full pr-1 text-xs text-red-600 dark:text-red-400 font-medium">
              F
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
          Double-click to edit
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
    );
  },
);

WorkflowNode.displayName = "WorkflowNode";

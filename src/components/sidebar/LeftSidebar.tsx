import React, { useState } from "react";
import {
  Plus,
  Trash2,
  MoreHorizontal,
  Workflow as WorkflowIcon,
  CheckCircle,
  Circle,
  FileEdit,
} from "lucide-react";
import { useWorkflowStore } from "../../stores/workflowStore";
import { cn } from "../../lib/utils";

export const LeftSidebar: React.FC = () => {
  const {
    workflows,
    activeWorkflowId,
    setActiveWorkflow,
    addWorkflow,
    deleteWorkflow,
  } = useWorkflowStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleAddWorkflow = () => {
    if (newName.trim()) {
      addWorkflow(newName.trim());
      setNewName("");
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (workflows.length > 1) {
      deleteWorkflow(id);
    }
    setMenuOpenId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
      case "inactive":
        return <Circle className="w-3.5 h-3.5 text-gray-400" />;
      case "draft":
        return <FileEdit className="w-3.5 h-3.5 text-yellow-500" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <aside className="w-[220px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Workflows
          </span>
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            title="Add Workflow"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add New Workflow Input */}
      {isAdding && (
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddWorkflow();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewName("");
              }
            }}
            placeholder="Workflow name..."
            className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
            autoFocus
          />
        </div>
      )}

      {/* Workflow List */}
      <div className="flex-1 overflow-y-auto py-2">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            onClick={() => setActiveWorkflow(workflow.id)}
            className={cn(
              "group relative flex items-center gap-2 px-3 py-2 mx-2 rounded-lg cursor-pointer transition-colors",
              activeWorkflowId === workflow.id
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
            )}
          >
            {/* Status Icon */}
            {getStatusIcon(workflow.status)}

            {/* Workflow Icon */}
            <WorkflowIcon className="w-4 h-4 flex-shrink-0" />

            {/* Name */}
            <span className="text-sm font-medium truncate flex-1">
              {workflow.name}
            </span>

            {/* Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpenId(menuOpenId === workflow.id ? null : workflow.id);
              }}
              className={cn(
                "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                "opacity-0 group-hover:opacity-100",
                menuOpenId === workflow.id && "opacity-100",
              )}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {menuOpenId === workflow.id && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={(e) => handleDelete(workflow.id, e)}
                  disabled={workflows.length <= 1}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors",
                    workflows.length <= 1
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30",
                  )}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
          {workflows.length} workflow{workflows.length !== 1 ? "s" : ""}
        </div>
      </div>
    </aside>
  );
};

import React from "react";
import { X, Settings, Play, Code } from "lucide-react";
import { useWorkflowStore } from "../../stores/workflowStore";
import { getNodeDefinition } from "../../utils/nodeConfig";
import { getIcon } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { NodeParameter } from "../../types";

export const RightPanel: React.FC = () => {
  const {
    isRightPanelOpen,
    closeRightPanel,
    selectedNodeId,
    workflows,
    activeWorkflowId,
    updateNode,
  } = useWorkflowStore();

  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId);
  const selectedNode = activeWorkflow?.nodes.find(
    (n) => n.id === selectedNodeId,
  );
  const nodeDef = selectedNode ? getNodeDefinition(selectedNode.type) : null;

  if (!isRightPanelOpen || !selectedNode || !nodeDef) {
    return null;
  }

  const handleParameterChange = (
    paramId: string,
    value: string | number | boolean,
  ) => {
    updateNode(selectedNodeId!, {
      parameters: {
        ...selectedNode.data.parameters,
        [paramId]: value,
      },
    });
  };

  const renderParameterInput = (param: NodeParameter) => {
    const value = selectedNode.data.parameters?.[param.id] ?? param.value;

    switch (param.type) {
      case "text":
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            placeholder={param.placeholder}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) =>
              handleParameterChange(param.id, Number(e.target.value))
            }
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        );
      case "textarea":
        return (
          <textarea
            value={value as string}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            placeholder={param.placeholder}
            rows={4}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 resize-none font-mono"
          />
        );
      case "select":
        return (
          <select
            value={value as string}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            {param.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) =>
                handleParameterChange(param.id, e.target.checked)
              }
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Enabled
            </span>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-[340px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">
            Node Editor
          </span>
        </div>
        <button
          onClick={closeRightPanel}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Node Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              nodeDef.color.iconBg || nodeDef.color.bg,
            )}
          >
            {getIcon(nodeDef.icon, {
              className: cn("w-5 h-5", nodeDef.color.text, "text-white"),
            })}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {selectedNode.data.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {nodeDef.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Parameters
          </h3>

          {nodeDef.parameters?.map((param) => (
            <div key={param.id} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {param.label}
              </label>
              {renderParameterInput(param)}
            </div>
          ))}

          {!nodeDef.parameters?.length && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No parameters available
            </p>
          )}
        </div>

        {/* Output Preview */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Output Preview
          </h3>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                JSON Output
              </span>
            </div>
            <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(selectedNode.data.output || {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Node ID:{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
            {selectedNodeId}
          </code>
        </div>
      </div>
    </aside>
  );
};

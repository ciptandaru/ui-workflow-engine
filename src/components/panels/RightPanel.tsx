import React, { useState } from "react";
import {
  X,
  Settings,
  Play,
  Code,
  Wrench,
  Cog,
  FlaskConical,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useWorkflowStore } from "../../stores/workflowStore";
import { getNodeDefinition } from "../../utils/nodeConfig";
import { getIcon } from "../../lib/icons";
import { cn } from "../../lib/utils";
import {
  NodeParameter,
  ConditionsConfig,
  ConditionRule,
  ConditionGroup,
} from "../../types";

type EditorTab = "setup" | "configure" | "test";

const operatorOptions = [
  { label: "Equals", value: "equals" },
  { label: "Not Equals", value: "not_equals" },
  { label: "Contains", value: "contains" },
  { label: "Not Contains", value: "not_contains" },
  { label: "Greater Than", value: "greater_than" },
  { label: "Less Than", value: "less_than" },
  { label: "Is Empty", value: "is_empty" },
  { label: "Is Not Empty", value: "is_not_empty" },
];

export const RightPanel: React.FC = () => {
  const {
    isRightPanelOpen,
    closeRightPanel,
    selectedNodeId,
    workflows,
    activeWorkflowId,
    updateNode,
  } = useWorkflowStore();

  const [activeTab, setActiveTab] = useState<EditorTab>("setup");
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(
    null,
  );
  const [isTestLoading, setIsTestLoading] = useState(false);

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
    value: string | number | boolean | ConditionsConfig,
  ) => {
    updateNode(selectedNodeId!, {
      parameters: {
        ...selectedNode.data.parameters,
        [paramId]: value,
      },
    });
  };

  const handleTestNode = async () => {
    setIsTestLoading(true);
    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTestResult({
      success: true,
      output: {
        message: "Test executed successfully",
        timestamp: new Date().toISOString(),
        data: selectedNode.data.parameters,
      },
    });
    setIsTestLoading(false);
  };

  const getConditionsConfig = (): ConditionsConfig => {
    const conditions = selectedNode.data.parameters?.conditions;
    if (
      conditions &&
      typeof conditions === "object" &&
      "groups" in conditions
    ) {
      return conditions as ConditionsConfig;
    }
    return {
      groups: [
        {
          id: "group-1",
          logic: "and",
          conditions: [
            {
              id: "condition-1",
              field: "",
              operator: "equals",
              value: "",
            },
          ],
        },
      ],
      groupLogic: "and",
    };
  };

  const updateConditions = (config: ConditionsConfig) => {
    handleParameterChange("conditions", config);
  };

  const addCondition = (groupId: string) => {
    const config = getConditionsConfig();
    const newCondition: ConditionRule = {
      id: `condition-${Date.now()}`,
      field: "",
      operator: "equals",
      value: "",
    };
    const updatedGroups = config.groups.map((g) =>
      g.id === groupId
        ? { ...g, conditions: [...g.conditions, newCondition] }
        : g,
    );
    updateConditions({ ...config, groups: updatedGroups });
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    const config = getConditionsConfig();
    const updatedGroups = config.groups.map((g) =>
      g.id === groupId
        ? { ...g, conditions: g.conditions.filter((c) => c.id !== conditionId) }
        : g,
    );
    updateConditions({ ...config, groups: updatedGroups });
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    field: keyof ConditionRule,
    value: string,
  ) => {
    const config = getConditionsConfig();
    const updatedGroups = config.groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            conditions: g.conditions.map((c) =>
              c.id === conditionId ? { ...c, [field]: value } : c,
            ),
          }
        : g,
    );
    updateConditions({ ...config, groups: updatedGroups });
  };

  const addGroup = () => {
    const config = getConditionsConfig();
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      logic: "and",
      conditions: [
        {
          id: `condition-${Date.now()}`,
          field: "",
          operator: "equals",
          value: "",
        },
      ],
    };
    updateConditions({ ...config, groups: [...config.groups, newGroup] });
  };

  const removeGroup = (groupId: string) => {
    const config = getConditionsConfig();
    if (config.groups.length <= 1) return;
    updateConditions({
      ...config,
      groups: config.groups.filter((g) => g.id !== groupId),
    });
  };

  const updateGroupLogic = (groupId: string, logic: "and" | "or") => {
    const config = getConditionsConfig();
    const updatedGroups = config.groups.map((g) =>
      g.id === groupId ? { ...g, logic } : g,
    );
    updateConditions({ ...config, groups: updatedGroups });
  };

  const updateGroupLogicMain = (logic: "and" | "or") => {
    const config = getConditionsConfig();
    updateConditions({ ...config, groupLogic: logic });
  };

  const renderConditionsEditor = () => {
    const config = getConditionsConfig();

    return (
      <div className="space-y-4">
        {/* Group Logic Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Match
          </span>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => updateGroupLogicMain("and")}
              className={cn(
                "px-3 py-1 text-sm font-medium transition-colors",
                config.groupLogic === "and"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
              )}
            >
              AND
            </button>
            <button
              onClick={() => updateGroupLogicMain("or")}
              className={cn(
                "px-3 py-1 text-sm font-medium transition-colors",
                config.groupLogic === "or"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
              )}
            >
              OR
            </button>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            of the following groups:
          </span>
        </div>

        {/* Condition Groups */}
        {config.groups.map((group, groupIndex) => (
          <div
            key={group.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
          >
            {/* Group Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Group {groupIndex + 1}
                </span>
                <div className="flex rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => updateGroupLogic(group.id, "and")}
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium transition-colors",
                      group.logic === "and"
                        ? "bg-amber-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                    )}
                  >
                    AND
                  </button>
                  <button
                    onClick={() => updateGroupLogic(group.id, "or")}
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium transition-colors",
                      group.logic === "or"
                        ? "bg-amber-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                    )}
                  >
                    OR
                  </button>
                </div>
              </div>
              {config.groups.length > 1 && (
                <button
                  onClick={() => removeGroup(group.id)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Conditions in Group */}
            {group.conditions.map((condition, condIndex) => (
              <div key={condition.id} className="space-y-2">
                {condIndex > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs font-medium text-amber-500 uppercase">
                      {group.logic}
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    {/* Field Input */}
                    <input
                      type="text"
                      value={condition.field}
                      onChange={(e) =>
                        updateCondition(
                          group.id,
                          condition.id,
                          "field",
                          e.target.value,
                        )
                      }
                      placeholder="Field name"
                      className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />

                    {/* Operator Select */}
                    <div className="relative">
                      <select
                        value={condition.operator}
                        onChange={(e) =>
                          updateCondition(
                            group.id,
                            condition.id,
                            "operator",
                            e.target.value,
                          )
                        }
                        className="w-full appearance-none px-2 py-1.5 pr-8 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                      >
                        {operatorOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Value Input */}
                    {!["is_empty", "is_not_empty"].includes(
                      condition.operator,
                    ) && (
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) =>
                          updateCondition(
                            group.id,
                            condition.id,
                            "value",
                            e.target.value,
                          )
                        }
                        placeholder="Value"
                        className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    )}
                  </div>

                  {/* Delete Condition */}
                  {group.conditions.length > 1 && (
                    <button
                      onClick={() => removeCondition(group.id, condition.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Condition Button */}
            <button
              onClick={() => addCondition(group.id)}
              className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Plus className="w-4 h-4" />
              Add condition
            </button>
          </div>
        ))}

        {/* Add Group Button */}
        <button
          onClick={addGroup}
          className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Plus className="w-4 h-4" />
          Add condition group
        </button>
      </div>
    );
  };

  const renderParameterInput = (param: NodeParameter) => {
    const value = selectedNode.data.parameters?.[param.id] ?? param.value;

    if (param.type === "conditions") {
      return renderConditionsEditor();
    }

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

  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: "setup", label: "Setup", icon: <Wrench className="w-4 h-4" /> },
    {
      id: "configure",
      label: "Configure",
      icon: <Cog className="w-4 h-4" />,
    },
    { id: "test", label: "Test", icon: <FlaskConical className="w-4 h-4" /> },
  ];

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

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors border-b-2",
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "setup" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Setup Connection
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure your {nodeDef.label} connection settings here. This
              typically includes authentication and connection details.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 Setup is where you configure credentials and connection
                settings that will be used by this node.
              </p>
            </div>
          </div>
        )}

        {activeTab === "configure" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Cog className="w-4 h-4" />
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
        )}

        {activeTab === "test" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              Test Node
            </h3>

            <button
              onClick={handleTestNode}
              disabled={isTestLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                isTestLoading
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white",
              )}
            >
              <Play className="w-4 h-4" />
              {isTestLoading ? "Testing..." : "Test Node"}
            </button>

            {/* Output Preview */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Code className="w-4 h-4" />
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
                  {JSON.stringify(
                    testResult || selectedNode.data.output || {},
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}
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

// Node Types
export type NodeCategory =
  | "triggers"
  | "actions"
  | "data"
  | "flow"
  | "core"
  | "ai"
  | "human";

export type NodeHandleType = "input" | "output" | "true" | "false";

export interface NodeColor {
  border: string;
  bg: string;
  text: string;
  iconBg?: string;
}

export interface NodeDefinition {
  id: string;
  type: "trigger" | "action" | "data" | "flow" | "core" | "ai" | "human";
  category: NodeCategory;
  label: string;
  subtitle?: string;
  icon: string;
  description: string;
  color: NodeColor;
  hasInput: boolean;
  hasOutput: boolean;
  hasBranch?: boolean;
  parameters?: NodeParameter[];
}

export interface NodeParameter {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "checkbox" | "conditions";
  value: string | number | boolean | ConditionsConfig;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

// Condition types for If/Else node
export interface ConditionRule {
  id: string;
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than"
    | "is_empty"
    | "is_not_empty";
  value: string;
}

export interface ConditionGroup {
  id: string;
  logic: "and" | "or";
  conditions: ConditionRule[];
}

export interface ConditionsConfig {
  groups: ConditionGroup[];
  groupLogic: "and" | "or";
}

// Workflow Types
export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    nodeType: string;
    parameters?: Record<string, string | number | boolean | ConditionsConfig>;
    output?: Record<string, unknown>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  animated?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "draft";
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
  executionCount: number;
}

// Store Types
export interface WorkflowState {
  // Workflows
  workflows: Workflow[];
  activeWorkflowId: string | null;

  // UI State
  selectedNodeId: string | null;
  isDarkMode: boolean;
  isRightPanelOpen: boolean;
  isAddNodePanelOpen: boolean;
  anpCategory: NodeCategory | null;
  anpSearchQuery: string;
  anpEdgeInsertId: string | null;
  anpSourceNodeId: string | null;
  anpSourceHandle: string | null;

  // Actions
  setActiveWorkflow: (id: string) => void;
  addWorkflow: (name: string) => void;
  deleteWorkflow: (id: string) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;

  // Node Actions
  addNode: (
    nodeType: string,
    position?: { x: number; y: number },
  ) => string | undefined;
  updateNode: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  updateNodePosition: (
    nodeId: string,
    position: { x: number; y: number },
  ) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;

  // Edge Actions
  addEdge: (
    source: string,
    target: string,
    sourceHandle?: string,
    targetHandle?: string,
  ) => void;
  deleteEdge: (edgeId: string) => void;
  insertNodeOnEdge: (edgeId: string, nodeType: string) => void;

  // UI Actions
  toggleDarkMode: () => void;
  toggleRightPanel: () => void;
  openRightPanel: () => void;
  closeRightPanel: () => void;
  toggleAddNodePanel: () => void;
  openAddNodePanel: (category?: NodeCategory) => void;
  openAddNodePanelForSource: (nodeId: string, sourceHandle?: string) => void;
  closeAddNodePanel: () => void;
  setAnpCategory: (category: NodeCategory | null) => void;
  setAnpSearchQuery: (query: string) => void;
  setAnpEdgeInsertId: (edgeId: string | null) => void;
  addNodeAndConnect: (
    nodeType: string,
    sourceNodeId: string,
    sourceHandle?: string,
  ) => void;

  // Node Clipboard Actions
  duplicateNode: (nodeId: string) => void;
  copyNode: (nodeId: string) => void;
  pasteNode: (position?: { x: number; y: number }) => void;
  cutNode: (nodeId: string) => void;
  copiedNode: WorkflowNode | null;

  // Layout Actions
  layoutNodes: () => void;

  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

// Category Definition
export interface CategoryDefinition {
  id: NodeCategory;
  label: string;
  description: string;
  icon: string;
}

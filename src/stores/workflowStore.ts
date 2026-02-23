import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  WorkflowState,
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  NodeCategory,
} from "../types";
import { getNodeDefinition } from "../utils/nodeConfig";

// Demo workflow - Telegram Financial Bot
const createDemoWorkflow = (): Workflow => ({
  id: "demo-workflow-1",
  name: "Telegram Financial Bot",
  description: "Log financial transactions via Telegram",
  status: "active",
  executionCount: 16,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  nodes: [
    {
      id: "node-1",
      type: "telegram-trigger",
      position: { x: 100, y: 100 },
      data: {
        label: "Telegram Trigger",
        nodeType: "trigger",
        parameters: { botToken: "demo-token", allowedChats: "" },
        output: { message: { text: "beli kopi 15000", chat: { id: 123456 } } },
      },
    },
    {
      id: "node-2",
      type: "edit-fields",
      position: { x: 350, y: 100 },
      data: {
        label: "Edit Fields",
        nodeType: "action",
        parameters: { fields: "text=message.text\nchatId=message.chat.id" },
        output: { text: "beli kopi 15000", chatId: 123456 },
      },
    },
    {
      id: "node-3",
      type: "if-else",
      position: { x: 600, y: 100 },
      data: {
        label: "If Contains Total",
        nodeType: "flow",
        parameters: { condition: "text.includes('total')" },
        output: { result: false },
      },
    },
    {
      id: "node-4",
      type: "ai-agent",
      position: { x: 850, y: 250 },
      data: {
        label: "AI Agent",
        nodeType: "ai",
        parameters: { prompt: "Extract financial data", model: "gpt-4" },
        output: { type: "expense", amount: 15000, notes: "kopi" },
      },
    },
    {
      id: "node-5",
      type: "code-js",
      position: { x: 1100, y: 250 },
      data: {
        label: "Code JS",
        nodeType: "core",
        parameters: { code: "return { ...data, valid: true };" },
        output: { type: "expense", amount: 15000, notes: "kopi", valid: true },
      },
    },
    {
      id: "node-6",
      type: "if-else",
      position: { x: 1350, y: 250 },
      data: {
        label: "If Valid",
        nodeType: "flow",
        parameters: { condition: "valid === true" },
        output: { result: true },
      },
    },
    {
      id: "node-7",
      type: "append-row",
      position: { x: 1600, y: 150 },
      data: {
        label: "Append Row",
        nodeType: "action",
        parameters: {
          spreadsheetId: "demo-sheet",
          sheetName: "Transactions",
          values: "type,amount,notes",
        },
        output: { success: true },
      },
    },
    {
      id: "node-8",
      type: "send-message",
      position: { x: 1850, y: 250 },
      data: {
        label: "Send Message",
        nodeType: "action",
        parameters: { chatId: "123456", message: "Transaction logged!" },
        output: { sent: true },
      },
    },
    {
      id: "node-9",
      type: "get-rows",
      position: { x: 850, y: -50 },
      data: {
        label: "Get Row(s)",
        nodeType: "data",
        parameters: { spreadsheetId: "demo-sheet", range: "A:Z" },
        output: { rows: [["expense", 15000, "kopi"]] },
      },
    },
    {
      id: "node-10",
      type: "ai-agent",
      position: { x: 1100, y: -50 },
      data: {
        label: "AI Agent 2",
        nodeType: "ai",
        parameters: { prompt: "Summarize total", model: "gpt-4" },
        output: { summary: "Total: 15000" },
      },
    },
    {
      id: "node-11",
      type: "send-message",
      position: { x: 1350, y: -50 },
      data: {
        label: "Send Total",
        nodeType: "action",
        parameters: { chatId: "123456", message: "Total: 15000" },
        output: { sent: true },
      },
    },
    {
      id: "node-12",
      type: "no-op",
      position: { x: 1600, y: 350 },
      data: {
        label: "No Operation",
        nodeType: "flow",
        parameters: {},
        output: {},
      },
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-2",
      source: "node-2",
      target: "node-3",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-3",
      source: "node-3",
      target: "node-4",
      sourceHandle: "false",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-4",
      source: "node-3",
      target: "node-9",
      sourceHandle: "true",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-5",
      source: "node-4",
      target: "node-5",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-6",
      source: "node-5",
      target: "node-6",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-7",
      source: "node-6",
      target: "node-7",
      sourceHandle: "true",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-8",
      source: "node-6",
      target: "node-12",
      sourceHandle: "false",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-9",
      source: "node-7",
      target: "node-8",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-10",
      source: "node-12",
      target: "node-8",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-11",
      source: "node-9",
      target: "node-10",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-12",
      source: "node-10",
      target: "node-11",
      type: "smoothstep",
      animated: true,
    },
  ],
});

// Initial state
const initialState = {
  workflows: [createDemoWorkflow()],
  activeWorkflowId: "demo-workflow-1",
  selectedNodeId: null,
  isDarkMode: false,
  isRightPanelOpen: false,
  isAddNodePanelOpen: false,
  anpCategory: null,
  anpSearchQuery: "",
  anpEdgeInsertId: null,
  anpSourceNodeId: null,
  anpSourceHandle: null,
  copiedNode: null,
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Workflow Actions
      setActiveWorkflow: (id: string) => {
        set({
          activeWorkflowId: id,
          selectedNodeId: null,
          isRightPanelOpen: false,
        });
      },

      addWorkflow: (name: string) => {
        const newWorkflow: Workflow = {
          id: `workflow-${Date.now()}`,
          name,
          status: "draft",
          executionCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodes: [],
          edges: [],
        };
        set((state) => ({
          workflows: [...state.workflows, newWorkflow],
          activeWorkflowId: newWorkflow.id,
          selectedNodeId: null,
        }));
        get().saveToLocalStorage();
      },

      deleteWorkflow: (id: string) => {
        const state = get();
        if (state.workflows.length <= 1) return; // Don't delete last workflow

        const newWorkflows = state.workflows.filter((w) => w.id !== id);
        const newActiveId =
          state.activeWorkflowId === id
            ? newWorkflows[0]?.id || null
            : state.activeWorkflowId;

        set({
          workflows: newWorkflows,
          activeWorkflowId: newActiveId,
          selectedNodeId: null,
          isRightPanelOpen: false,
        });
        get().saveToLocalStorage();
      },

      updateWorkflow: (id: string, updates: Partial<Workflow>) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id
              ? { ...w, ...updates, updatedAt: new Date().toISOString() }
              : w,
          ),
        }));
        get().saveToLocalStorage();
      },

      // Node Actions
      addNode: (nodeType: string, position?: { x: number; y: number }) => {
        const state = get();
        const activeWorkflow = state.workflows.find(
          (w) => w.id === state.activeWorkflowId,
        );
        if (!activeWorkflow) return;

        const nodeDef = getNodeDefinition(nodeType);
        if (!nodeDef) return;

        const newNodeId = `node-${Date.now()}`;
        const newPosition = position || {
          x: 400 + Math.random() * 200,
          y: 200 + Math.random() * 100,
        };

        const newNode: WorkflowNode = {
          id: newNodeId,
          type: nodeType,
          position: newPosition,
          data: {
            label: nodeDef.label,
            nodeType: nodeDef.type,
            parameters:
              nodeDef.parameters?.reduce(
                (acc, p) => {
                  acc[p.id] = p.value;
                  return acc;
                },
                {} as Record<string, string | number | boolean>,
              ) || {},
            output: {},
          },
        };

        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  nodes: [...w.nodes, newNode],
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
          selectedNodeId: newNodeId,
          isRightPanelOpen: true,
        }));

        get().saveToLocalStorage();
        return newNodeId;
      },

      updateNode: (nodeId: string, data: Partial<WorkflowNode["data"]>) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  nodes: w.nodes.map((n) =>
                    n.id === nodeId
                      ? { ...n, data: { ...n.data, ...data } }
                      : n,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
        }));
        get().saveToLocalStorage();
      },

      deleteNode: (nodeId: string) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  nodes: w.nodes.filter((n) => n.id !== nodeId),
                  edges: w.edges.filter(
                    (e) => e.source !== nodeId && e.target !== nodeId,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
          selectedNodeId:
            state.selectedNodeId === nodeId ? null : state.selectedNodeId,
          isRightPanelOpen:
            state.selectedNodeId === nodeId ? false : state.isRightPanelOpen,
        }));
        get().saveToLocalStorage();
      },

      setSelectedNode: (nodeId: string | null) => {
        set({ selectedNodeId: nodeId });
      },

      // Edge Actions
      addEdge: (
        source: string,
        target: string,
        sourceHandle?: string,
        targetHandle?: string,
      ) => {
        const state = get();
        const activeWorkflow = state.workflows.find(
          (w) => w.id === state.activeWorkflowId,
        );
        if (!activeWorkflow) return;

        // Check if edge already exists
        const edgeExists = activeWorkflow.edges.some(
          (e) =>
            e.source === source &&
            e.target === target &&
            e.sourceHandle === sourceHandle,
        );
        if (edgeExists) return;

        const newEdge: WorkflowEdge = {
          id: `edge-${Date.now()}`,
          source,
          target,
          sourceHandle,
          targetHandle,
          type: "smoothstep",
          animated: true,
        };

        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  edges: [...w.edges, newEdge],
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
        }));
        get().saveToLocalStorage();
      },

      deleteEdge: (edgeId: string) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  edges: w.edges.filter((e) => e.id !== edgeId),
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
        }));
        get().saveToLocalStorage();
      },

      insertNodeOnEdge: (edgeId: string, nodeType: string) => {
        const state = get();
        const activeWorkflow = state.workflows.find(
          (w) => w.id === state.activeWorkflowId,
        );
        if (!activeWorkflow) return;

        const edge = activeWorkflow.edges.find((e) => e.id === edgeId);
        if (!edge) return;

        const nodeDef = getNodeDefinition(nodeType);
        if (!nodeDef) return;

        // Calculate position between source and target
        const sourceNode = activeWorkflow.nodes.find(
          (n) => n.id === edge.source,
        );
        const targetNode = activeWorkflow.nodes.find(
          (n) => n.id === edge.target,
        );

        // Node width offset for spacing (approximate width of a node)
        const NODE_SPACING = 250;

        // Calculate new position - place between source and target
        const newPosition = {
          x:
            sourceNode && targetNode
              ? (sourceNode.position.x + targetNode.position.x) / 2
              : 400,
          y:
            sourceNode && targetNode
              ? (sourceNode.position.y + targetNode.position.y) / 2
              : 200,
        };

        // Shift nodes that are to the right of the target node
        const updatedNodes = activeWorkflow.nodes.map((node) => {
          // Shift target node and all nodes to its right
          if (targetNode && node.position.x >= targetNode.position.x) {
            return {
              ...node,
              position: {
                ...node.position,
                x: node.position.x + NODE_SPACING,
              },
            };
          }
          return node;
        });

        const newNodeId = `node-${Date.now()}`;
        const newNode: WorkflowNode = {
          id: newNodeId,
          type: nodeType,
          position: newPosition,
          data: {
            label: nodeDef.label,
            nodeType: nodeDef.type,
            parameters:
              nodeDef.parameters?.reduce(
                (acc, p) => {
                  acc[p.id] = p.value;
                  return acc;
                },
                {} as Record<string, string | number | boolean>,
              ) || {},
            output: {},
          },
        };

        // Create new edges
        const newEdge1: WorkflowEdge = {
          id: `edge-${Date.now()}-1`,
          source: edge.source,
          target: newNodeId,
          sourceHandle: edge.sourceHandle,
          type: "smoothstep",
          animated: true,
        };

        const newEdge2: WorkflowEdge = {
          id: `edge-${Date.now()}-2`,
          source: newNodeId,
          target: edge.target,
          targetHandle: edge.targetHandle,
          type: "smoothstep",
          animated: true,
        };

        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  nodes: [...updatedNodes, newNode],
                  edges: [
                    ...w.edges.filter((e) => e.id !== edgeId),
                    newEdge1,
                    newEdge2,
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
          selectedNodeId: newNodeId,
          isRightPanelOpen: true,
          anpEdgeInsertId: null,
        }));

        get().saveToLocalStorage();
      },

      // UI Actions
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          // Update document class
          if (newDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDarkMode: newDarkMode };
        });
        get().saveToLocalStorage();
      },

      toggleRightPanel: () => {
        set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen }));
      },

      openRightPanel: () => {
        set({ isRightPanelOpen: true });
      },

      closeRightPanel: () => {
        set({ isRightPanelOpen: false, selectedNodeId: null });
      },

      toggleAddNodePanel: () => {
        set((state) => ({
          isAddNodePanelOpen: !state.isAddNodePanelOpen,
          anpCategory: null,
          anpSearchQuery: "",
        }));
      },

      openAddNodePanel: (category?: NodeCategory) => {
        set({
          isAddNodePanelOpen: true,
          anpCategory: category || null,
          anpSearchQuery: "",
          anpSourceNodeId: null,
          anpSourceHandle: null,
        });
      },

      openAddNodePanelForSource: (nodeId: string, sourceHandle?: string) => {
        set({
          isAddNodePanelOpen: true,
          anpCategory: null,
          anpSearchQuery: "",
          anpSourceNodeId: nodeId,
          anpSourceHandle: sourceHandle || null,
          anpEdgeInsertId: null,
        });
      },

      closeAddNodePanel: () => {
        set({
          isAddNodePanelOpen: false,
          anpCategory: null,
          anpSearchQuery: "",
          anpEdgeInsertId: null,
          anpSourceNodeId: null,
          anpSourceHandle: null,
        });
      },

      setAnpCategory: (category: NodeCategory | null) => {
        set({ anpCategory: category });
      },

      setAnpSearchQuery: (query: string) => {
        set({ anpSearchQuery: query });
      },

      setAnpEdgeInsertId: (edgeId: string | null) => {
        set({ anpEdgeInsertId: edgeId });
      },

      addNodeAndConnect: (
        nodeType: string,
        sourceNodeId: string,
        sourceHandle?: string,
      ) => {
        const state = get();
        const activeWorkflow = state.workflows.find(
          (w) => w.id === state.activeWorkflowId,
        );
        if (!activeWorkflow) return;

        const nodeDef = getNodeDefinition(nodeType);
        if (!nodeDef) return;

        // Find source node to calculate position
        const sourceNode = activeWorkflow.nodes.find(
          (n) => n.id === sourceNodeId,
        );
        const NODE_SPACING_X = 250;
        const NODE_SPACING_Y = 150;

        // Calculate position based on source handle (for If/Else branching)
        let newPosition = {
          x: 400 + Math.random() * 200,
          y: 200 + Math.random() * 100,
        };

        if (sourceNode) {
          const sourceNodeDef = getNodeDefinition(sourceNode.type);
          const hasBranch = sourceNodeDef?.hasBranch;

          if (hasBranch && sourceHandle) {
            // If/Else node - position based on branch
            if (sourceHandle === "true") {
              // True branch goes UP (negative Y)
              newPosition = {
                x: sourceNode.position.x + NODE_SPACING_X,
                y: sourceNode.position.y - NODE_SPACING_Y,
              };
            } else if (sourceHandle === "false") {
              // False branch goes DOWN (positive Y)
              newPosition = {
                x: sourceNode.position.x + NODE_SPACING_X,
                y: sourceNode.position.y + NODE_SPACING_Y,
              };
            } else {
              // Default output handle
              newPosition = {
                x: sourceNode.position.x + NODE_SPACING_X,
                y: sourceNode.position.y,
              };
            }
          } else {
            // Regular node - position to the right
            newPosition = {
              x: sourceNode.position.x + NODE_SPACING_X,
              y: sourceNode.position.y,
            };
          }
        }

        // Check for existing nodes at the same position and adjust
        const existingNodesAtPosition = activeWorkflow.nodes.filter(
          (n) =>
            Math.abs(n.position.x - newPosition.x) < 50 &&
            Math.abs(n.position.y - newPosition.y) < 50,
        );

        if (existingNodesAtPosition.length > 0) {
          // Find the lowest Y position among existing nodes and place below
          const minY = Math.min(
            ...existingNodesAtPosition.map((n) => n.position.y),
          );
          const maxY = Math.max(
            ...existingNodesAtPosition.map((n) => n.position.y),
          );

          // Adjust position to avoid overlap
          if (sourceHandle === "true") {
            newPosition.y = minY - NODE_SPACING_Y;
          } else if (sourceHandle === "false") {
            newPosition.y = maxY + NODE_SPACING_Y;
          } else {
            newPosition.y = maxY + NODE_SPACING_Y;
          }
        }

        const newNodeId = `node-${Date.now()}`;
        const newNode: WorkflowNode = {
          id: newNodeId,
          type: nodeType,
          position: newPosition,
          data: {
            label: nodeDef.label,
            nodeType: nodeDef.type,
            parameters:
              nodeDef.parameters?.reduce(
                (acc, p) => {
                  acc[p.id] = p.value;
                  return acc;
                },
                {} as Record<string, string | number | boolean>,
              ) || {},
            output: {},
          },
        };

        // Create edge from source to new node
        const newEdge: WorkflowEdge = {
          id: `edge-${Date.now()}`,
          source: sourceNodeId,
          target: newNodeId,
          sourceHandle: sourceHandle,
          type: "smoothstep",
          animated: true,
        };

        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  nodes: [...w.nodes, newNode],
                  edges: [...w.edges, newEdge],
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
          selectedNodeId: newNodeId,
          isRightPanelOpen: true,
          anpSourceNodeId: null,
          anpSourceHandle: null,
        }));

        get().saveToLocalStorage();
      },

      // Persistence
      saveToLocalStorage: () => {
        const state = get();
        const dataToSave = {
          workflows: state.workflows,
          activeWorkflowId: state.activeWorkflowId,
          isDarkMode: state.isDarkMode,
        };
        localStorage.setItem(
          "workflow-automation-data",
          JSON.stringify(dataToSave),
        );
      },

      loadFromLocalStorage: () => {
        try {
          const saved = localStorage.getItem("workflow-automation-data");
          if (saved) {
            const data = JSON.parse(saved);
            set({
              workflows: data.workflows || [createDemoWorkflow()],
              activeWorkflowId: data.activeWorkflowId || "demo-workflow-1",
              isDarkMode: data.isDarkMode || false,
            });

            // Apply dark mode
            if (data.isDarkMode) {
              document.documentElement.classList.add("dark");
            }
          }
        } catch (error) {
          console.error("Failed to load from localStorage:", error);
        }
      },

      // Node Clipboard Actions
      duplicateNode: (nodeId: string) => {
        const state = get();
        const activeWorkflow = state.workflows.find(
          (w) => w.id === state.activeWorkflowId,
        );
        if (!activeWorkflow) return;

        const nodeToDuplicate = activeWorkflow.nodes.find(
          (n) => n.id === nodeId,
        );
        if (!nodeToDuplicate) return;

        const newNodeId = `node-${Date.now()}`;
        const newNode: WorkflowNode = {
          ...nodeToDuplicate,
          id: newNodeId,
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50,
          },
          data: {
            ...nodeToDuplicate.data,
            label: `${nodeToDuplicate.data.label} (copy)`,
          },
        };

        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  nodes: [...w.nodes, newNode],
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
          selectedNodeId: newNodeId,
          isRightPanelOpen: true,
        }));

        get().saveToLocalStorage();
      },

      copyNode: (nodeId: string) => {
        const state = get();
        const activeWorkflow = state.workflows.find(
          (w) => w.id === state.activeWorkflowId,
        );
        if (!activeWorkflow) return;

        const nodeToCopy = activeWorkflow.nodes.find((n) => n.id === nodeId);
        if (!nodeToCopy) return;

        set({ copiedNode: JSON.parse(JSON.stringify(nodeToCopy)) });
      },

      pasteNode: (position?: { x: number; y: number }) => {
        const state = get();
        if (!state.copiedNode) return;

        const activeWorkflow = state.workflows.find(
          (w) => w.id === state.activeWorkflowId,
        );
        if (!activeWorkflow) return;

        const newNodeId = `node-${Date.now()}`;
        const newPosition = position || {
          x: state.copiedNode.position.x + 50,
          y: state.copiedNode.position.y + 50,
        };

        const newNode: WorkflowNode = {
          ...state.copiedNode,
          id: newNodeId,
          position: newPosition,
          data: {
            ...state.copiedNode.data,
            label: `${state.copiedNode.data.label} (pasted)`,
          },
        };

        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  nodes: [...w.nodes, newNode],
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
          selectedNodeId: newNodeId,
          isRightPanelOpen: true,
        }));

        get().saveToLocalStorage();
      },

      cutNode: (nodeId: string) => {
        const state = get();
        const activeWorkflow = state.workflows.find(
          (w) => w.id === state.activeWorkflowId,
        );
        if (!activeWorkflow) return;

        const nodeToCut = activeWorkflow.nodes.find((n) => n.id === nodeId);
        if (!nodeToCut) return;

        // Copy the node first
        set({ copiedNode: JSON.parse(JSON.stringify(nodeToCut)) });

        // Then delete it
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === state.activeWorkflowId
              ? {
                  ...w,
                  nodes: w.nodes.filter((n) => n.id !== nodeId),
                  edges: w.edges.filter(
                    (e) => e.source !== nodeId && e.target !== nodeId,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : w,
          ),
          selectedNodeId: null,
          isRightPanelOpen: false,
        }));

        get().saveToLocalStorage();
      },
    }),
    {
      name: "workflow-automation-store",
      partialize: (state) => ({
        workflows: state.workflows,
        activeWorkflowId: state.activeWorkflowId,
        isDarkMode: state.isDarkMode,
      }),
    },
  ),
);

// Initialize dark mode on load
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("workflow-automation-store");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.state?.isDarkMode) {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {
      // Ignore
    }
  }
}

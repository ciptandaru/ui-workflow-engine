import { NodeDefinition, CategoryDefinition } from "../types";

// Category Definitions
export const categories: CategoryDefinition[] = [
  {
    id: "ai",
    label: "AI",
    description: "Agents, summarize, search documents",
    icon: "Brain",
  },
  {
    id: "actions",
    label: "Action in an app",
    description: "Google Sheets, Telegram, Notion",
    icon: "AppWindow",
  },
  {
    id: "data",
    label: "Data transformation",
    description: "Manipulate, filter, convert",
    icon: "Database",
  },
  {
    id: "flow",
    label: "Flow",
    description: "Branch, merge, loop",
    icon: "GitBranch",
  },
  {
    id: "core",
    label: "Core",
    description: "Code, HTTP requests, webhooks",
    icon: "Code",
  },
  {
    id: "human",
    label: "Human review",
    description: "Approval via Slack/Telegram",
    icon: "UserCheck",
  },
  {
    id: "triggers",
    label: "Add another trigger",
    description: "Multiple triggers per workflow",
    icon: "Zap",
  },
];

// Node Definitions
export const nodeDefinitions: NodeDefinition[] = [
  // Triggers
  {
    id: "manual-trigger",
    type: "trigger",
    category: "triggers",
    label: "Manual Trigger",
    subtitle: "Run workflow manually",
    icon: "Play",
    description: "Triggers workflow execution manually with a button click",
    color: {
      border: "border-emerald-400 dark:border-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/40",
      text: "text-emerald-500",
      iconBg: "bg-emerald-500",
    },
    hasInput: false,
    hasOutput: true,
    parameters: [
      {
        id: "testData",
        label: "Test Data (JSON)",
        type: "textarea",
        value: "{}",
        placeholder: '{"key": "value"}',
      },
    ],
  },
  {
    id: "telegram-trigger",
    type: "trigger",
    category: "triggers",
    label: "Telegram Trigger",
    subtitle: "On message received",
    icon: "MessageSquare",
    description: "Triggers when a message is received via Telegram bot",
    color: {
      border: "border-blue-400 dark:border-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-500",
      iconBg: "bg-blue-500",
    },
    hasInput: false,
    hasOutput: true,
    parameters: [
      {
        id: "botToken",
        label: "Bot Token",
        type: "text",
        value: "",
        placeholder: "Enter bot token",
      },
      {
        id: "allowedChats",
        label: "Allowed Chat IDs",
        type: "text",
        value: "",
        placeholder: "Comma separated",
      },
    ],
  },
  {
    id: "webhook",
    type: "trigger",
    category: "triggers",
    label: "Webhook",
    subtitle: "HTTP trigger",
    icon: "Webhook",
    description: "Triggers when an HTTP request is received",
    color: {
      border: "border-orange-400 dark:border-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/40",
      text: "text-orange-500",
      iconBg: "bg-orange-500",
    },
    hasInput: false,
    hasOutput: true,
    parameters: [
      {
        id: "path",
        label: "Webhook Path",
        type: "text",
        value: "/webhook",
        placeholder: "/webhook",
      },
      {
        id: "method",
        label: "HTTP Method",
        type: "select",
        value: "POST",
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
        ],
      },
    ],
  },
  {
    id: "schedule-trigger",
    type: "trigger",
    category: "triggers",
    label: "Schedule Trigger",
    subtitle: "Cron based trigger",
    icon: "Clock",
    description: "Triggers on a schedule using cron expression",
    color: {
      border: "border-amber-400 dark:border-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/40",
      text: "text-amber-500",
      iconBg: "bg-amber-500",
    },
    hasInput: false,
    hasOutput: true,
    parameters: [
      {
        id: "cron",
        label: "Cron Expression",
        type: "text",
        value: "0 * * * *",
        placeholder: "0 * * * *",
      },
    ],
  },

  // Actions
  {
    id: "edit-fields",
    type: "action",
    category: "actions",
    label: "Edit Fields",
    subtitle: "Set field values",
    icon: "Edit3",
    description: "Edit or set field values in the data",
    color: {
      border: "border-violet-400 dark:border-violet-600",
      bg: "bg-violet-100 dark:bg-violet-900/40",
      text: "text-violet-500",
      iconBg: "bg-violet-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "fields",
        label: "Fields to Set",
        type: "textarea",
        value: "",
        placeholder: "field: value",
      },
    ],
  },
  {
    id: "send-message",
    type: "action",
    category: "actions",
    label: "Send Message",
    subtitle: "Telegram send",
    icon: "Send",
    description: "Send a message via Telegram",
    color: {
      border: "border-cyan-400 dark:border-cyan-600",
      bg: "bg-cyan-100 dark:bg-cyan-900/40",
      text: "text-cyan-500",
      iconBg: "bg-cyan-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "chatId",
        label: "Chat ID",
        type: "text",
        value: "",
        placeholder: "Enter chat ID",
      },
      {
        id: "message",
        label: "Message",
        type: "textarea",
        value: "",
        placeholder: "Enter message",
      },
    ],
  },
  {
    id: "append-row",
    type: "action",
    category: "actions",
    label: "Append Row",
    subtitle: "Google Sheets",
    icon: "Table",
    description: "Append a row to Google Sheets",
    color: {
      border: "border-green-400 dark:border-green-600",
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-500",
      iconBg: "bg-green-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "spreadsheetId",
        label: "Spreadsheet ID",
        type: "text",
        value: "",
        placeholder: "Enter spreadsheet ID",
      },
      {
        id: "sheetName",
        label: "Sheet Name",
        type: "text",
        value: "Sheet1",
        placeholder: "Sheet1",
      },
      {
        id: "values",
        label: "Row Values",
        type: "textarea",
        value: "",
        placeholder: "Comma separated values",
      },
    ],
  },
  {
    id: "http-request",
    type: "action",
    category: "actions",
    label: "HTTP Request",
    subtitle: "Make HTTP call",
    icon: "Globe",
    description: "Make an HTTP request to any API",
    color: {
      border: "border-rose-400 dark:border-rose-600",
      bg: "bg-rose-100 dark:bg-rose-900/40",
      text: "text-rose-500",
      iconBg: "bg-rose-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "url",
        label: "URL",
        type: "text",
        value: "",
        placeholder: "https://api.example.com",
      },
      {
        id: "method",
        label: "Method",
        type: "select",
        value: "GET",
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
        ],
      },
      {
        id: "headers",
        label: "Headers",
        type: "textarea",
        value: "",
        placeholder: "Content-Type: application/json",
      },
    ],
  },

  // Data
  {
    id: "get-rows",
    type: "data",
    category: "data",
    label: "Get Row(s)",
    subtitle: "Google Sheets",
    icon: "Sheet",
    description: "Get rows from Google Sheets",
    color: {
      border: "border-emerald-400 dark:border-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/40",
      text: "text-emerald-500",
      iconBg: "bg-emerald-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "spreadsheetId",
        label: "Spreadsheet ID",
        type: "text",
        value: "",
        placeholder: "Enter spreadsheet ID",
      },
      {
        id: "range",
        label: "Range",
        type: "text",
        value: "A:Z",
        placeholder: "A:Z",
      },
    ],
  },

  // Flow
  {
    id: "if-else",
    type: "flow",
    category: "flow",
    label: "If / If-Else",
    subtitle: "Conditional branch",
    icon: "GitBranch",
    description: "Branch workflow based on condition",
    color: {
      border: "border-amber-400 dark:border-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/40",
      text: "text-amber-500",
      iconBg: "bg-amber-500",
    },
    hasInput: true,
    hasOutput: true,
    hasBranch: true,
    parameters: [
      {
        id: "conditions",
        label: "Conditions",
        type: "conditions",
        value: {
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
        },
      },
    ],
  },
  {
    id: "filter",
    type: "flow",
    category: "flow",
    label: "Filter",
    subtitle: "Filter items",
    icon: "Filter",
    description: "Filter items based on condition",
    color: {
      border: "border-red-400 dark:border-red-600",
      bg: "bg-red-100 dark:bg-red-900/40",
      text: "text-red-500",
      iconBg: "bg-red-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "field",
        label: "Field",
        type: "text",
        value: "",
        placeholder: "Field to filter",
      },
      {
        id: "operator",
        label: "Operator",
        type: "select",
        value: "equals",
        options: [
          { label: "Equals", value: "equals" },
          { label: "Contains", value: "contains" },
          { label: "Greater Than", value: "gt" },
          { label: "Less Than", value: "lt" },
        ],
      },
      {
        id: "value",
        label: "Value",
        type: "text",
        value: "",
        placeholder: "Filter value",
      },
    ],
  },
  {
    id: "switch",
    type: "flow",
    category: "flow",
    label: "Switch",
    subtitle: "Multiple branches",
    icon: "Route",
    description: "Route to multiple branches based on value",
    color: {
      border: "border-purple-400 dark:border-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/40",
      text: "text-purple-500",
      iconBg: "bg-purple-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "field",
        label: "Field to Check",
        type: "text",
        value: "",
        placeholder: "Field name",
      },
    ],
  },
  {
    id: "no-op",
    type: "flow",
    category: "flow",
    label: "No Operation",
    subtitle: "Pass through",
    icon: "Minus",
    description: "Does nothing, just passes data through",
    color: {
      border: "border-slate-400 dark:border-slate-600",
      bg: "bg-slate-100 dark:bg-slate-900/40",
      text: "text-slate-500",
      iconBg: "bg-slate-500",
    },
    hasInput: true,
    hasOutput: false,
  },

  // Core
  {
    id: "code-js",
    type: "core",
    category: "core",
    label: "Code JS",
    subtitle: "JavaScript code",
    icon: "Code",
    description: "Run custom JavaScript code",
    color: {
      border: "border-gray-400 dark:border-gray-600",
      bg: "bg-gray-100 dark:bg-gray-900/40",
      text: "text-gray-500",
      iconBg: "bg-gray-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "code",
        label: "JavaScript Code",
        type: "textarea",
        value: "",
        placeholder: "// Your code here\nreturn data;",
      },
    ],
  },

  // AI
  {
    id: "ai-agent",
    type: "ai",
    category: "ai",
    label: "AI Agent",
    subtitle: "Analyze intent",
    icon: "Brain",
    description: "AI agent to analyze and process data",
    color: {
      border: "border-purple-400 dark:border-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/40",
      text: "text-purple-500",
      iconBg: "bg-purple-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "prompt",
        label: "System Prompt",
        type: "textarea",
        value: "",
        placeholder: "Enter system prompt",
      },
      {
        id: "model",
        label: "Model",
        type: "select",
        value: "gpt-4",
        options: [
          { label: "GPT-4", value: "gpt-4" },
          { label: "GPT-3.5", value: "gpt-3.5-turbo" },
          { label: "Claude", value: "claude-3" },
        ],
      },
    ],
  },
  {
    id: "openai",
    type: "ai",
    category: "ai",
    label: "OpenAI",
    subtitle: "GPT completion",
    icon: "Sparkles",
    description: "OpenAI GPT completion",
    color: {
      border: "border-teal-400 dark:border-teal-600",
      bg: "bg-teal-100 dark:bg-teal-900/40",
      text: "text-teal-500",
      iconBg: "bg-teal-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "prompt",
        label: "Prompt",
        type: "textarea",
        value: "",
        placeholder: "Enter prompt",
      },
      {
        id: "model",
        label: "Model",
        type: "select",
        value: "gpt-4",
        options: [
          { label: "GPT-4", value: "gpt-4" },
          { label: "GPT-3.5", value: "gpt-3.5-turbo" },
        ],
      },
    ],
  },
  {
    id: "ai-transform",
    type: "ai",
    category: "ai",
    label: "AI Transform",
    subtitle: "Transform data",
    icon: "Wand2",
    description: "Transform data using AI",
    color: {
      border: "border-pink-400 dark:border-pink-600",
      bg: "bg-pink-100 dark:bg-pink-900/40",
      text: "text-pink-500",
      iconBg: "bg-pink-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "instruction",
        label: "Transform Instruction",
        type: "textarea",
        value: "",
        placeholder: "How to transform the data",
      },
    ],
  },

  // Human
  {
    id: "human-review",
    type: "human",
    category: "human",
    label: "Human Review",
    subtitle: "Approval required",
    icon: "UserCheck",
    description: "Require human approval before continuing",
    color: {
      border: "border-orange-400 dark:border-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/40",
      text: "text-orange-500",
      iconBg: "bg-orange-500",
    },
    hasInput: true,
    hasOutput: true,
    parameters: [
      {
        id: "reviewers",
        label: "Reviewers",
        type: "text",
        value: "",
        placeholder: "Comma separated chat IDs",
      },
      { id: "timeout", label: "Timeout (hours)", type: "number", value: 24 },
    ],
  },
];

// Get nodes by category
export const getNodesByCategory = (category: string): NodeDefinition[] => {
  return nodeDefinitions.filter((node) => node.category === category);
};

// Get node definition by ID
export const getNodeDefinition = (id: string): NodeDefinition | undefined => {
  return nodeDefinitions.find((node) => node.id === id);
};

// Search nodes
export const searchNodes = (query: string): NodeDefinition[] => {
  const lowerQuery = query.toLowerCase();
  return nodeDefinitions.filter(
    (node) =>
      node.label.toLowerCase().includes(lowerQuery) ||
      (node.subtitle && node.subtitle.toLowerCase().includes(lowerQuery)) ||
      node.description.toLowerCase().includes(lowerQuery),
  );
};

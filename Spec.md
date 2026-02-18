# CLAUDE.md

_Workflow Visual Builder — React MVP_

**Product Requirements & Technical Specification | Version 6.0**

**Stack: React + TypeScript + Zustand + Tailwind CSS**

---

## 1. Project Overview

A React-based Workflow Visual Builder MVP inspired by n8n and Zapier. Users visually construct automation workflows by connecting trigger and action nodes on an interactive canvas. The MVP focuses on core UI functionality with all data mocked locally using React state — no backend required.

The codebase is written in full TypeScript with typed state, props, event handlers, and node definitions.

---

## 2. Primary Use Cases

### Use Case 1: Financial Transaction Logger (Telegram Bot)

- User sends a message via Telegram (trigger)
- System routes the message: if it contains 'total' → query path; otherwise → transaction log path
- AI Agent parses natural language to extract financial data (type, amount, notes)
- Validated entries appended to Google Sheets; invalid ones dropped
- Confirmation sent back to user via Telegram

### Use Case 2: Simple Lead Capture Automation

- Webhook trigger receives form submission
- If statement checks if email is valid
- Valid leads: append to CRM sheet + send welcome email
- Invalid leads: send error notification

---

## 3. UI Layout & Wireframe Specification

### 3.1 Top-Level Layout

| Zone                        | Width          | Description                                                            |
| --------------------------- | -------------- | ---------------------------------------------------------------------- |
| Left Sidebar — Workflows    | 220px fixed    | List of all workflows; add/delete; active highlighted blue             |
| Main Canvas                 | Flexible fill  | Infinite pan/zoom board; nodes, edges, minimap                         |
| Right Panel — Node Editor   | 290px slide-in | Node detail editor shown on node click; parameters, output JSON        |
| Right Panel — Add Node (V4) | 340px slide-in | "What happens next?" panel; category list → node list → drop to canvas |

### 3.2 Top Toolbar

- Logo / App name on the left
- Workflow name and breadcrumb
- Execution counter badge (e.g. 16/1000)
- Execute workflow button (green)
- Right icon strip (n8n-style): + Add Node, Search, Templates, History, Dark/Light toggle

### 3.3 Right Icon Strip — V4 (n8n-style)

| Button    | Icon           | Action                                     |
| --------- | -------------- | ------------------------------------------ |
| Add Node  | + (red accent) | Opens "What happens next?" slide-in panel  |
| Search    | magnifier      | Opens panel with search input auto-focused |
| Templates | workflow       | Placeholder (future feature)               |
| History   | clock rotate   | Placeholder (future feature)               |
| Theme     | sun/moon       | Toggles dark/light mode                    |

### 3.4 Add Node Panel — "What happens next?" (V4)

- Slides in from the RIGHT side of screen (340px wide)
- Triggered by: clicking + button, pressing Tab keyboard shortcut, or clicking search magnifier
- Header: "What happens next?" title (large bold 2-line) + close (X) button
- Search bar: real-time filter across all node labels and subtitles
- **Level 1 — Category cards:** icon, name, description, chevron arrow
  - AI — agents, summarize, search documents
  - Action in an app — Google Sheets, Telegram, Notion
  - Data transformation — manipulate, filter, convert
  - Flow — branch, merge, loop
  - Core — code, HTTP requests, webhooks
  - Human review — approval via Slack/Telegram
  - Add another trigger — multiple triggers per workflow
- **Level 2** — Click category → back bar appears + node list for that category
- Click any node row → dropped to canvas center with flash highlight animation
- Tab key toggles open/close; Escape closes
- Minimap shifts position automatically when panel is open

---

## 4. Feature Set by Version

### 4.1 V1 — Core Features

- Interactive canvas: pan, zoom, minimap
- 5 node types: Trigger, Action, If/Else, AI Agent, Code
- Node connections by dragging handles
- Right panel: node inspector with mock parameters + output JSON
- Demo workflow pre-loaded: Telegram Financial Bot

### 4.2 V2 — Added Features

- 🌙☀️ Dark/Light mode toggle in toolbar
- ➕🗑️ Multi-workflow management in left sidebar (add, delete, switch)
- 🗂️ Node palette n8n-style (2-level: category → node list + search)
- 💰 Full TypeScript: Workflow, WFNode, WFEdge, NodeDef, Theme interfaces

### 4.3 V3 — Added Features

- 🔗 Edge hover buttons: + (insert node) and 🗑️ (delete edge) at midpoint
- 🖱️ Drag-to-connect handles: output handle → drag → drop on input handle
- If node: true (green) and false (red) handles independently draggable
- NodePicker popup spawns at edge midpoint in canvas coordinates

### 4.4 V4 — Added Features

**Add Node Button + "What happens next?" Panel**

- Red + button added to right side of toolbar (matches n8n design)
- Clicking opens a 340px slide-in panel from the right edge of screen
- Panel title: "What happens next?" — large, bold, 2-line heading
- Search bar: searches node label and subtitle in real-time
- 7 category cards with icon, name, description, arrow chevron
- Level 2: click category → back bar + node list for that category
- Click node → drops to canvas center with flash highlight animation
- Tab = toggle open/close; Escape = close
- Minimap shifts automatically when panel is open

### 4.5 V5 — Behavior Fixes & UX Improvements

**👆 Single-click = Select, Double-click = Edit Panel**

- Single click on a node: selects it (highlights border) but does NOT open the right panel
- Double-click on a node: opens the right panel with parameters and output preview
- This matches n8n behavior: drag does not accidentally open the panel
- Drag detection: mouse move > 4px = drag; less = click. Prevents click firing after drag.

**✅ NodePicker from Edge + Button Fixed**

- Picker popup position now calculated correctly in screen coordinates (r.left + canvas offset)
- Picker state resets properly when opened from edge (title = "Insert node", back hidden)
- Search input cleared and category reset on every open

**🆕 Auto-open Panel for Newly Added Nodes**

- When a node is inserted via edge + button: right panel auto-opens immediately
- When a node is added via "What happens next?" panel: right panel auto-opens immediately
- This matches n8n UX: new node is ready to configure right away

**💬 Double-click Tooltip Hint**

- Hovering any node shows tooltip: "Double-click to edit"
- Selected node tooltip: "Double-click to edit · Del to delete"
- Canvas hint bar updated: "Single-click = select · Double-click = edit · ..."

### 4.6 V6 — Edge Insert Fix & ANP Mode (Current)

**🔗 Edge + → Right Panel (not floating modal)**

- Clicking + on an edge now opens the "What happens next?" (ANP) panel on the right — not a floating picker
- ANP enters "edge insert" mode: a red banner appears above the node list
- Panel title: badge "⟵ Insert node" + contextual text
- Search still works normally in insert mode

**✅ insertOnEdge Logic Fix (Critical Bug)**

- Bug: `anpEdgeInsertId` was reset to null by `closeAddNodePanel()` before `insertOnEdge()` could use it
- Fix: save ID to a local variable BEFORE closing the panel → close → insert
- New order: save edgeId → `closeAddNodePanel()` → `insertOnEdge(savedId, type)`
- `insertOnEdge` internally: delete old edge → push new node → push 2 new edges → render → `setTimeout openPanel`

**🎨 Visual Insert Mode Banner**

- Red banner shown in category list, subcategory list, and search results when in insert mode
- Banner text: "Pilih node untuk disisipkan di antara koneksi"
- Closing the panel resets all insert mode state

---

## 5. Node Type Reference

| Type             | Color   | Category | Input | Output     | Branch |
| ---------------- | ------- | -------- | ----- | ---------- | ------ |
| Telegram Trigger | #0088cc | Triggers | No    | Yes        | No     |
| Webhook          | #ff6b35 | Triggers | No    | Yes        | No     |
| Schedule Trigger | #ff9800 | Triggers | No    | Yes        | No     |
| Edit Fields      | #7c4dff | Actions  | Yes   | Yes        | No     |
| Send Message     | #0088cc | Actions  | Yes   | No         | No     |
| Append Row       | #34a853 | Actions  | Yes   | Yes        | No     |
| HTTP Request     | #ff6b35 | Actions  | Yes   | Yes        | No     |
| Get Rows         | #34a853 | Data     | Yes   | Yes        | No     |
| Code JS          | #607d8b | Core     | Yes   | Yes        | No     |
| If / If-Else     | #ff9800 | Flow     | Yes   | true+false | Yes    |
| Filter           | #f44336 | Flow     | Yes   | Yes        | No     |
| Switch           | #9c27b0 | Flow     | Yes   | Yes        | No     |
| No Operation     | #546e7a | Flow     | Yes   | No         | No     |
| AI Agent         | #9c27b0 | AI       | Yes   | Yes        | No     |
| OpenAI           | #10a37f | AI       | Yes   | Yes        | No     |
| AI Transform     | #e91e63 | AI       | Yes   | Yes        | No     |
| Human Review     | #ff5722 | Core     | Yes   | Yes        | No     |

---

## 6. Future Backend Plan

### 6.1 REST + WebSocket API

| Endpoint                        | Method | Description                     |
| ------------------------------- | ------ | ------------------------------- |
| POST /api/workflows             | POST   | Save workflow JSON              |
| GET /api/workflows/:id          | GET    | Load workflow by ID             |
| POST /api/workflows/:id/execute | POST   | Trigger execution               |
| WS /api/workflows/:id/status    | WS     | Real-time node execution status |

### 6.2 Third-Party Integrations

| Integration   | MVP (Mock)                | Future (Real)                 |
| ------------- | ------------------------- | ----------------------------- |
| Telegram      | Fake message JSON         | node-telegram-bot-api webhook |
| Google Sheets | Local array state         | googleapis npm package        |
| OpenAI / GPT  | Hardcoded response string | openai npm package            |
| HTTP Request  | axios mock adapter        | axios real HTTP               |

---

## 7. Reference Workflow — Telegram Financial Bot

The demo workflow pre-loaded in the app demonstrates the full feature set:

1. **Telegram Trigger** — receives all messages from bot
2. **Edit Fields** — extracts message text, chat ID
3. **If1** — condition: message.text contains 'total'
4. **TRUE branch** → Get Row(s) → AI Agent2 → Send Message (query total)
5. **FALSE branch** → AI Agent → Code JS → If2 (validate) → Append Row / No-Op → Send Message

---

_Version 6.0 | Workflow Visual Builder MVP_

**Built for React + TypeScript + React Flow + Zustand**
